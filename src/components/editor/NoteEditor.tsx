'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import ImageExt from '@tiptap/extension-image';
import LinkExt from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, List, ListOrdered, CheckSquare,
  Quote, Code, Image, Link, AlignLeft, AlignCenter, AlignRight,
  Highlighter, Undo, Redo, Wand2, Layers, HelpCircle, ScanLine, Bot, Check, Languages
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export default function NoteEditor({ content, onChange, editable = true }: NoteEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your note...' }),
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      ImageExt,
      LinkExt.configure({ openOnClick: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: content || '',
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) editor.setEditable(editable);
  }, [editable, editor]);

  if (!editor) return null;

  const ToolButton = ({ onClick, active, children, title, className = '' }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-all duration-300 ${active ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'} ${className}`}
    >
      {children}
    </button>
  );

  const simulateAILoading = (feature: string) => {
    const loadingToast = toast.loading(`Initiating ${feature}...`);
    setTimeout(() => {
      toast.success(`${feature} complete! (Mock)`, { id: loadingToast });
    }, 1500);
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 tiptap-editor">
      {/* Toolbar */}
      {editable && (
        <div className="shrink-0 flex flex-wrap items-center gap-0.5 px-4 py-3 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm z-10 sticky top-0">
          {/* Text Style */}
          <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold" className="hover:bg-blue-50 group">
            <Bold size={16} className={`transition-colors ${editor.isActive('bold') ? 'text-indigo-700' : 'text-blue-500 group-hover:text-blue-700'}`} />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic" className="hover:bg-blue-50 group">
            <Italic size={16} className={`transition-colors ${editor.isActive('italic') ? 'text-indigo-700' : 'text-blue-500 group-hover:text-blue-700'}`} />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline" className="hover:bg-blue-50 group">
            <UnderlineIcon size={16} className={`transition-colors ${editor.isActive('underline') ? 'text-indigo-700' : 'text-blue-500 group-hover:text-blue-700'}`} />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough" className="hover:bg-blue-50 group">
            <Strikethrough size={16} className={`transition-colors ${editor.isActive('strike') ? 'text-indigo-700' : 'text-blue-500 group-hover:text-blue-700'}`} />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight" className="hover:bg-yellow-100 group">
            <Highlighter size={16} className={`transition-colors ${editor.isActive('highlight') ? 'text-indigo-700' : 'text-yellow-600 group-hover:text-yellow-700'}`} />
          </ToolButton>

          <div className="w-px h-5 bg-slate-200/60 mx-1.5" />

          {/* Headings */}
          <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1" className="hover:bg-violet-50 group">
            <Heading1 size={16} className={`transition-colors ${editor.isActive('heading', { level: 1 }) ? 'text-indigo-700' : 'text-violet-500 group-hover:text-violet-700'}`} />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2" className="hover:bg-violet-50 group">
            <Heading2 size={16} className={`transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-indigo-700' : 'text-violet-500 group-hover:text-violet-700'}`} />
          </ToolButton>

          <div className="w-px h-5 bg-slate-200/60 mx-1.5" />

          {/* Lists */}
          <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List" className="hover:bg-emerald-50 group">
            <List size={16} className={`transition-colors ${editor.isActive('bulletList') ? 'text-indigo-700' : 'text-emerald-500 group-hover:text-emerald-700'}`} />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List" className="hover:bg-emerald-50 group">
            <ListOrdered size={16} className={`transition-colors ${editor.isActive('orderedList') ? 'text-indigo-700' : 'text-emerald-500 group-hover:text-emerald-700'}`} />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title="Task List" className="hover:bg-emerald-50 group">
            <CheckSquare size={16} className={`transition-colors ${editor.isActive('taskList') ? 'text-indigo-700' : 'text-emerald-500 group-hover:text-emerald-700'}`} />
          </ToolButton>

          <div className="w-px h-5 bg-slate-200/60 mx-1.5" />

          {/* Blocks */}
          <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote" className="hover:bg-amber-50 group">
            <Quote size={16} className={`transition-colors ${editor.isActive('blockquote') ? 'text-indigo-700' : 'text-amber-500 group-hover:text-amber-700'}`} />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block" className="hover:bg-amber-50 group">
            <Code size={16} className={`transition-colors ${editor.isActive('codeBlock') ? 'text-indigo-700' : 'text-amber-500 group-hover:text-amber-700'}`} />
          </ToolButton>

          <div className="w-px h-5 bg-slate-200/60 mx-1.5" />

          {/* Alignment */}
          <ToolButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left" className="hover:bg-rose-50 group">
            <AlignLeft size={16} className={`transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'text-indigo-700' : 'text-rose-400 group-hover:text-rose-600'}`} />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center" className="hover:bg-rose-50 group">
            <AlignCenter size={16} className={`transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'text-indigo-700' : 'text-rose-400 group-hover:text-rose-600'}`} />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right" className="hover:bg-rose-50 group">
            <AlignRight size={16} className={`transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'text-indigo-700' : 'text-rose-400 group-hover:text-rose-600'}`} />
          </ToolButton>

          <div className="w-px h-5 bg-slate-200/60 mx-1.5" />

          {/* Media */}
          <ToolButton onClick={() => {
            const url = window.prompt('Enter image URL:');
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }} title="Insert Image" className="hover:bg-cyan-50 group">
            <Image size={16} className="text-cyan-500 group-hover:text-cyan-600 transition-colors" />
          </ToolButton>
          <ToolButton onClick={() => {
            const url = window.prompt('Enter link URL:');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }} active={editor.isActive('link')} title="Insert Link" className="hover:bg-cyan-50 group">
            <Link size={16} className={`transition-colors ${editor.isActive('link') ? 'text-indigo-700' : 'text-cyan-500 group-hover:text-cyan-600'}`} />
          </ToolButton>

          <div className="flex-1 min-w-[10px]" />

          {/* Premium AI Features Group */}
          <div className="flex items-center gap-0.5 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-1 rounded-xl border border-indigo-100/30">
            <ToolButton onClick={() => simulateAILoading('AI AI Writer')} title="Ask AI" className="hover:bg-indigo-100 hover:text-indigo-600 group">
              <Bot size={16} className="text-indigo-500 group-hover:text-indigo-600 group-hover:scale-110 transition-transform" />
            </ToolButton>
            <div className="w-px h-4 bg-indigo-200/50 mx-0.5" />
            <ToolButton onClick={() => simulateAILoading('Document Summarization')} title="Summarize Note" className="hover:bg-purple-100 hover:text-purple-600 group">
              <Wand2 size={16} className="text-purple-500 group-hover:text-purple-600 group-hover:scale-110 transition-transform" />
            </ToolButton>
            <ToolButton onClick={() => simulateAILoading('Flashcard Generation')} title="Generate Flashcards" className="hover:bg-pink-100 hover:text-pink-600 group">
              <Layers size={16} className="text-pink-500 group-hover:text-pink-600 group-hover:scale-110 transition-transform" />
            </ToolButton>
            <ToolButton onClick={() => simulateAILoading('Quiz Generation')} title="Create Quiz" className="hover:bg-emerald-100 hover:text-emerald-600 group">
              <HelpCircle size={16} className="text-emerald-500 group-hover:text-emerald-600 group-hover:scale-110 transition-transform" />
            </ToolButton>
            <ToolButton onClick={() => simulateAILoading('OCR Engine')} title="Extract Text (OCR)" className="hover:bg-orange-100 hover:text-orange-600 group">
              <ScanLine size={16} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
            </ToolButton>
            <ToolButton onClick={() => simulateAILoading('Grammar & Translation')} title="Check Grammar / Translate" className="hover:bg-cyan-100 hover:text-cyan-600 group">
              <Languages size={16} className="text-cyan-500 group-hover:text-cyan-600 group-hover:scale-110 transition-transform" />
            </ToolButton>
          </div>

          <div className="w-px h-8 bg-slate-200/40 mx-2" />

          <ToolButton onClick={() => editor.chain().focus().undo().run()} title="Undo" className="hover:bg-slate-100 group">
            <Undo size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().redo().run()} title="Redo" className="hover:bg-slate-100 group">
            <Redo size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </ToolButton>
        </div>
      )}

      {/* Editor CSS Fixes for Task Lists */}
      <style jsx global>{`
        .tiptap-editor ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        .tiptap-editor ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        .tiptap-editor ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-right: 0.75rem;
          margin-top: 0.35rem; /* Optical baseline alignment */
          user-select: none;
        }
        .tiptap-editor ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }
        .tiptap-editor ul[data-type="taskList"] li > div > p {
          margin: 0;
        }
      `}</style>
      
      {/* Editor */}
      <EditorContent 
        editor={editor} 
        className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10 custom-scrollbar relative prose prose-slate lg:prose-lg max-w-none [&>.ProseMirror]:min-h-full [&>.ProseMirror]:outline-none" 
      />
    </div>
  );
}
