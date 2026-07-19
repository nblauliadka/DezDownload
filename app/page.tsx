"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Download, Link as LinkIcon, AlertCircle, CheckCircle2, Loader2, Sparkles, Globe, Github, X, Menu,
  Video, Instagram, Youtube, Twitter, MessageSquare, Music, Headphones, Tv, Ghost, Facebook,
  MessageCircle, Image, Linkedin, Play, Share2, Film, Disc, Smile, FileText, Gitlab, Clipboard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { forceDownload } from "@/lib/utils";

const platforms = [
  { name: "TikTok", icon: Video },
  { name: "Instagram", icon: Instagram },
  { name: "YouTube", icon: Youtube },
  { name: "X (Twitter)", icon: Twitter },
  { name: "Reddit", icon: MessageSquare },
  { name: "Spotify", icon: Music },
  { name: "SoundCloud", icon: Headphones },
  { name: "Vimeo", icon: Tv },
  { name: "Snapchat", icon: Ghost },
  { name: "Facebook", icon: Facebook },
  { name: "Threads", icon: MessageCircle },
  { name: "Pinterest", icon: Image },
  { name: "LinkedIn", icon: Linkedin },
  { name: "Twitch", icon: Play },
  { name: "Tumblr", icon: Share2 },
  { name: "Imgur", icon: Image },
  { name: "Giphy", icon: Film },
  { name: "Bandcamp", icon: Disc },
  { name: "Mixcloud", icon: Disc },
  { name: "Dailymotion", icon: Video },
  { name: "Bilibili", icon: Video },
  { name: "Douyin", icon: Video },
  { name: "Kuaishou", icon: Video },
  { name: "Xiaohongshu", icon: Image },
  { name: "Weibo", icon: Globe },
  { name: "iFunny", icon: Smile },
  { name: "Bitchute", icon: Video },
  { name: "Rumble", icon: Play },
  { name: "Odysee", icon: Play },
  { name: "Flickr", icon: Image },
  { name: "TED", icon: Video },
  { name: "Redgifs", icon: Video },
  { name: "9GAG", icon: Smile },
  { name: "VK", icon: Globe },
  { name: "OK.ru", icon: Globe },
  { name: "Apple Podcasts", icon: Headphones },
  { name: "Tidal", icon: Music },
  { name: "Deezer", icon: Music },
  { name: "Napster", icon: Music },
  { name: "Amazon Music", icon: Music },
  { name: "Audiomack", icon: Music },
  { name: "Boomplay", icon: Music },
  { name: "Anghami", icon: Music },
  { name: "JioSaavn", icon: Music },
  { name: "Gaana", icon: Music },
  { name: "Wynk", icon: Music },
  { name: "Resso", icon: Music },
  { name: "Quora", icon: MessageSquare },
  { name: "Medium", icon: FileText },
  { name: "Substack", icon: FileText },
  { name: "GitHub", icon: Github },
  { name: "GitLab", icon: Gitlab },
  { name: "Dribbble", icon: Image },
  { name: "Behance", icon: Image }
];

function isUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function gatherLinks(obj: any): { label: string, url: string }[] {
  const links: { label: string, url: string }[] = [];
  
  if (typeof obj === 'string' && isUrl(obj)) {
    links.push({ label: 'Media Source', url: obj });
    return links;
  }
  
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      if (typeof item === 'string' && isUrl(item)) {
        links.push({ label: `Media Link ${index + 1}`, url: item });
      } else if (typeof item === 'object') {
        links.push(...gatherLinks(item));
      }
    });
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string' && isUrl(value)) {
        const cleanKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        links.push({ label: cleanKey, url: value });
      } else if (typeof value === 'object') {
        const nested = gatherLinks(value);
        nested.forEach(n => links.push({ label: `${key} - ${n.label}`, url: n.url }));
      }
    });
  }
  return links;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPlatformsDrawerOpen, setIsPlatformsDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "info" | "error">("success");

  useEffect(() => {
    if (result) {
      setToastType("success");
      setToastMessage("Media extracted successfully!");
      setShowToast(true);
      const toastTimer = setTimeout(() => {
        setShowToast(false);
      }, 4000);

      const scrollTimer = setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

      return () => {
        clearTimeout(toastTimer);
        clearTimeout(scrollTimer);
      };
    }
  }, [result]);

  useEffect(() => {
    const handleDownloadTriggered = (e: Event) => {
      const customEvent = e as CustomEvent;
      setToastType("info");
      setToastMessage(customEvent.detail?.message || "Opening media directly. If it plays, simply long-press or right-click to save.");
      setShowToast(true);
    };

    window.addEventListener('media-download-triggered', handleDownloadTriggered);
    return () => {
      window.removeEventListener('media-download-triggered', handleDownloadTriggered);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("platforms") === "true") {
        setIsPlatformsDrawerOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    if (deferredPrompt) {
      const showTimer = setTimeout(() => {
        setShowInstallPopup(true);
      }, 1000);
      
      const hideTimer = setTimeout(() => {
        setShowInstallPopup(false);
      }, 9500);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    setShowInstallPopup(false);
    if (deferredPrompt && typeof deferredPrompt.prompt === 'function') {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error("Error triggering install prompt:", err);
        setShowInstallInstructions(true);
      }
    } else {
      setShowInstallInstructions(true);
    }
  };

  const sanitizeUrl = (inputUrl: string): string => {
    try {
      const trimmed = inputUrl.trim();
      const parsed = new URL(trimmed);
      const params = new URLSearchParams(parsed.search);
      
      // Specifically strip out 'list' and 'si'
      params.delete("list");
      params.delete("si");
      
      // Strip out any trailing empty parameters
      const keysToDelete: string[] = [];
      params.forEach((value, key) => {
        if (!key || value === "" || value === null || value === undefined) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => params.delete(key));
      
      const searchString = params.toString();
      parsed.search = searchString ? `?${searchString}` : "";
      return parsed.toString();
    } catch (e) {
      return inputUrl.trim();
    }
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    const sanitizedUrl = sanitizeUrl(url);
    setUrl(sanitizedUrl);
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(sanitizedUrl)}`, {
        method: "GET",
      });
      
      if (res.status === 500) {
        setError("Failed to extract media. Please check the URL and try again.");
        return;
      }
      
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setError("Failed to extract media. Please check the URL and try again.");
        return;
      }
      
      if (!data || !data.Status) {
        const errorMsg = data?.Error || "";
        if (
          errorMsg === "user_retry_required" ||
          data?.Code === 403 ||
          errorMsg.includes("user_retry_required") ||
          errorMsg.includes("diterima server")
        ) {
          setError("⚠️ URL tidak valid atau ditolak server. Pastikan link video bersih dari parameter tambahan (seperti playlist).");
        } else {
          setError(errorMsg || "Failed to extract media. Please check the URL and try again.");
        }
      } else {
        setResult(data.Result);
      }
    } catch (err: any) {
      setError("Failed to extract media. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformClick = (platformName: string) => {
    let placeholder = "";
    switch(platformName.toLowerCase()) {
      case "tiktok": placeholder = "https://www.tiktok.com/"; break;
      case "instagram": placeholder = "https://www.instagram.com/"; break;
      case "youtube": placeholder = "https://www.youtube.com/watch?v="; break;
      case "x (twitter)": placeholder = "https://x.com/"; break;
      case "reddit": placeholder = "https://www.reddit.com/r/"; break;
      case "spotify": placeholder = "https://open.spotify.com/track/"; break;
      default: placeholder = `https://${platformName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/`;
    }
    setUrl(placeholder);
    setIsPlatformsDrawerOpen(false);
  };

  // Group links into video and audio formats
  const mediasList = result?.medias && Array.isArray(result.medias) ? result.medias : [];
  const videos = mediasList.filter((item: any) => {
    const type = (item.type || '').toLowerCase();
    const ext = (item.ext || '').toLowerCase();
    return type === 'video' || ext === 'mp4' || ext === 'webm';
  });
  const audios = mediasList.filter((item: any) => {
    const type = (item.type || '').toLowerCase();
    const ext = (item.ext || '').toLowerCase();
    return type === 'audio' || ext === 'm4a' || ext === 'mp3' || ext === 'opus';
  });
  const fallbackLinks = (mediasList.length === 0 && result) ? gatherLinks(result) : [];

  const getResolution = (item: any) => {
    const quality = (item.quality || item.label || '').toLowerCase();
    if (quality.includes('8k')) return 4320;
    if (quality.includes('4k')) return 2160;
    if (quality.includes('2k')) return 1440;
    const match = quality.match(/(\d+)p?/);
    if (match) return parseInt(match[1], 10);
    if (quality.includes('hd')) return 720;
    if (quality.includes('sd')) return 360;
    return 0;
  };

  // Group and sort videos by format (mp4 and webm)
  const mp4Videos = videos.filter((item: any) => (item.ext || '').toLowerCase() !== 'webm');
  const webmVideos = videos.filter((item: any) => (item.ext || '').toLowerCase() === 'webm');

  const sortedMp4Videos = [...mp4Videos].sort((a, b) => getResolution(b) - getResolution(a));
  const sortedWebmVideos = [...webmVideos].sort((a, b) => getResolution(b) - getResolution(a));

  const bestMp4WithAudio = sortedMp4Videos.find((item: any) => item.hasAudio !== false && item.audio !== false);
  const bestWebmWithAudio = sortedWebmVideos.find((item: any) => item.hasAudio !== false && item.audio !== false);

  const getAudioQuality = (item: any) => {
    const quality = (item.quality || item.label || '').toLowerCase();
    const match = quality.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
    if (quality.includes('high')) return 320;
    if (quality.includes('medium')) return 192;
    if (quality.includes('low')) return 128;
    return 0;
  };

  const sortedAudios = [...audios].sort((a, b) => {
    return getAudioQuality(b) - getAudioQuality(a);
  });

  const getMediaLabel = (item: any) => {
    const type = (item.type || 'video').toLowerCase();
    const ext = (item.ext || '').toUpperCase();
    const quality = item.quality || item.label || '';
    
    if (type === 'audio') {
      return `Download Audio (${ext}${quality ? ` - ${quality}` : ''})`;
    }
    
    const isHd = quality.includes('720') || quality.includes('1080') || quality.includes('1440') || quality.includes('2160') || quality.includes('4K') || quality.includes('HD');
    const isWatermark = quality.toLowerCase().includes('watermark') && !quality.toLowerCase().includes('no');
    
    let label = `Download Video (${ext}`;
    if (quality) {
      label += ` - ${quality}`;
    } else if (isHd) {
      label += ` - HD`;
    }
    if (isWatermark) {
      label += ` w/ Watermark`;
    }
    label += `)`;
    return label;
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#050505] selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* Floating Pill Navigation */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[92%] md:w-auto max-w-xl md:max-w-3xl chess-glass-pill py-2.5 px-4 md:py-3 md:px-6 flex items-center justify-between gap-4 md:gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white flex items-center justify-center">
            <Download className="w-3.5 h-3.5 md:w-4 md:h-4 text-black" strokeWidth={3} />
          </div>
          <span className="text-white font-extrabold text-xs md:text-sm tracking-wide">DezDownload</span>
        </div>
        
        {/* Desktop Links (md:flex) */}
        <nav className="hidden md:flex items-center gap-2.5 md:gap-4 lg:gap-5">
          <a href="#" className="text-white text-xs md:text-sm font-semibold px-2.5 py-1 md:px-3.5 md:py-1.5 rounded-full bg-white/10">Home</a>
          <button 
            onClick={() => setIsPlatformsDrawerOpen(true)}
            className="text-zinc-400 hover:text-white text-xs md:text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 outline-none py-1 px-1.5 hover:bg-white/5 rounded-lg"
          >
            Platforms
          </button>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="text-zinc-400 hover:text-white text-xs md:text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 outline-none py-1 px-1.5 hover:bg-white/5 rounded-lg"
          >
            Legal & Terms
          </button>
          <a 
            href="/docs" 
            className="text-zinc-400 hover:text-white text-xs md:text-sm font-medium transition-colors py-1 px-1.5 hover:bg-white/5 rounded-lg"
          >
            Docs
          </a>
        </nav>

        {/* Right side icons & buttons always visible on Mobile & Desktop */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button 
            onClick={handleInstallClick}
            className="text-[#050505] bg-white hover:bg-zinc-200 text-[10px] md:text-xs font-bold px-2.5 py-1.5 md:px-3.5 md:py-1.5 rounded-full transition-all cursor-pointer active:scale-95 shrink-0 shadow-sm"
          >
            Install App
          </button>
          <a 
            href="https://github.com/nblauliadka/DezDownload" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-zinc-400 hover:text-white transition-colors shrink-0 p-1 hover:bg-white/5 rounded-lg"
            aria-label="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
          
          {/* Hamburger button (Mobile only) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden text-zinc-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[110%] left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex flex-col gap-3 shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-50 md:hidden animate-fade-in"
            >
              <a 
                href="#" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white text-sm font-semibold py-2 px-3 bg-white/10 rounded-lg"
              >
                Home
              </a>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsPlatformsDrawerOpen(true);
                }}
                className="text-left text-zinc-300 hover:text-white text-sm font-semibold py-2 px-3 hover:bg-white/5 rounded-lg transition-all bg-transparent border-0 outline-none w-full cursor-pointer"
              >
                Platforms
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsDrawerOpen(true);
                }}
                className="text-left text-zinc-300 hover:text-white text-sm font-semibold py-2 px-3 hover:bg-white/5 rounded-lg transition-all bg-transparent border-0 outline-none w-full cursor-pointer"
              >
                Legal & Terms
              </button>
              <a 
                href="/docs" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-300 hover:text-white text-sm font-semibold py-2 px-3 hover:bg-white/5 rounded-lg transition-all"
              >
                Docs
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden px-4 md:px-6 max-w-5xl lg:max-w-6xl mx-auto py-28 md:py-36 flex flex-col gap-12 md:gap-16">
        
        {/* Hero Section */}
        <section className="w-full max-w-5xl mx-auto flex flex-col items-center text-center px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 chess-glass-pill text-zinc-300 px-4 py-2 mb-6 font-medium text-xs tracking-wider uppercase"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Universal API Integration</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="w-full px-4 md:px-6 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent break-words"
          >
            DezDownload
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="w-full px-4 md:px-6 max-w-3xl mx-auto text-base md:text-lg lg:text-xl font-normal leading-relaxed text-zinc-400 mb-10 text-center"
          >
            The Ultimate Universal Downloader. Extract high-quality video, audio, and images from any social platform instantly. No limits, no ads, just raw media.
          </motion.p>
          
          {/* Nuraform Input Box */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="w-full px-4 md:px-6 max-w-4xl lg:max-w-5xl mx-auto relative z-10"
          >
            <form onSubmit={handleDownload} className="w-full h-14 md:h-16 chess-glass rounded-full p-1.5 md:p-2 pl-4 md:pl-8 flex items-center gap-2 md:gap-3 shadow-2xl focus-within:ring-2 focus-within:ring-white/20 transition-all">
              <input 
                type="url" 
                placeholder="Paste URL here..." 
                className="flex-1 w-full max-w-[90vw] bg-transparent border-0 outline-none text-white text-base py-2 md:py-4 pl-1 md:pl-2 placeholder:text-zinc-600 focus:ring-0 focus:outline-none min-w-0"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                required
              />
              {/* Clipboard Auto-Paste Button */}
              <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    if (text) setUrl(text);
                  } catch (err) {
                    console.error("Failed to read clipboard:", err);
                  }
                }}
                className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/5 active:scale-95 shrink-0 flex items-center justify-center"
                title="Paste from clipboard"
              >
                <Clipboard className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button 
                type="submit" 
                disabled={loading || !url}
                className="h-11 md:h-12 shrink-0 bg-white text-black text-xs md:text-sm font-bold px-4 md:px-8 rounded-full hover:bg-zinc-200 disabled:bg-zinc-900 disabled:text-zinc-700 transition-all flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95 duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> Processing
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 md:w-4 md:h-4" /> Extract Media
                  </>
                )}
              </button>
            </form>
            
            {/* Implicit Consent Text */}
            <p className="text-[10px] md:text-xs text-zinc-500 mt-4 text-center">
              By extracting media, you agree to our{" "}
              <button 
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="text-zinc-400 hover:text-white underline transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none inline font-medium"
              >
                Legal & Terms
              </button>
            </p>
            
            {/* Error Notification */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="inline-flex items-center gap-2 bg-red-950/40 border border-red-900/50 text-red-400 text-xs font-semibold px-4 py-2.5 rounded-full">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Space divider */}
          <div className="w-full mt-10" />

        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.section 
              ref={resultRef}
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center w-full"
            >
              <div className="w-full md:max-w-4xl lg:max-w-6xl chess-glass p-6 md:p-8 rounded-[32px] shadow-2xl">
                
                {/* Extraction Complete Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b border-white/10 pb-5 gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">Extraction Complete</h3>
                    <p className="text-zinc-400 text-xs mt-1">Ready to download your requested media.</p>
                  </div>
                  <div className="chess-glass-pill px-4 py-1.5 flex items-center gap-2 shrink-0 text-white text-xs font-semibold bg-white/5">
                     <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                  </div>
                </div>

                {/* Rich Media Card (Layout: Thumbnail + Categorized links side-by-side) */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8 items-start">
                  {/* Thumbnail Component (40% width on desktop) */}
                  <div className="md:col-span-2 w-full">
                    {result.thumbnail ? (
                      <div className="w-full aspect-[16/10] relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-lg animate-fade-in">
                        <img 
                          src={result.thumbnail} 
                          alt={result.title || "Media Thumbnail"} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[16/10] relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg">
                        <Download className="w-12 h-12 text-zinc-700 animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Metadata and Link Groups (60% width on desktop) */}
                  <div className="md:col-span-3 min-w-0 flex flex-col justify-between h-full">
                    <div>
                      {/* Title */}
                      <h4 className="text-base md:text-lg font-bold text-white leading-snug line-clamp-2 mb-2" title={result.title}>
                        {result.title || "Extracted Media"}
                      </h4>
                      
                      {/* Metadata Labels */}
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        {result.author && (
                          <span className="text-xs text-zinc-400 font-medium">
                            by {result.author}
                          </span>
                        )}
                        {result.source && (
                          <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {result.source}
                          </span>
                        )}
                        {result.duration && (
                          <span className="text-xs text-zinc-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {Math.floor(result.duration / 60)}:{(result.duration % 60).toString().padStart(2, '0')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Intelligently Mapping Categorized Download Buttons */}
                    <div className="flex flex-col gap-4">
                      {/* Videos Group */}
                      {(sortedMp4Videos.length > 0 || sortedWebmVideos.length > 0) && (
                        <div className="flex flex-col gap-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Video Downloads</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* MP4 Format Column (Left) */}
                            <div className="flex flex-col gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">MP4 Format</span>
                              {sortedMp4Videos.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                  {sortedMp4Videos.map((item: any, idx: number) => {
                                    const hasAudio = item.hasAudio !== false && item.audio !== false;
                                    const isBestWithAudio = bestMp4WithAudio && item === bestMp4WithAudio;
                                    return (
                                      <button 
                                        key={idx}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          const title = result.title || "extracted_media";
                                          const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
                                          const ext = item.ext || "mp4";
                                          const quality = item.quality || item.label || "";
                                          const filename = `${cleanTitle}_${quality ? `${quality}_` : ""}${idx + 1}.${ext}`;
                                          forceDownload(item.url, filename);
                                        }}
                                        className="flex items-center justify-between gap-3 bg-white text-black font-bold text-xs py-2.5 px-4 rounded-xl hover:bg-zinc-200 transition-all cursor-pointer active:scale-95 duration-200 shadow-sm w-full"
                                      >
                                        <span className="flex items-center gap-2 truncate text-left">
                                          <Download className="w-3.5 h-3.5 shrink-0" />
                                          <span className="truncate">{getMediaLabel(item)}</span>
                                        </span>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          {!hasAudio && (
                                            <span className="bg-red-500/10 text-red-600 border border-red-500/20 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider flex items-center gap-1 font-extrabold select-none">
                                              🔇 Video Only
                                            </span>
                                          )}
                                          {isBestWithAudio && (
                                            <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider flex items-center gap-1 font-extrabold select-none">
                                              🔊 Best with Audio
                                            </span>
                                          )}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-zinc-600 text-xs py-3 px-4 border border-dashed border-white/5 rounded-xl text-center">
                                  No MP4 formats available
                                </div>
                              )}
                            </div>

                            {/* WEBM Format Column (Right) */}
                            <div className="flex flex-col gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">WEBM Format</span>
                              {sortedWebmVideos.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                  {sortedWebmVideos.map((item: any, idx: number) => {
                                    const hasAudio = item.hasAudio !== false && item.audio !== false;
                                    const isBestWithAudio = bestWebmWithAudio && item === bestWebmWithAudio;
                                    return (
                                      <button 
                                        key={idx}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          const title = result.title || "extracted_media";
                                          const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
                                          const ext = item.ext || "webm";
                                          const quality = item.quality || item.label || "";
                                          const filename = `${cleanTitle}_${quality ? `${quality}_` : ""}${idx + 1}.${ext}`;
                                          forceDownload(item.url, filename);
                                        }}
                                        className="flex items-center justify-between gap-3 bg-white text-black font-bold text-xs py-2.5 px-4 rounded-xl hover:bg-zinc-200 transition-all cursor-pointer active:scale-95 duration-200 shadow-sm w-full"
                                      >
                                        <span className="flex items-center gap-2 truncate text-left">
                                          <Download className="w-3.5 h-3.5 shrink-0" />
                                          <span className="truncate">{getMediaLabel(item)}</span>
                                        </span>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          {!hasAudio && (
                                            <span className="bg-red-500/10 text-red-600 border border-red-500/20 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider flex items-center gap-1 font-extrabold select-none">
                                              🔇 Video Only
                                            </span>
                                          )}
                                          {isBestWithAudio && (
                                            <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider flex items-center gap-1 font-extrabold select-none">
                                              🔊 Best with Audio
                                            </span>
                                          )}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-zinc-600 text-xs py-3 px-4 border border-dashed border-white/5 rounded-xl text-center">
                                  No WEBM formats available
                                </div>
                              )}
                            </div>

                          </div>
                        </div>
                      )}

                      {/* Audios Group */}
                      {sortedAudios.length > 0 && (
                        <div className="flex flex-col gap-2 mt-4">
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Audio Tracks</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {sortedAudios.map((item: any, idx: number) => (
                              <button 
                                key={idx}
                                onClick={(e) => {
                                  e.preventDefault();
                                  const title = result.title || "extracted_media";
                                  const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
                                  const ext = item.ext || "mp3";
                                  const quality = item.quality || item.label || "";
                                  const filename = `${cleanTitle}_audio_${quality ? `${quality}_` : ""}${idx + 1}.${ext}`;
                                  forceDownload(item.url, filename);
                                }}
                                className="flex items-center justify-center gap-2 bg-transparent text-white border border-white/10 font-bold text-xs py-2.5 px-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer active:scale-95 duration-200 w-full"
                              >
                                <Download className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{getMediaLabel(item)}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fallback links group */}
                      {fallbackLinks.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Links</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {fallbackLinks.map((link: any, idx: number) => (
                              <button 
                                key={idx}
                                onClick={(e) => {
                                  e.preventDefault();
                                  const title = result.title || "extracted_media";
                                  const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
                                  const urlObj = new URL(link.url);
                                  const pathname = urlObj.pathname;
                                  const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
                                  const ext = match ? match[1] : "mp4";
                                  const filename = `${cleanTitle}_link_${idx + 1}.${ext}`;
                                  forceDownload(link.url, filename);
                                }}
                                className="flex items-center justify-center gap-2 bg-white text-black font-bold text-xs py-2.5 px-4 rounded-xl hover:bg-zinc-200 transition-all cursor-pointer active:scale-95 duration-200 shadow-sm w-full"
                              >
                                <Download className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{link.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payload Details */}
                <details className="group border border-white/5 rounded-2xl overflow-hidden bg-black/30">
                  <summary className="bg-white/[0.02] text-zinc-300 text-xs font-semibold p-4 hover:bg-white/[0.04] cursor-pointer transition-colors select-none outline-none flex items-center justify-between">
                    <span>View Technical Payload</span>
                    <span className="text-zinc-500 group-open:hidden">Expand</span>
                    <span className="text-zinc-500 hidden group-open:block">Collapse</span>
                  </summary>
                  <div className="relative border-t border-white/5 overflow-hidden">
                    <div 
                      className="p-4 bg-black/60 text-[11px] font-mono text-zinc-500/40 whitespace-pre-wrap overflow-x-auto max-h-72 overflow-y-auto select-none pointer-events-none filter blur-[1.5px]"
                      style={{ 
                        maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
                      }}
                    >
                      <pre>{JSON.stringify(result, null, 2)}</pre>
                    </div>
                    
                    {/* Centered Overlay CTA Card */}
                    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/10 backdrop-blur-[3px]">
                      <div className="chess-glass max-w-sm w-full rounded-2xl p-5 md:p-6 flex flex-col items-center text-center shadow-[0_12px_40px_rgba(0,0,0,0.8)] border border-white/10 animate-fade-in">
                        <p className="text-xs text-zinc-300 leading-relaxed mb-4 font-medium">
                          Detailed payload schemas, stream routing, and extraction architecture are documented in our Developer Docs.
                        </p>
                        <a 
                          href="/docs"
                          className="bg-white hover:bg-zinc-200 text-black font-bold text-xs px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer active:scale-95 shadow-lg flex items-center justify-center gap-1.5"
                        >
                          Read Documentation
                        </a>
                      </div>
                    </div>
                  </div>
                </details>

              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>

      {/* Footer (Minimalist Copyright + Trigger) */}
      <footer className="w-full border-t border-white/10 py-6 bg-[#080808] px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>DezDownload © {new Date().getFullYear()} • Designed by DezReacher</p>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="hover:text-white transition-colors cursor-pointer font-medium"
          >
            Legal & Terms
          </button>
        </div>
      </footer>

      {/* Off-Canvas Drawer (Slide-over component) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 cursor-pointer"
            />
            {/* Drawer Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col h-full"
            >
              {/* Header */}
              <div className="sticky top-0 z-50 bg-[#0a0a0a] p-6 md:p-8 border-b border-white/10 flex items-center justify-between shrink-0">
                <h3 className="text-lg font-bold text-white">Legal & Terms</h3>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-xs text-zinc-400 leading-relaxed">
                <div>
                  <h4 className="font-bold text-white text-sm mb-2">About DezDownload</h4>
                  <p>
                    DezDownload is a high-performance web utility built on a fast, modern Next.js client routing architecture. Created by developer DezReacher, it provides structured extraction for public media sources with latency optimization and fail-safe redundancy.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-2">Terms of Service</h4>
                  <p>
                    DezDownload is an educational utility tool designed for extracting publicly available media. By using this service, you agree to access content only for personal, non-commercial use. Users assume full legal responsibility for the media they access and download.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-2">Privacy Policy</h4>
                  <p>
                    We value user privacy. DezDownload functions solely as a client-side routing mechanism. We do not store, host, collect, or cache any user-extracted media files or personal data on our servers.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-2">DMCA & Copyright Policy</h4>
                  <p>
                    We strictly prohibit the use of this tool for copyright infringement. DezDownload does not host or store copyrighted material on its servers. If you are a copyright owner and wish to restrict extraction from a specific source platform, please contact the originating platform directly.
                  </p>
                </div>
              </div>

              {/* Close Footer Trigger */}
              <div className="p-6 md:p-8 border-t border-white/10 bg-[#0a0a0a] shrink-0">
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full bg-white text-black font-bold text-xs py-3 rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Platforms Side Drawer (Slides from Left) */}
      <AnimatePresence>
        {isPlatformsDrawerOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPlatformsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 cursor-pointer"
            />
            {/* Drawer Panel */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-md bg-zinc-950 border-r border-white/10 shadow-2xl flex flex-col h-full"
            >
              {/* Header */}
              <div className="sticky top-0 z-50 bg-[#0a0a0a] p-6 md:p-8 border-b border-white/10 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-white">Universal Extraction Engine</h3>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold mt-1">Status: Operational</p>
                </div>
                <button 
                  onClick={() => setIsPlatformsDrawerOpen(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Area (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
                {/* Explanation */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 shrink-0">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    If it has a URL, we can extract it. Our dynamic routing architecture automatically identifies the host and processes the media instantly.
                  </p>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-4 gap-2 pb-6">
                  {platforms.map((plat) => {
                    const IconComponent = plat.icon;
                    return (
                      <button
                        key={plat.name}
                        onClick={() => handlePlatformClick(plat.name)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 hover:border-white/20 active:scale-95 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                          <IconComponent className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[10px] text-zinc-500 font-medium tracking-tight mt-2 text-center w-full truncate group-hover:text-zinc-300 transition-colors">
                          {plat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Close Button (Sticky at bottom) */}
              <div className="p-6 md:p-8 border-t border-white/10 bg-[#0a0a0a] shrink-0">
                <button 
                  onClick={() => setIsPlatformsDrawerOpen(false)}
                  className="w-full bg-white text-black font-bold text-xs py-3 rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Close Engine
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Install App Popup (Top Notification) */}
      <AnimatePresence>
        {showInstallPopup && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4"
          >
            <div className="chess-glass text-white shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-2xl p-5 max-w-sm w-full flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                <Download className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">Install DezDownload</h4>
                <p className="text-xs text-zinc-400 mt-1">Add to Home Screen for instant access.</p>
                <div className="flex items-center gap-3 mt-4">
                  <button 
                    onClick={handleInstallClick}
                    className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-4 py-2 rounded-full transition-colors cursor-pointer"
                  >
                    Install App
                  </button>
                  <button 
                    onClick={() => setShowInstallPopup(false)}
                    className="bg-transparent hover:bg-white/5 border border-white/10 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install Instructions Modal */}
      <AnimatePresence>
        {showInstallInstructions && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInstallInstructions(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92%] max-w-sm chess-glass p-6 rounded-3xl shadow-2xl border border-white/10 text-center animate-fade-in"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-sans tracking-wide">How to Install</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                For the best experience, add DezDownload to your home screen:
                <br /><br />
                <span className="text-white font-semibold">Safari (iOS):</span> Tap the <span className="font-bold text-white underline">Share</span> button, scroll down, and select <span className="text-white font-semibold">"Add to Home Screen"</span>.
                <br /><br />
                <span className="text-white font-semibold">Chrome / Firefox:</span> Click the install button in the address bar or menu.
              </p>
              <button 
                onClick={() => setShowInstallInstructions(false)}
                className="w-full bg-white text-black font-bold text-xs py-3 rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Got It
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-zinc-900/95 border ${
              toastType === "success" 
                ? "border-emerald-500/30 shadow-[0_20px_50px_rgba(16,185,129,0.15)]" 
                : toastType === "error"
                ? "border-red-500/30 shadow-[0_20px_50px_rgba(239,68,68,0.15)]"
                : "border-blue-500/30 shadow-[0_20px_50px_rgba(59,130,246,0.15)]"
            } text-white px-5 py-3.5 rounded-2xl backdrop-blur-xl max-w-sm`}
          >
            <div className={`w-5 h-5 rounded-full ${
              toastType === "success" 
                ? "bg-emerald-500/10" 
                : toastType === "error"
                ? "bg-red-500/10"
                : "bg-blue-500/10"
            } flex items-center justify-center shrink-0`}
            >
              {toastType === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : toastType === "error" ? (
                <AlertCircle className="w-4 h-4 text-red-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-blue-400" />
              )}
            </div>
            <p className="text-xs font-semibold tracking-wide text-zinc-100">{toastMessage}</p>
            <button 
              onClick={() => setShowToast(false)}
              className="text-zinc-500 hover:text-white transition-colors ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
