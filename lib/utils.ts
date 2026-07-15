import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function forceDownload(url: string, filename: string) {
  // Programmatically create a hidden <a> element
  const link = document.createElement('a');
  
  // Set href to the raw extracted media URL
  link.href = url;
  
  // Set target="_blank" and rel="noopener noreferrer"
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  
  // Set the download attribute to a default filename
  link.download = filename || "dezdownload-media";
  
  // Hide the element
  link.style.display = 'none';
  
  // Append the element to the document body, trigger .click(), and remove it from the DOM immediately
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Dispatch a custom event to trigger toast/UI notification letting the user know to save the media if it plays
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('media-download-triggered', {
      detail: {
        message: "Opening media directly. If it plays, simply long-press or right-click to save."
      }
    });
    window.dispatchEvent(event);
  }
}
