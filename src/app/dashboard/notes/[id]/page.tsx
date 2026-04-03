'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { notesApi, friendsApi } from '@/services/api';
import { useAuthStore } from '@/contexts/authStore';
import { Note, Friend, NoteShare } from '@/types';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Save, Share2, Users, Eye, Edit3, X, Trash2, Crown
} from 'lucide-react';
import NoteEditor from '@/components/editor/NoteEditor';

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const noteId = Number(params.id);

  const [note, setNote] = useState<Note | null>(null);
  const [permission, setPermission] = useState<string>('owner');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sharing state
  const [showShare, setShowShare] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [collaborators, setCollaborators] = useState<NoteShare[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const [sharePermission, setSharePermission] = useState<'view' | 'edit'>('view');

  const fetchNote = useCallback(async () => {
    try {
      const res = await notesApi.get(noteId);
      setNote(res.data.data);
      setPermission(res.data.permission);
      setTitle(res.data.data.title);
      setContent(res.data.data.content || '');
    } catch {
      toast.error('Note not found');
      router.push('/dashboard/notes');
    } finally {
      setLoading(false);
    }
  }, [noteId, router]);

  useEffect(() => { fetchNote(); }, [fetchNote]);

  const handleSave = async () => {
    if (permission === 'view') return;
    setSaving(true);
    try {
      await notesApi.update(noteId, { title, content });
      toast.success('Saved!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Auto-save every 5 seconds
  useEffect(() => {
    if (permission === 'view') return;
    const timer = setInterval(() => {
      if (title && content !== note?.content) {
        notesApi.update(noteId, { title, content }).catch(() => {});
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [noteId, title, content, note?.content, permission]);

  const openShareModal = async () => {
    setShowShare(true);
    try {
      const [friendsRes, collabRes] = await Promise.all([
        friendsApi.list(),
        notesApi.collaborators(noteId),
      ]);
      setFriends(friendsRes.data.data || []);
      setCollaborators(collabRes.data.data || []);
    } catch { toast.error('Failed to load sharing data'); }
  };

  const handleShare = async () => {
    if (!selectedFriend) return;
    try {
      await notesApi.share(noteId, { user_id: selectedFriend, permission: sharePermission });
      toast.success('Note shared!');
      setSelectedFriend(null);
      const collabRes = await notesApi.collaborators(noteId);
      setCollaborators(collabRes.data.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to share');
    }
  };

  const handleUnshare = async (userId: number) => {
    try {
      await notesApi.unshare(noteId, userId);
      toast.success('Removed');
      setCollaborators((prev) => prev.filter((c) => c.shared_with !== userId));
    } catch { toast.error('Failed'); }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
      </div>
    );
  }

  const isOwner = permission === 'owner';
  const canEdit = permission === 'owner' || permission === 'edit';

  return (
    <div className="w-full flex flex-col fade-in animate-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-80px)]">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <button onClick={() => router.push('/dashboard/notes')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm border border-transparent hover:border-slate-200/60 transition-all duration-300 w-fit">
          <ArrowLeft size={18} strokeWidth={2.5} /> Back
        </button>
        <div className="flex items-center gap-3">
          {!canEdit && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm">
              <Eye size={14} strokeWidth={2.5} /> View Only
            </span>
          )}
          {canEdit && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 px-3.5 py-1.5 rounded-full shadow-sm">
              <Edit3 size={14} strokeWidth={2.5} /> {isOwner ? 'Owner' : 'Editor'}
            </span>
          )}
          {isOwner && (
            <button onClick={openShareModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-300 shadow-sm hover:shadow">
              <Share2 size={16} strokeWidth={2.5} /> Share
            </button>
          )}
          {canEdit && (
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all duration-300 shadow-[0_4px_15px_-3px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0">
              <Save size={16} strokeWidth={2.5} /> {saving ? 'Saving...' : 'Save Notes'}
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="relative group flex flex-col sm:flex-row sm:items-center gap-3 mb-8 border-b border-transparent focus-within:border-slate-200 transition-colors pb-2">
        {canEdit && (
           <div className="hidden sm:flex items-center justify-center text-slate-300 group-focus-within:text-indigo-500 transition-colors shrink-0">
             <Edit3 size={32} strokeWidth={2.5} />
           </div>
        )}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          readOnly={!canEdit}
          className="flex-1 w-full text-3xl lg:text-4xl font-extrabold text-slate-900 border-none outline-none bg-transparent placeholder:text-slate-300 tracking-tight focus:ring-0 px-0"
          placeholder="Untitled Notebook..."
        />
      </div>

      {/* Editor */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-500 overflow-hidden flex-1 flex flex-col min-h-0">
        <NoteEditor
           content={content}
           onChange={setContent}
           editable={canEdit}
        />
      </div>

      {/* Share Modal */}
      {showShare && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Share2 size={20} /> Share Note
              </h2>
              <button onClick={() => setShowShare(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            {/* Add collaborator */}
            <div className="flex gap-2 mb-4">
              <select
                value={selectedFriend || ''}
                onChange={(e) => setSelectedFriend(Number(e.target.value) || null)}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none"
              >
                <option value="">Select a friend...</option>
                {friends.filter((f) => !collaborators.find((c) => c.shared_with === f.id)).map((f) => (
                  <option key={f.id} value={f.id}>{f.name} ({f.email})</option>
                ))}
              </select>
              <select value={sharePermission}
                onChange={(e) => setSharePermission(e.target.value as 'view' | 'edit')}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none">
                <option value="view">View</option>
                <option value="edit">Edit</option>
              </select>
              <button onClick={handleShare} disabled={!selectedFriend}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-brand-700 transition">
                Share
              </button>
            </div>

            {/* Current collaborators */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Collaborators ({collaborators.length})</h3>
              {collaborators.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No collaborators yet. Share with a friend above.</p>
              ) : (
                collaborators.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-semibold">
                        {c.recipient?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{c.recipient?.name}</p>
                        <p className="text-xs text-gray-500">{c.recipient?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${c.permission === 'edit' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                        {c.permission}
                      </span>
                      <button onClick={() => handleUnshare(c.shared_with)}
                        className="text-red-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
