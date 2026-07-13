import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function forceDownload(url: string, filename: string) {
  try {
    // Attempt client-side fetch (works if CORS is allowed)
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.warn("Client-side download failed (likely due to CORS). Falling back to server proxy.", error);
    // Fallback: trigger download via our server proxy
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    const link = document.createElement('a');
    link.href = proxyUrl;
    // Standard download trigger
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
