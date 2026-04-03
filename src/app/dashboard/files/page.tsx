'use client';

import { useState, useEffect, useRef } from 'react';
import { filesApi } from '@/services/api';
import { useAuthStore } from '@/contexts/authStore';
import { FileItem } from '@/types';
import toast from 'react-hot-toast';
import { Upload, Download, Trash2, FolderOpen, File, Image, FileText } from 'lucide-react';

function formatSize(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return bytes + ' B';
}

function getFileIcon(mime: string) {
  if (mime.startsWith('image/')) return <Image size={20} className="text-pink-500" />;
  if (mime.includes('pdf')) return <FileText size={20} className="text-red-500" />;
  return <File size={20} className="text-gray-400" />;
}

export default function FilesPage() {
  const user = useAuthStore((s) => s.user);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      const res = await filesApi.list();
      setFiles(res.data.data?.data || []);
    } catch { toast.error('Failed to load files'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFiles(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await filesApi.upload(file);
      toast.success('File uploaded!');
      fetchFiles();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDownload = async (fileId: number) => {
    try {
      const res = await filesApi.download(fileId);
      window.open(res.data.download_url, '_blank');
    } catch { toast.error('Download failed'); }
  };

  const handleDelete = async (fileId: number) => {
    if (!confirm('Delete this file?')) return;
    try {
      await filesApi.delete(fileId);
      toast.success('Deleted');
      fetchFiles();
    } catch { toast.error('Failed'); }
  };

  const usedMB = user ? (user.storage_used / 1048576).toFixed(1) : '0';
  const limitMB = user ? (user.storage_limit / 1048576).toFixed(0) : '50';
  const usagePercent = user ? Math.min((user.storage_used / user.storage_limit) * 100, 100) : 0;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Files</h1>
          <p className="text-sm text-gray-500 mt-1">{usedMB} MB / {limitMB} MB used</p>
        </div>
        <div>
          <input ref={inputRef} type="file" className="hidden" onChange={handleUpload} />
          <button onClick={() => inputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition disabled:opacity-50">
            {uploading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={16} />}
            Upload File
          </button>
        </div>
      </div>

      {/* Storage bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Storage</span>
          <span className="text-gray-900 font-medium">{usagePercent.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${usagePercent}%` }} />
        </div>
        {!user?.is_premium && (
          <p className="text-xs text-gray-400 mt-2">Upgrade to Premium for 5GB storage</p>
        )}
      </div>

      {/* Files list */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" /></div>
      ) : files.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No files uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 min-w-0">
                {getFileIcon(file.mime_type)}
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{file.original_name}</p>
                  <p className="text-xs text-gray-400">{formatSize(file.size)} &middot; {new Date(file.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleDownload(file.id)} className="p-2 text-gray-400 hover:text-brand-600 transition"><Download size={16} /></button>
                <button onClick={() => handleDelete(file.id)} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
