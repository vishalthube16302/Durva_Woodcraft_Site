import { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSettings } from '../../hooks/useSettings';

interface StorageFile {
    name: string;
    id: string; // id is not always returned by list, but name is key
    metadata: {
        mimetype: string;
        size: number;
    };
    created_at: string;
    url?: string;
}

export default function GalleryPanel() {
    const [files, setFiles] = useState<StorageFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { settings } = useSettings();

    /* 
       Ideally, we get the public URL base from env or client.
       The pattern is: https://<project-id>.supabase.co/storage/v1/object/public/<bucket>/<filename>
    */
    const getPublicUrl = (filename: string) => {
        const { data } = supabase.storage.from('product-images').getPublicUrl(filename);
        return data.publicUrl;
    };

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.storage.from('product-images').list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });

            if (error) throw error;

            console.log("Files:", data);

            // Map to StorageFile interface
            const fileList = data?.map(file => ({
                name: file.name,
                id: file.id,
                metadata: file.metadata,
                created_at: file.created_at,
                url: getPublicUrl(file.name)
            })) || [];

            setFiles(fileList as StorageFile[]);
        } catch (error) {
            console.error('Error fetching images:', error);
            alert('Error loading gallery. Ensure bucket "product-images" exists and policies are set.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) return;
            setUploading(true);

            const file = event.target.files[0];
            // Sanitize filename: remove special chars, spaces to underscores
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;

            const { error } = await supabase.storage
                .from('product-images')
                .upload(fileName, file);

            if (error) throw error;

            fetchFiles();
        } catch (error) {
            alert('Error uploading image: ' + (error as any).message);
        } finally {
            setUploading(false);
            // Reset input
            event.target.value = '';
        }
    };

    const handleDelete = async (fileName: string) => {
        if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;
        try {
            const { error } = await supabase.storage
                .from('product-images')
                .remove([fileName]);

            if (error) throw error;
            fetchFiles();
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error deleting image');
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        // You could add a toast notification here
        alert('URL copied to clipboard!');
    };

    if (!settings) return null;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: settings.primary_color }}>
                    Image Gallery
                </h2>
                <div className="flex gap-4">
                    <button
                        onClick={fetchFiles}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <button
                            disabled={uploading}
                            className="flex items-center space-x-2 px-6 py-3 rounded-lg text-white disabled:opacity-50"
                            style={{ backgroundColor: settings.primary_color }}
                        >
                            <Upload size={18} />
                            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading images...</div>
            ) : files.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center text-gray-400">
                    <ImageIcon size={48} className="mb-4 opacity-20" />
                    <p>No images found in 'product-images' bucket.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                <th className="py-4 px-4 font-medium">Preview</th>
                                <th className="py-4 px-4 font-medium">Filename</th>
                                <th className="py-4 px-4 font-medium">Size</th>
                                <th className="py-4 px-4 font-medium">Date</th>
                                <th className="py-4 px-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {files.map((file) => (
                                <tr key={file.name} className="group hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="font-medium text-gray-900 max-w-xs truncate" title={file.name}>
                                            {file.name}
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono mt-1 hidden group-hover:block truncate max-w-xs">
                                            {file.url}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500">
                                        {(file.metadata.size / 1024).toFixed(1)} KB
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500">
                                        {new Date(file.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => file.url && copyToClipboard(file.url)}
                                                className="p-2 rounded hover:bg-white hover:shadow-sm text-blue-600 transition-all"
                                                title="Copy URL"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(file.name)}
                                                className="p-2 rounded hover:bg-white hover:shadow-sm text-red-600 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
