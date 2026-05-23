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
  Highlighter, Undo, Redo, Wand2, Layers, HelpCircle, ScanLine, Bot, Check, Languages,
  X, ChevronLeft, ChevronRight, Copy, RotateCw, Award, BookOpen, ArrowRight, Eye, Sparkles
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { publicApi } from '@/services/api';

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

  // AI Feature States
  const [aiFeature, setAiFeature] = useState<'ask' | 'summarize' | 'flashcards' | 'quiz' | 'ocr' | 'translate' | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);

  // Overlay Sub-states
  const [activeFlashcard, setActiveFlashcard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeQuizQuestion, setActiveQuizQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [ocrImageUrl, setOcrImageUrl] = useState('');

  // Model Selection states
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'gemini' | 'deepseek'>('openai');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [hasOpenAI, setHasOpenAI] = useState(false);
  const [hasGemini, setHasGemini] = useState(false);
  const [hasDeepSeek, setHasDeepSeek] = useState(false);

  // Resolve API Keys, Base URLs, and Models
  const getAIConfig = async () => {
    let openaiKey = typeof window !== 'undefined' ? localStorage.getItem('notexa_personal_openai_key') || '' : '';
    let geminiKey = typeof window !== 'undefined' ? localStorage.getItem('notexa_personal_gemini_key') || '' : '';
    let deepseekKey = typeof window !== 'undefined' ? localStorage.getItem('notexa_personal_deepseek_key') || '' : '';
    
    let openaiBase = typeof window !== 'undefined' ? localStorage.getItem('notexa_personal_openai_base') || '' : '';
    let openaiModel = typeof window !== 'undefined' ? localStorage.getItem('notexa_personal_openai_model') || '' : '';
    let geminiBase = typeof window !== 'undefined' ? localStorage.getItem('notexa_personal_gemini_base') || '' : '';
    let geminiModel = typeof window !== 'undefined' ? localStorage.getItem('notexa_personal_gemini_model') || '' : '';
    let deepseekBase = typeof window !== 'undefined' ? localStorage.getItem('notexa_personal_deepseek_base') || '' : '';
    let deepseekModel = typeof window !== 'undefined' ? localStorage.getItem('notexa_personal_deepseek_model') || '' : '';

    let provider = 'openai';

    if (!openaiKey && process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }
    if (!geminiKey && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    }

    try {
      const res = await publicApi.settings();
      const settingsList = res.data?.data || res.data || [];
      if (Array.isArray(settingsList)) {
        const opKeySetting = settingsList.find((s: any) => s.key === 'openai_api_key')?.value;
        const gemKeySetting = settingsList.find((s: any) => s.key === 'gemini_api_key')?.value;
        const dsKeySetting = settingsList.find((s: any) => s.key === 'deepseek_api_key')?.value;
        const provSetting = settingsList.find((s: any) => s.key === 'ai_provider')?.value;
        const enabledSetting = settingsList.find((s: any) => s.key === 'ai_enabled')?.value;
        
        const opBaseSetting = settingsList.find((s: any) => s.key === 'openai_base_url')?.value;
        const opModelSetting = settingsList.find((s: any) => s.key === 'openai_model')?.value;
        const gemBaseSetting = settingsList.find((s: any) => s.key === 'gemini_base_url')?.value;
        const gemModelSetting = settingsList.find((s: any) => s.key === 'gemini_model')?.value;
        const dsBaseSetting = settingsList.find((s: any) => s.key === 'deepseek_base_url')?.value;
        const dsModelSetting = settingsList.find((s: any) => s.key === 'deepseek_model')?.value;

        if (enabledSetting === 'true' || enabledSetting === true) {
          if (opKeySetting) openaiKey = opKeySetting;
          if (gemKeySetting) geminiKey = gemKeySetting;
          if (dsKeySetting) deepseekKey = dsKeySetting;
          if (provSetting) provider = provSetting;
          if (opBaseSetting) openaiBase = opBaseSetting;
          if (opModelSetting) openaiModel = opModelSetting;
          if (gemBaseSetting) geminiBase = gemBaseSetting;
          if (gemModelSetting) geminiModel = gemModelSetting;
          if (dsBaseSetting) deepseekBase = dsBaseSetting;
          if (dsModelSetting) deepseekModel = dsModelSetting;
        }
      }
    } catch (e) {
      console.warn("Using personal local keys:", e);
    }

    return { 
      openaiKey, 
      geminiKey, 
      deepseekKey,
      provider,
      openaiBase: openaiBase || 'https://api.openai.com/v1',
      openaiModel: openaiModel || 'gpt-4o-mini',
      geminiBase: geminiBase || 'https://generativelanguage.googleapis.com/v1beta',
      geminiModel: geminiModel || 'gemini-1.5-flash',
      deepseekBase: deepseekBase || 'https://api.deepseek.com',
      deepseekModel: deepseekModel || 'deepseek-chat'
    };
  };

  const callOpenAI = async (key: string, base: string, model: string, systemPrompt: string, userPrompt: string) => {
    const cleanBase = base.replace(/\/+$/, '');
    const url = `${cleanBase}/chat/completions`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI error: ${res.statusText}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  };

  const callGemini = async (key: string, base: string, model: string, systemPrompt: string, userPrompt: string) => {
    const cleanBase = base.replace(/\/+$/, '');
    const url = `${cleanBase}/models/${model}:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: `${systemPrompt}\n\nUser request:\n${userPrompt}` }] }
        ],
        generationConfig: { temperature: 0.7 }
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini error: ${res.statusText}`);
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  };

  const runAICall = async (systemPrompt: string, userPrompt: string) => {
    const config = await getAIConfig();
    const provider = selectedProvider;
    const model = selectedModel;

    if (provider === 'openai') {
      if (!config.openaiKey) {
        throw new Error("OpenAI API key is missing. Please add it in Settings under 'Personal AI Workspace' or in the Admin Panel.");
      }
      return await callOpenAI(config.openaiKey, config.openaiBase, model || config.openaiModel, systemPrompt, userPrompt);
    } else if (provider === 'deepseek') {
      if (!config.deepseekKey) {
        throw new Error("DeepSeek API key is missing. Please add it in Settings under 'Personal AI Workspace' or in the Admin Panel.");
      }
      return await callOpenAI(config.deepseekKey, config.deepseekBase, model || config.deepseekModel, systemPrompt, userPrompt);
    } else {
      if (!config.geminiKey) {
        throw new Error("Gemini API key is missing. Please add it in Settings under 'Personal AI Workspace' or in the Admin Panel.");
      }
      return await callGemini(config.geminiKey, config.geminiBase, model || config.geminiModel, systemPrompt, userPrompt);
    }
  };

  useEffect(() => {
    const checkKeys = async () => {
      const config = await getAIConfig();
      const hasOp = !!config.openaiKey;
      const hasGem = !!config.geminiKey;
      const hasDs = !!config.deepseekKey;
      setHasOpenAI(hasOp);
      setHasGemini(hasGem);
      setHasDeepSeek(hasDs);
      
      if (hasDs) {
        setSelectedProvider('deepseek');
        setSelectedModel(config.deepseekModel || 'deepseek-chat');
      } else if (hasOp) {
        setSelectedProvider('openai');
        setSelectedModel(config.openaiModel || 'gpt-4o-mini');
      } else if (hasGem) {
        setSelectedProvider('gemini');
        setSelectedModel(config.geminiModel || 'gemini-1.5-flash');
      }
    };
    checkKeys();
  }, []);

  const extractJSON = (text: string) => {
    try {
      const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
      const raw = match ? match[1] : text;
      return JSON.parse(raw.trim());
    } catch (e) {
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      if (start !== -1 && end !== -1) {
        return JSON.parse(text.substring(start, end + 1));
      }
      const startObj = text.indexOf('{');
      const endObj = text.lastIndexOf('}');
      if (startObj !== -1 && endObj !== -1) {
        return JSON.parse(text.substring(startObj, endObj + 1));
      }
      throw new Error("AI returned invalid format. Please try again!");
    }
  };

  // AI Feature Handlers
  const handleAskAI = async () => {
    if (!editor) return;
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult('');
    const originalText = editor.getText();
    try {
      const sysPrompt = "You are a stellar academic writing assistant. Answer the user prompt concisely and structure your content beautifully using readable paragraphs or markdown lists.";
      const res = await runAICall(sysPrompt, `User prompt: ${aiPrompt}\n\nContext of note so far:\n${originalText}`);
      setAiResult(res);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate AI response.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleQuickPrompt = async (action: string) => {
    if (!editor) return;
    setAiLoading(true);
    setAiResult('');
    const selectedText = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, ' ') || editor.getText();
    try {
      const sysPrompt = "You are a precise study and academic editor. Edit the following text as instructed and output only the updated text without headers or conversational preamble.";
      const promptMap: Record<string, string> = {
        simplify: `Simplify this content for an introductory learner:\n\n${selectedText}`,
        elaborate: `Elaborate on this concept, adding thorough details and scientific depth:\n\n${selectedText}`,
        professional: `Change the tone of this text to highly professional and academic:\n\n${selectedText}`,
        actions: `Extract key actionable bullet items and todo checkmarks from this text:\n\n${selectedText}`
      };
      const res = await runAICall(sysPrompt, promptMap[action]);
      setAiResult(res);
    } catch (err: any) {
      toast.error(err.message || "Failed to complete smart prompt.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!editor) return;
    setAiFeature('summarize');
    setAiLoading(true);
    setAiResult(null);
    const contentText = editor.getText() || 'Start typing notes to enable smart summarization.';
    try {
      const sysPrompt = "Create a structured, executive study summary of the text provided. Highlight the core theme, list 3 key highlights in a bulleted list, and finish with a summary outline. Respond with clean, beautiful HTML format using <h3>, <p>, and <ul> tags.";
      const res = await runAICall(sysPrompt, contentText);
      setAiResult(res);
    } catch (err: any) {
      toast.error(err.message || "Could not generate summary.");
      setAiFeature(null);
    } finally {
      setAiLoading(false);
    }
  };

  const handleFlashcards = async () => {
    if (!editor) return;
    setAiFeature('flashcards');
    setAiLoading(true);
    setAiResult(null);
    setActiveFlashcard(0);
    setShowAnswer(false);
    const contentText = editor.getText();
    try {
      const sysPrompt = "Analyze the text and output a JSON array containing exactly 5 critical study flashcards. Output ONLY a valid JSON array of objects, where each object has exact properties: 'question' and 'answer'. Do not output any backticks or markdown preamble, just raw JSON.";
      const res = await runAICall(sysPrompt, contentText);
      const parsed = extractJSON(res);
      setAiResult(parsed);
    } catch (err: any) {
      toast.error(err.message || "Could not generate flashcards.");
      setAiFeature(null);
    } finally {
      setAiLoading(false);
    }
  };

  const handleQuiz = async () => {
    if (!editor) return;
    setAiFeature('quiz');
    setAiLoading(true);
    setAiResult(null);
    setActiveQuizQuestion(0);
    setQuizScore(0);
    setQuizSelectedOption(null);
    setShowQuizResults(false);
    const contentText = editor.getText();
    try {
      const sysPrompt = "Generate 5 multiple-choice questions based on the text. Output ONLY a valid JSON array of objects, where each object has: 'question': string, 'options': 4 strings, 'correctAnswer': index (0-3), and 'explanation': string. No preamble, no backticks, just raw JSON.";
      const res = await runAICall(sysPrompt, contentText);
      const parsed = extractJSON(res);
      setAiResult(parsed);
    } catch (err: any) {
      toast.error(err.message || "Could not generate quiz.");
      setAiFeature(null);
    } finally {
      setAiLoading(false);
    }
  };

  const handleOCR = async () => {
    if (!ocrImageUrl.trim()) return;
    setAiLoading(true);
    setAiResult('');
    try {
      const sysPrompt = "You are a perfect OCR text extraction machine. Extract all legible text from the image url provided. Return only the plain transcribed text without labels, markdown formatting, or preamble.";
      const res = await runAICall(sysPrompt, ocrImageUrl);
      setAiResult(res);
    } catch (err: any) {
      toast.error(err.message || "Failed to extract text from image.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!editor) return;
    setAiLoading(true);
    setAiResult('');
    const selectedText = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, ' ') || editor.getText();
    try {
      const sysPrompt = `You are a fluent scholarly translator. Translate the provided text into ${targetLanguage}. Maintain technical terminology, structural flow, and output ONLY the translated result without any commentary.`;
      const res = await runAICall(sysPrompt, selectedText);
      setAiResult(res);
    } catch (err: any) {
      toast.error(err.message || "Translation failed.");
    } finally {
      setAiLoading(false);
    }
  };

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

  if (!editor) return null;

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 tiptap-editor relative">
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

          {/* AI Model Selector */}
          {(hasOpenAI || hasGemini || hasDeepSeek) && (
            <div className="flex items-center gap-0.5 bg-indigo-50/70 border border-indigo-100/40 p-1 rounded-xl shrink-0 shadow-sm mr-1">
              <Sparkles size={13} className="text-indigo-500 pl-1 shrink-0 animate-pulse" />
              <select
                value={`${selectedProvider}:${selectedModel}`}
                onChange={(e) => {
                  const [prov, mod] = e.target.value.split(':');
                  setSelectedProvider(prov as 'openai' | 'gemini' | 'deepseek');
                  setSelectedModel(mod);
                }}
                className="bg-transparent border-none outline-none text-[10px] font-bold text-indigo-700 py-0.5 pl-1 pr-6 cursor-pointer focus:ring-0 select-none"
              >
                {hasDeepSeek && (
                  <optgroup label="DeepSeek Models">
                    <option value="deepseek:deepseek-chat">DeepSeek Chat</option>
                    <option value="deepseek:deepseek-coder">DeepSeek Coder</option>
                  </optgroup>
                )}
                {hasOpenAI && (
                  <optgroup label="OpenAI Models">
                    <option value="openai:gpt-4o-mini">GPT 4o Mini</option>
                    <option value="openai:gpt-4o">GPT 4o</option>
                    <option value="openai:gpt-3.5-turbo">GPT 3.5 Turbo</option>
                  </optgroup>
                )}
                {hasGemini && (
                  <optgroup label="Gemini Models">
                    <option value="gemini:gemini-1.5-flash">Gemini 1.5 Flash</option>
                    <option value="gemini:gemini-1.5-pro">Gemini 1.5 Pro</option>
                  </optgroup>
                )}
              </select>
            </div>
          )}

          {/* Premium AI Features Group */}
          <div className="flex items-center gap-0.5 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-1 rounded-xl border border-indigo-100/30">
            <ToolButton onClick={() => { setAiFeature('ask'); setAiResult(''); setAiPrompt(''); }} title="Ask AI" className="hover:bg-indigo-100 hover:text-indigo-600 group">
              <Bot size={16} className="text-indigo-500 group-hover:text-indigo-600 group-hover:scale-110 transition-transform" />
            </ToolButton>
            <div className="w-px h-4 bg-indigo-200/50 mx-0.5" />
            <ToolButton onClick={handleSummarize} title="Summarize Note" className="hover:bg-purple-100 hover:text-purple-600 group">
              <Wand2 size={16} className="text-purple-500 group-hover:text-purple-600 group-hover:scale-110 transition-transform" />
            </ToolButton>
            <ToolButton onClick={handleFlashcards} title="Generate Flashcards" className="hover:bg-pink-100 hover:text-pink-600 group">
              <Layers size={16} className="text-pink-500 group-hover:text-pink-600 group-hover:scale-110 transition-transform" />
            </ToolButton>
            <ToolButton onClick={handleQuiz} title="Create Quiz" className="hover:bg-emerald-100 hover:text-emerald-600 group">
              <HelpCircle size={16} className="text-emerald-500 group-hover:text-emerald-600 group-hover:scale-110 transition-transform" />
            </ToolButton>
            <ToolButton onClick={() => { setAiFeature('ocr'); setAiResult(''); setOcrImageUrl(''); }} title="Extract Text (OCR)" className="hover:bg-orange-100 hover:text-orange-600 group">
              <ScanLine size={16} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
            </ToolButton>
            <ToolButton onClick={() => { setAiFeature('translate'); setAiResult(''); }} title="Check Grammar / Translate" className="hover:bg-cyan-100 hover:text-cyan-600 group">
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
          margin-top: 0.35rem;
          user-select: none;
        }
        .tiptap-editor ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }
        .tiptap-editor ul[data-type="taskList"] li > div > p {
          margin: 0;
        }
        .flip-card {
          perspective: 1000px;
        }
        .flip-card-inner {
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card-flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          backface-visibility: hidden;
          position: absolute;
          inset: 0;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
      
      {/* Editor */}
      <EditorContent 
        editor={editor} 
        className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10 custom-scrollbar relative prose prose-slate lg:prose-lg max-w-none [&>.ProseMirror]:min-h-full [&>.ProseMirror]:outline-none" 
      />

      {/* ═══════════════════════════════════════════
           AI OVERLAY POPUPS (HIGH-FIDELITY WIDGETS)
         ═══════════════════════════════════════════ */}

      {/* Overlay 1: Ask AI */}
      {aiFeature === 'ask' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white/95 border border-indigo-100 rounded-3xl shadow-2xl w-full max-w-lg p-6 max-h-[85vh] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <h2 className="text-lg font-extrabold flex items-center gap-2 text-indigo-900">
                <Bot size={22} className="text-indigo-600" /> Smart AI Writer
              </h2>
              <button onClick={() => setAiFeature(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-1 custom-scrollbar">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask me to explain a concept, structure a paragraph, create tables, or draft research summaries..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition-all bg-slate-50 resize-none font-medium"
              />

              {/* Prebuilt Action Chips */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">QUICK EDITS (USES SELECTED TEXT)</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleQuickPrompt('simplify')} className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold flex items-center gap-1 transition">
                    <Sparkles size={12} /> Simplify Text
                  </button>
                  <button onClick={() => handleQuickPrompt('elaborate')} className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold flex items-center gap-1 transition">
                    <Wand2 size={12} /> Elaborate Concept
                  </button>
                  <button onClick={() => handleQuickPrompt('professional')} className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold flex items-center gap-1 transition">
                    <Award size={12} /> Make Academic
                  </button>
                  <button onClick={() => handleQuickPrompt('actions')} className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold flex items-center gap-1 transition">
                    <Check size={12} /> Action Items
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {aiLoading && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-xs text-indigo-700 font-bold animate-pulse">Assistant is drafting model output...</p>
                </div>
              )}

              {/* Result Area */}
              {aiResult && (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GENERATED CONTENT</p>
                    <button onClick={() => { navigator.clipboard.writeText(aiResult); toast.success('Copied!'); }} className="text-slate-400 hover:text-slate-700 transition flex items-center gap-1 text-xs font-bold">
                      <Copy size={12} /> Copy
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {aiResult}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            {aiResult && (
              <div className="flex gap-3 border-t border-slate-100 pt-4 mt-4 shrink-0">
                <button
                  onClick={() => { editor.chain().focus().insertContent(aiResult).run(); setAiFeature(null); toast.success('Inserted!'); }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 transition"
                >
                  Insert at Cursor <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => { editor.chain().focus().setContent(aiResult).run(); setAiFeature(null); toast.success('Replaced Note!'); }}
                  className="px-4 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-bold transition"
                >
                  Replace Note
                </button>
              </div>
            )}

            {!aiResult && !aiLoading && (
              <button
                onClick={handleAskAI}
                disabled={!aiPrompt.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md disabled:opacity-50 mt-4 transition"
              >
                Compose Prompt
              </button>
            )}
          </div>
        </div>
      )}

      {/* Overlay 2: Summarize Drawer */}
      {aiFeature === 'summarize' && (
        <div className="absolute top-0 right-0 bottom-0 w-80 bg-white/95 backdrop-blur-md border-l border-slate-200/80 shadow-2xl z-20 p-5 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-1 custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <h2 className="text-base font-extrabold flex items-center gap-1.5 text-purple-900">
                <Wand2 size={18} className="text-purple-600" /> AI Smart Summary
              </h2>
              <button onClick={() => setAiFeature(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition">
                <X size={16} />
              </button>
            </div>

            {aiLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="h-8 w-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                <p className="text-xs text-purple-700 font-bold animate-pulse">Formulating summary outline...</p>
              </div>
            ) : (
              aiResult && (
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none text-slate-700 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: aiResult }} />
                  <button onClick={() => { navigator.clipboard.writeText(aiResult.replace(/<[^>]*>/g, '')); toast.success('Summary copied!'); }} className="w-full py-2 bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5">
                    <Copy size={12} /> Copy Plain Text
                  </button>
                </div>
              )
            )}
          </div>

          {aiResult && !aiLoading && (
            <button
              onClick={() => {
                editor.chain().focus().insertContent(`<br/><hr/><h3>AI Summary Notes</h3>${aiResult}`).run();
                setAiFeature(null);
                toast.success('Summary appended!');
              }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-md shadow-purple-600/10 mt-4 shrink-0 transition"
            >
              Append Summary to Note
            </button>
          )}
        </div>
      )}

      {/* Overlay 3: Flashcard Flipping Arena */}
      {aiFeature === 'flashcards' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-pink-100 rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <h2 className="text-lg font-extrabold flex items-center gap-2 text-pink-900">
                <Layers size={22} className="text-pink-600" /> Flashcard Arena
              </h2>
              <button onClick={() => setAiFeature(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition">
                <X size={18} />
              </button>
            </div>

            {aiLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="h-10 w-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
                <p className="text-xs text-pink-700 font-bold animate-pulse">Extracting concepts into study cards...</p>
              </div>
            ) : (
              aiResult && aiResult.length > 0 && (
                <div className="space-y-6 flex-1 flex flex-col justify-center items-center">
                  {/* Card Indicator */}
                  <span className="px-3 py-1 bg-pink-50 border border-pink-100 text-pink-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Card {activeFlashcard + 1} of {aiResult.length}
                  </span>

                  {/* 3D Flip Card Container */}
                  <div
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="w-full aspect-[4/3] flip-card cursor-pointer group shrink-0"
                  >
                    <div className={`w-full h-full relative rounded-3xl shadow-lg border border-pink-100/60 duration-500 flip-card-inner ${showAnswer ? 'flip-card-flipped' : ''}`}>
                      {/* Front: Question */}
                      <div className="flip-card-front bg-gradient-to-br from-pink-50/20 to-white flex flex-col justify-center items-center p-6 text-center rounded-3xl">
                        <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-3">QUESTION</span>
                        <p className="text-lg font-extrabold text-slate-800 leading-snug">{aiResult[activeFlashcard].question}</p>
                        <span className="text-xs text-slate-400 mt-6 flex items-center gap-1 font-bold group-hover:text-pink-600 transition"><Eye size={12} /> Click Card to Reveal Answer</span>
                      </div>

                      {/* Back: Answer */}
                      <div className="flip-card-back bg-slate-900 flex flex-col justify-center items-center p-6 text-center rounded-3xl">
                        <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-3">ANSWER</span>
                        <p className="text-base font-bold text-white leading-relaxed">{aiResult[activeFlashcard].answer}</p>
                        <span className="text-xs text-pink-400/80 mt-6 flex items-center gap-1 font-bold"><RotateCw size={12} /> Click Card to Flip Back</span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex justify-between items-center gap-4 w-full pt-4">
                    <button
                      disabled={activeFlashcard === 0}
                      onClick={() => { setActiveFlashcard(activeFlashcard - 1); setShowAnswer(false); }}
                      className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <button
                      disabled={activeFlashcard === aiResult.length - 1}
                      onClick={() => { setActiveFlashcard(activeFlashcard + 1); setShowAnswer(false); }}
                      className="flex-1 py-3 bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-40 rounded-xl text-sm font-bold shadow-md shadow-pink-600/10 transition flex items-center justify-center gap-2"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Overlay 4: Quiz Scorecard Arena */}
      {aiFeature === 'quiz' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-emerald-100 rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[85vh] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <h2 className="text-lg font-extrabold flex items-center gap-2 text-emerald-900">
                <HelpCircle size={22} className="text-emerald-600" /> Interactive Smart Quiz
              </h2>
              <button onClick={() => setAiFeature(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition">
                <X size={18} />
              </button>
            </div>

            {aiLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="h-10 w-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-xs text-emerald-700 font-bold animate-pulse">Formulating scholarly questionnaire...</p>
              </div>
            ) : (
              aiResult && aiResult.length > 0 && (
                <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                  {!showQuizResults ? (
                    <div className="space-y-4">
                      {/* Score & Progress */}
                      <div className="flex justify-between items-center bg-slate-50 border border-slate-100/50 rounded-xl p-3">
                        <span className="text-[10px] font-bold text-slate-500">QUESTION {activeQuizQuestion + 1} OF {aiResult.length}</span>
                        <span className="text-[10px] font-bold text-emerald-700">SCORE: {quizScore}/{aiResult.length}</span>
                      </div>

                      {/* Question */}
                      <p className="text-base font-extrabold text-slate-800 leading-snug">{aiResult[activeQuizQuestion].question}</p>

                      {/* Options */}
                      <div className="space-y-2.5 pt-2">
                        {aiResult[activeQuizQuestion].options.map((opt: string, i: number) => {
                          const isCorrect = i === aiResult[activeQuizQuestion].correctAnswer;
                          const isSelected = i === quizSelectedOption;
                          let optStyle = "border-slate-200 hover:bg-slate-50 text-slate-700";
                          
                          if (quizSelectedOption !== null) {
                            if (isCorrect) optStyle = "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-sm shadow-emerald-500/10";
                            else if (isSelected) optStyle = "bg-rose-50 border-rose-400 text-rose-800 font-bold shadow-sm shadow-rose-400/10";
                            else optStyle = "opacity-45 border-slate-200 cursor-not-allowed";
                          }

                          return (
                            <button
                              key={i}
                              disabled={quizSelectedOption !== null}
                              onClick={() => {
                                setQuizSelectedOption(i);
                                if (i === aiResult[activeQuizQuestion].correctAnswer) {
                                  setQuizScore(quizScore + 1);
                                  toast.success('Correct answer!');
                                } else {
                                  toast.error('Incorrect option!');
                                }
                              }}
                              className={`w-full text-left p-3.5 border-2 rounded-xl text-xs font-semibold leading-relaxed transition-all flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSelectedOption !== null && isCorrect && <Check size={16} className="text-emerald-600 shrink-0 ml-2" />}
                              {quizSelectedOption !== null && isSelected && !isCorrect && <X size={16} className="text-rose-600 shrink-0 ml-2" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Callout */}
                      {quizSelectedOption !== null && (
                        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">EXPLANATION</p>
                          <p className="text-[11px] font-semibold text-slate-600 leading-normal">{aiResult[activeQuizQuestion].explanation}</p>
                        </div>
                      )}

                      {/* Next Question Control */}
                      {quizSelectedOption !== null && (
                        <button
                          onClick={() => {
                            if (activeQuizQuestion === aiResult.length - 1) {
                              setShowQuizResults(true);
                            } else {
                              setActiveQuizQuestion(activeQuizQuestion + 1);
                              setQuizSelectedOption(null);
                            }
                          }}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/10 transition mt-4"
                        >
                          {activeQuizQuestion === aiResult.length - 1 ? 'Show Scorecard' : 'Next Question'}
                        </button>
                      )}
                    </div>
                  ) : (
                    /* Scorecard View */
                    <div className="flex flex-col items-center text-center space-y-6 py-6 animate-in zoom-in-95 duration-300">
                      <div className="p-4 bg-emerald-50 rounded-full border-4 border-emerald-100 text-emerald-600">
                        <Award size={48} />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-xl font-extrabold text-slate-800">Quiz Completed!</h3>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Here is your performance scorecard</p>
                      </div>

                      {/* Score Tracker Ring */}
                      <div className="flex flex-col items-center justify-center w-36 h-36 border-[12px] border-emerald-500 rounded-full shrink-0 shadow-inner">
                        <span className="text-4xl font-headline font-black text-slate-800">{Math.round((quizScore / aiResult.length) * 100)}%</span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">{quizScore} / {aiResult.length} Correct</span>
                      </div>

                      {/* Rating comment */}
                      <p className="text-sm font-bold text-slate-700 italic max-w-xs leading-normal">
                        {quizScore === aiResult.length ? "Master Scholar! You understood every concept flawlessly." : quizScore >= 3 ? "Excellent Work! You have a solid grasp of this study notebook." : "Keep Reviewing! Go through the notes again and try the quiz once more."}
                      </p>

                      <div className="flex gap-3 w-full pt-4">
                        <button
                          onClick={() => {
                            setActiveQuizQuestion(0);
                            setQuizScore(0);
                            setQuizSelectedOption(null);
                            setShowQuizResults(false);
                          }}
                          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition"
                        >
                          Try Again
                        </button>
                        <button
                          onClick={() => setAiFeature(null)}
                          className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-bold transition"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Overlay 5: OCR Image Reader */}
      {aiFeature === 'ocr' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-orange-100 rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[85vh] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <h2 className="text-lg font-extrabold flex items-center gap-2 text-orange-900">
                <ScanLine size={22} className="text-orange-600" /> OCR Engine
              </h2>
              <button onClick={() => setAiFeature(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-1 custom-scrollbar">
              <input
                type="text"
                value={ocrImageUrl}
                onChange={(e) => setOcrImageUrl(e.target.value)}
                placeholder="Paste link to handwritten notes or textbook image..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm transition bg-slate-50 font-semibold"
              />

              {aiLoading && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="h-10 w-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
                  <p className="text-xs text-orange-700 font-bold animate-pulse">Running OCR Vision analysis...</p>
                </div>
              )}

              {aiResult && (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TRANSCRIBED TEXT</p>
                    <button onClick={() => { navigator.clipboard.writeText(aiResult); toast.success('Copied!'); }} className="text-slate-400 hover:text-slate-700 transition flex items-center gap-1 text-xs font-bold">
                      <Copy size={12} /> Copy
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {aiResult}
                  </div>
                </div>
              )}
            </div>

            {aiResult && !aiLoading && (
              <button
                onClick={() => { editor.chain().focus().insertContent(aiResult).run(); setAiFeature(null); toast.success('OCR text inserted!'); }}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow-md shadow-orange-600/10 mt-4 shrink-0 transition"
              >
                Insert Transcribed Text
              </button>
            )}

            {!aiResult && !aiLoading && (
              <button
                onClick={handleOCR}
                disabled={!ocrImageUrl.trim()}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow-md disabled:opacity-50 mt-4 transition"
              >
                Transcribe Image Text
              </button>
            )}
          </div>
        </div>
      )}

      {/* Overlay 6: Translation & Proofreading */}
      {aiFeature === 'translate' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-cyan-100 rounded-3xl shadow-2xl w-full max-w-lg p-6 max-h-[85vh] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <h2 className="text-lg font-extrabold flex items-center gap-2 text-cyan-900">
                <Languages size={22} className="text-cyan-600" /> Grammar & translation Hub
              </h2>
              <button onClick={() => setAiFeature(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-1 custom-scrollbar">
              <div className="flex items-center gap-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">TARGET LANGUAGE</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white outline-none cursor-pointer"
                >
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Nepali">Nepali (नेपाली)</option>
                  <option value="Chinese">Chinese (中文)</option>
                  <option value="Grammar Check">Proofread Grammar Only (English)</option>
                </select>
              </div>

              {aiLoading && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="h-10 w-10 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
                  <p className="text-xs text-cyan-700 font-bold animate-pulse">Running linguistic translation models...</p>
                </div>
              )}

              {aiResult && (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TRANSLATION RESULT</p>
                    <button onClick={() => { navigator.clipboard.writeText(aiResult); toast.success('Copied!'); }} className="text-slate-400 hover:text-slate-700 transition flex items-center gap-1 text-xs font-bold">
                      <Copy size={12} /> Copy
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {aiResult}
                  </div>
                </div>
              )}
            </div>

            {aiResult && !aiLoading && (
              <div className="flex gap-3 border-t border-slate-100 pt-4 mt-4 shrink-0">
                <button
                  onClick={() => { editor.commands.insertContent(aiResult); setAiFeature(null); toast.success('Translation inserted!'); }}
                  className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-bold shadow-md shadow-cyan-600/10 flex items-center justify-center gap-2 transition"
                >
                  Insert at Cursor <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => { editor.chain().focus().setContent(aiResult).run(); setAiFeature(null); toast.success('Text replaced!'); }}
                  className="px-4 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-bold transition"
                >
                  Replace Note
                </button>
              </div>
            )}

            {!aiResult && !aiLoading && (
              <button
                onClick={handleTranslate}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-bold shadow-md transition mt-4"
              >
                Translate Note
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
