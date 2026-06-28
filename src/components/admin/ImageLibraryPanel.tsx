import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Upload, Copy, Trash2, Search, RefreshCw, CheckCircle,
  AlertCircle, Image as ImageIcon, X, Download, ExternalLink,
  Grid, List, Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSettings } from '../../hooks/useSettings';

interface ImageFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
  usedIn: string[];   // product names that reference this image
}

type ViewMode  = 'grid' | 'list';
type SortMode  = 'newest' | 'oldest' | 'name' | 'size';
type Toast     = { type: 'success' | 'error'; text: string } | null;

export default function ImageLibraryPanel() {
  const [files, setFiles]         = useState<ImageFile[]>([]);
  const [filtered, setFiltered]   = useState<ImageFile[]>([]);
  const [products, setProducts]   = useState<{ id: string; name: string; images: string[] }[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const [search, setSearch]       = useState('');
  const [sort, setSort]           = useState<SortMode>('newest');
  const [viewMode, setViewMode]   = useState<ViewMode>('grid');
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [preview, setPreview]     = useState<ImageFile | null>(null);
  const [toast, setToast]         = useState<Toast>(null);
  const [dragOver, setDragOver]   = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { settings } = useSettings();

  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ── Fetch all storage files + cross-reference with products ──
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Load all files from storage
      const { data: storageData, error: storageErr } = await supabase.storage
        .from('product-images')
        .list('', { limit: 500, sortBy: { column: 'created_at', order: 'desc' } });
      if (storageErr) throw storageErr;

      // 2. Load all products to cross-reference
      const { data: productsData } = await supabase
        .from('products').select('id, name, images');
      const prods = productsData || [];
      setProducts(prods);

      // 3. Build image list with usage info
      const imageFiles: ImageFile[] = (storageData || [])
        .filter(f => f.name !== '.emptyFolderPlaceholder' && !f.name.startsWith('.'))
        .map(f => {
          const { data } = supabase.storage.from('product-images').getPublicUrl(f.name);
          const url = data.publicUrl;
          // Find which products use this image
          const usedIn = prods
            .filter(p => (p.images || []).some((img: string) => img.includes(f.name) || img === url))
            .map(p => p.name);
          return {
            name: f.name,
            url,
            size: (f.metadata as any)?.size || 0,
            created_at: (f.metadata as any)?.lastModified || f.created_at || '',
            usedIn,
          };
        });

      setFiles(imageFiles);
    } catch (err: any) {
      showToast('error', 'Failed to load images: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Filter + sort whenever search/sort/files change ──
  useEffect(() => {
    let result = [...files];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(f => f.name.toLowerCase().includes(q) || f.usedIn.some(u => u.toLowerCase().includes(q)));
    }
    result.sort((a, b) => {
      if (sort === 'newest') return b.created_at.localeCompare(a.created_at);
      if (sort === 'oldest') return a.created_at.localeCompare(b.created_at);
      if (sort === 'name')   return a.name.localeCompare(b.name);
      if (sort === 'size')   return b.size - a.size;
      return 0;
    });
    setFiltered(result);
  }, [files, search, sort]);

  // ── Upload handler (supports multiple files) ──
  const handleUpload = useCallback(async (fileList: FileList) => {
    if (!fileList.length) return;
    setUploading(true);
    setUploadProgress([]);
    const results: string[] = [];
    let successCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `product_${Date.now()}_${safeName}`;
      setUploadProgress(prev => [...prev.filter(p => !p.startsWith('⏳')), `⏳ Uploading ${file.name}...`]);
      try {
        const { error } = await supabase.storage.from('product-images').upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (error) throw error;
        results.push(`✅ ${file.name}`);
        successCount++;
      } catch (err: any) {
        results.push(`❌ ${file.name}: ${err.message}`);
      }
    }

    setUploadProgress(results);
    setUploading(false);
    if (successCount > 0) {
      showToast('success', `${successCount} image${successCount > 1 ? 's' : ''} uploaded successfully!`);
      await fetchAll();
    }
    setTimeout(() => setUploadProgress([]), 5000);
  }, [fetchAll, showToast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleUpload(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
  };

  // ── Copy URL ──
  const copyUrl = (url: string, name: string) => {
    navigator.clipboard.writeText(url)
      .then(() => showToast('success', `URL copied: ${name}`));
  };

  // ── Delete ──
  const deleteFile = async (file: ImageFile) => {
    if (file.usedIn.length > 0) {
      if (!confirm(`"${file.name}" is used in: ${file.usedIn.join(', ')}.\nDeleting it will break those products. Continue?`)) return;
    } else {
      if (!confirm(`Delete "${file.name}"? This cannot be undone.`)) return;
    }
    const { error } = await supabase.storage.from('product-images').remove([file.name]);
    if (error) { showToast('error', 'Delete failed: ' + error.message); return; }
    showToast('success', `"${file.name}" deleted.`);
    if (preview?.name === file.name) setPreview(null);
    fetchAll();
  };

  // ── Bulk delete ──
  const bulkDelete = async () => {
    if (!selected.size) return;
    const filesToDelete = files.filter(f => selected.has(f.name));
    const usedFiles = filesToDelete.filter(f => f.usedIn.length > 0);
    let msg = `Delete ${selected.size} image(s)?`;
    if (usedFiles.length > 0) msg += `\n\n⚠️ ${usedFiles.length} are used in products and will break them!`;
    if (!confirm(msg)) return;
    const names = filesToDelete.map(f => f.name);
    const { error } = await supabase.storage.from('product-images').remove(names);
    if (error) { showToast('error', 'Bulk delete failed: ' + error.message); return; }
    showToast('success', `${selected.size} images deleted.`);
    setSelected(new Set());
    setPreview(null);
    fetchAll();
  };

  const toggleSelect = (name: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (str: string) => {
    if (!str) return '—';
    try { return new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return '—'; }
  };

  if (!settings) return null;

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-royal-mahogany">Image Library</h2>
          <p className="font-body text-sm text-royal-navy/50 mt-1">
            {files.length} images in storage · Upload, manage, copy URLs for use in products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAll} disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-body hover:bg-gray-50 transition-all disabled:opacity-40">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-body font-semibold text-sm shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
            style={{ backgroundColor: settings.primary_color }}>
            <Upload size={16} />
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileInput} className="hidden" />
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-body ${
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
            : <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
          {toast.text}
        </div>
      )}

      {/* ── Upload progress ── */}
      {uploadProgress.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-1">
          {uploadProgress.map((msg, i) => (
            <p key={i} className="font-body text-sm text-gray-700">{msg}</p>
          ))}
        </div>
      )}

      {/* ── Drag-and-drop zone ── */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-amber-800 bg-amber-50 scale-[1.01]'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
        }`}>
        <Upload size={28} className={`mx-auto mb-2 ${dragOver ? 'text-amber-800' : 'text-gray-300'}`} />
        <p className="font-body text-sm font-semibold text-gray-600">
          {dragOver ? 'Drop to upload!' : 'Drag & drop images here, or click to browse'}
        </p>
        <p className="font-body text-xs text-gray-400 mt-1">Supports JPG, PNG, WebP — multiple files at once</p>
      </div>

      {/* ── Search, Sort, View Controls ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-body focus:outline-none focus:border-amber-800 transition-all"
            placeholder="Search by filename or product name..."
            value={search}
            onChange={e => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <Filter size={13} className="ml-2 text-gray-400" />
          <select className="bg-transparent text-sm font-body text-gray-600 pr-2 pl-1 py-1.5 focus:outline-none"
            value={sort} onChange={e => setSort(e.target.value as SortMode)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name A→Z</option>
            <option value="size">Largest first</option>
          </select>
        </div>
        <div className="flex items-center bg-gray-100 rounded-xl p-1">
          <button onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
            <Grid size={15} />
          </button>
          <button onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
            <List size={15} />
          </button>
        </div>
      </div>

      {/* ── Bulk action bar ── */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="font-body text-sm font-semibold text-amber-900">{selected.size} image{selected.size > 1 ? 's' : ''} selected</p>
          <div className="flex gap-2">
            <button onClick={() => setSelected(new Set())}
              className="font-body text-xs px-3 py-1.5 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-100">
              Deselect all
            </button>
            <button onClick={bulkDelete}
              className="font-body text-xs px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center gap-1">
              <Trash2 size={12} /> Delete selected
            </button>
          </div>
        </div>
      )}

      {/* ── Image results count ── */}
      {!loading && (
        <p className="font-body text-xs text-gray-400">
          Showing {filtered.length} of {files.length} images
          {search && ` matching "${search}"`}
        </p>
      )}

      {/* ── Grid / List ── */}
      {loading ? (
        <div className="flex flex-col items-center py-20 text-gray-400">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-amber-800 rounded-full animate-spin mb-4" />
          <p className="font-body text-sm">Loading image library...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-gray-400">
          <ImageIcon size={48} className="mb-4 opacity-20" />
          <p className="font-body text-sm">{search ? 'No images match your search.' : 'No images uploaded yet.'}</p>
        </div>
      ) : viewMode === 'grid' ? (

        /* ── GRID VIEW ── */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(file => (
            <div key={file.name}
              className={`group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                selected.has(file.name)
                  ? 'border-amber-800 ring-2 ring-amber-800/20'
                  : 'border-gray-100 hover:border-gray-300'
              }`}
              onClick={() => setPreview(file)}>
              {/* Thumbnail */}
              <div className="aspect-square bg-gray-50">
                <img src={file.url} alt={file.name}
                  className="w-full h-full object-cover"
                  loading="lazy" />
              </div>

              {/* Usage badge */}
              {file.usedIn.length > 0 && (
                <div className="absolute top-1.5 left-1.5">
                  <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-md font-semibold">
                    {file.usedIn.length} product{file.usedIn.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Select checkbox */}
              <div className="absolute top-1.5 right-1.5"
                onClick={e => { e.stopPropagation(); toggleSelect(file.name); }}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  selected.has(file.name)
                    ? 'bg-amber-800 border-amber-800'
                    : 'border-white bg-white/80 opacity-0 group-hover:opacity-100'
                }`}>
                  {selected.has(file.name) && <CheckCircle size={12} className="text-white" />}
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                <p className="text-white text-xs font-medium truncate mb-2">{file.name}</p>
                <div className="flex gap-1">
                  <button
                    onClick={e => { e.stopPropagation(); copyUrl(file.url, file.name); }}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs font-body transition-all"
                    title="Copy URL">
                    <Copy size={11} /> Copy URL
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); deleteFile(file); }}
                    className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-all"
                    title="Delete">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      ) : (

        /* ── LIST VIEW ── */
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-[auto,2fr,1fr,1fr,auto] gap-0 bg-gray-50 border-b border-gray-200 px-4 py-2.5">
            <div className="w-8" />
            <p className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide">File Name</p>
            <p className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide">Used In</p>
            <p className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide">Date / Size</p>
            <p className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</p>
          </div>
          {filtered.map((file, idx) => (
            <div key={file.name}
              className={`grid grid-cols-[auto,2fr,1fr,1fr,auto] gap-0 items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                idx !== filtered.length - 1 ? 'border-b border-gray-100' : ''
              }`}>
              <div className="w-8 flex-shrink-0">
                <img src={file.url} alt={file.name}
                  className="w-7 h-7 rounded-lg object-cover border border-gray-200 cursor-pointer"
                  onClick={() => setPreview(file)} />
              </div>
              <div className="min-w-0 pr-4">
                <p className="font-body text-sm text-gray-800 truncate font-medium cursor-pointer hover:text-amber-800 transition-colors"
                  onClick={() => setPreview(file)}>{file.name}</p>
                <p className="font-body text-xs text-gray-400 truncate">{file.url}</p>
              </div>
              <div>
                {file.usedIn.length > 0 ? (
                  <div className="space-y-0.5">
                    {file.usedIn.slice(0, 2).map(name => (
                      <p key={name} className="font-body text-xs text-green-700 bg-green-50 rounded px-1.5 py-0.5 truncate">{name}</p>
                    ))}
                    {file.usedIn.length > 2 && (
                      <p className="font-body text-xs text-gray-400">+{file.usedIn.length - 2} more</p>
                    )}
                  </div>
                ) : (
                  <span className="font-body text-xs text-gray-300">Not used</span>
                )}
              </div>
              <div>
                <p className="font-body text-xs text-gray-500">{formatDate(file.created_at)}</p>
                <p className="font-body text-xs text-gray-400">{formatSize(file.size)}</p>
              </div>
              <div className="flex gap-1.5 justify-end">
                <button onClick={() => copyUrl(file.url, file.name)}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Copy URL">
                  <Copy size={14} />
                </button>
                <button onClick={() => window.open(file.url, '_blank')}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Open in new tab">
                  <ExternalLink size={14} />
                </button>
                <button onClick={() => deleteFile(file)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Preview Modal ── */}
      {preview && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={e => e.stopPropagation()}>
            {/* Preview image */}
            <div className="bg-gray-100 flex items-center justify-center max-h-80 overflow-hidden">
              <img src={preview.url} alt={preview.name}
                className="max-w-full max-h-80 object-contain" />
            </div>

            {/* Details */}
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-royal-mahogany truncate">{preview.name}</h3>
                  <p className="font-body text-xs text-gray-400 mt-0.5">{formatDate(preview.created_at)} · {formatSize(preview.size)}</p>
                </div>
                <button onClick={() => setPreview(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0">
                  <X size={18} />
                </button>
              </div>

              {/* URL with copy */}
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <p className="font-body text-xs text-gray-600 truncate flex-1 font-mono">{preview.url}</p>
                <button
                  onClick={() => copyUrl(preview.url, preview.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-body font-semibold flex-shrink-0"
                  style={{ backgroundColor: settings.primary_color }}>
                  <Copy size={12} /> Copy URL
                </button>
              </div>

              {/* Used in */}
              {preview.usedIn.length > 0 ? (
                <div>
                  <p className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Used in products</p>
                  <div className="flex flex-wrap gap-2">
                    {preview.usedIn.map(name => (
                      <span key={name} className="font-body text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="font-body text-xs text-gray-400">Not used in any product yet.</p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-gray-100">
                <a href={preview.url} download target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-body hover:bg-gray-50">
                  <Download size={14} /> Download
                </a>
                <a href={preview.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-body hover:bg-gray-50">
                  <ExternalLink size={14} /> Open Full Size
                </a>
                <button onClick={() => deleteFile(preview)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-body hover:bg-red-100 ml-auto">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
