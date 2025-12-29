/**
 * Resolves the full URL for an image.
 * 
 * @param path - The image path stored in the database.
 * @returns The full URL to be used in the <img> src attribute.
 * 
 * Logic:
 * 1. If the path starts with "http" or "https", it's treated as a full URL (external or Supabase Storage).
 * 2. Otherwise, it's treated as a local file in the /public/images/ directory.
 */
export function getImageUrl(path: string | null | undefined): string {
    if (!path) {
        // Return a default placeholder if no path is provided
        return 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg';
    }

    if (path.startsWith('http')) {
        return path;
    }

    // Ensure we don't double-slash
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/images/${cleanPath}`;
}
