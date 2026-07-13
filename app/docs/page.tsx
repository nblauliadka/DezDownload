"use client";

import { useState, useEffect } from "react";
import { 
  Download, Github, Lock, Server, FileCode, ArrowLeft, X, Sparkles, CheckCircle2,
  FileText, Menu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function DocsPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt && typeof deferredPrompt.prompt === 'function') {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
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

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#050505] selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* Back to Home Button */}
      <a 
        href="/" 
        className="fixed top-6 left-4 md:left-8 z-50 flex items-center justify-center md:gap-2 chess-glass-pill h-10 w-10 md:h-auto md:w-auto md:px-4 md:py-2.5 hover:bg-white/10 active:scale-95 transition-all text-xs font-semibold text-white shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        <span className="hidden md:inline">Back to Home</span>
      </a>

      {/* Floating Pill Navigation */}
      <header className="fixed top-6 right-4 left-16 sm:left-20 md:left-1/2 md:-translate-x-1/2 md:right-auto z-40 md:w-auto max-w-xl md:max-w-3xl chess-glass-pill py-2.5 px-4 md:py-3 md:px-6 flex items-center justify-between gap-4 md:gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white flex items-center justify-center">
            <Download className="w-3.5 h-3.5 md:w-4 md:h-4 text-black" strokeWidth={3} />
          </div>
          <span className="text-white font-extrabold text-xs md:text-sm tracking-wide">DezDownload</span>
        </div>
        
        {/* Desktop Links (md:flex) */}
        <nav className="hidden md:flex items-center gap-2.5 md:gap-4 lg:gap-5">
          <a href="/" className="text-zinc-400 hover:text-white text-xs md:text-sm font-medium transition-colors py-1 px-1.5 hover:bg-white/5 rounded-lg">Home</a>
          <a 
            href="/?platforms=true"
            className="text-zinc-400 hover:text-white text-xs md:text-sm font-medium transition-colors py-1 px-1.5 hover:bg-white/5 rounded-lg"
          >
            Platforms
          </a>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="text-zinc-400 hover:text-white text-xs md:text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 outline-none py-1 px-1.5 hover:bg-white/5 rounded-lg"
          >
            Legal & Terms
          </button>
          <a href="/docs" className="text-white text-xs md:text-sm font-semibold px-2.5 py-1 md:px-3.5 md:py-1.5 rounded-full bg-white/10">Docs</a>
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
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-300 hover:text-white text-sm font-semibold py-2 px-3 hover:bg-white/5 rounded-lg transition-all"
              >
                Home
              </a>
              <a 
                href="/?platforms=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-300 hover:text-white text-sm font-semibold py-2 px-3 hover:bg-white/5 rounded-lg transition-all"
              >
                Platforms
              </a>
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
                className="text-white text-sm font-semibold py-2 px-3 bg-white/10 rounded-lg"
              >
                Docs
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden px-4 md:px-6 max-w-4xl mx-auto py-28 md:py-36 flex flex-col gap-10">
        
        {/* Page Header (Hero Section) */}
        <section className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 chess-glass-pill text-zinc-300 px-4 py-2 mb-6 font-medium text-xs tracking-wider uppercase">
            <FileCode className="w-4 h-4 text-white" />
            <span>Developer Docs</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            DezDownload Documentation
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 max-w-2xl leading-relaxed">
            The Ultimate Universal Media Extraction & Downloader Engine. Learn about the features, technical stacks, setup instructions, and core architecture of DezDownload.
          </p>
        </section>

        {/* Introduction Section */}
        <section className="chess-glass rounded-3xl p-6 md:p-8 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <h2 className="text-base md:text-lg font-bold text-white tracking-wide">⚡ Introduction</h2>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
            DezDownload is an elite, high-performance universal media extraction platform. Created by developer <span className="text-white font-semibold">DezReacher</span>, it features a latency-optimized client routing layer and a stream proxy system designed to bypass typical cross-origin browser policies and retrieve high-quality video, audio, and images from any social platform instantly.
          </p>
        </section>

        {/* Features Section */}
        <section className="chess-glass rounded-3xl p-6 md:p-8 border border-white/5 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <h2 className="text-base md:text-lg font-bold text-white tracking-wide">🌟 Key Features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="text-xs md:text-sm font-bold text-white mb-2">Universal Media Extraction</h3>
              <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed">
                Instant links generation for 60+ social networks, sharing sites, and media CDNs including YouTube, TikTok, Instagram, Twitter/X, and more.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="text-xs md:text-sm font-bold text-white mb-2">CORS Bypass Streaming Proxy</h3>
              <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed">
                Seamless programmatic downloading using a server-side ReadableStream proxy, ensuring files download locally without opening tabs.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="text-xs md:text-sm font-bold text-white mb-2">Intelligent Media Sorting</h3>
              <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed">
                Automated ordering of extracted assets, listing videos first (descending by parsed resolution) followed by audio tracks (by bitrate).
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="text-xs md:text-sm font-bold text-white mb-2">Progressive Web App (PWA)</h3>
              <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed">
                Built-in service worker registration and native installation prompt dialogs for offline-ready standalone application experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="chess-glass rounded-3xl p-6 md:p-8 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-white" />
            <h2 className="text-base md:text-lg font-bold text-white tracking-wide">🛠️ Technical Stack</h2>
          </div>
          <div className="overflow-hidden border border-white/10 rounded-2xl bg-black/20">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="p-3 font-semibold text-white">Layer</th>
                  <th className="p-3 font-semibold text-white">Technologies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-400">
                <tr>
                  <td className="p-3 font-medium text-white">Core Framework</td>
                  <td className="p-3">Next.js 15 (App Router, Dynamic SSR) & React 19</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Language</td>
                  <td className="p-3 font-mono">TypeScript (Strict Mode)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Styling</td>
                  <td className="p-3">Tailwind CSS v4 & Vanilla CSS custom design tokens</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Animations & Icons</td>
                  <td className="p-3">Framer Motion (motion/react) & Lucide Icons</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">PWA Infrastructure</td>
                  <td className="p-3">Service Worker registration, manifest routing</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">HTTP Client & Streams</td>
                  <td className="p-3">Axios & Node.js Native Streams</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Installation Section */}
        <section className="chess-glass rounded-3xl p-6 md:p-8 border border-white/5 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-white" />
            <h2 className="text-base md:text-lg font-bold text-white tracking-wide">📦 Installation & Setup</h2>
          </div>
          <div className="space-y-4 text-xs">
            <p className="text-zinc-400">Get DezDownload running locally on your machine in seconds:</p>
            <div className="space-y-2">
              <span className="text-white font-bold block">1. Clone the Repository</span>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-white/5 font-mono text-[10px] md:text-xs text-zinc-300 overflow-x-auto">
{`git clone https://github.com/nblauliadka/DezDownload.git
cd DezDownload`}
              </pre>
            </div>
            <div className="space-y-2">
              <span className="text-white font-bold block">2. Install Dependencies</span>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-white/5 font-mono text-[10px] md:text-xs text-zinc-300 overflow-x-auto">
{`npm install`}
              </pre>
            </div>
            <div className="space-y-2">
              <span className="text-white font-bold block">3. Configure Environment Variables</span>
              <p className="text-zinc-500">Create a <code className="text-zinc-300">.env.local</code> file at the root of the project:</p>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-white/5 font-mono text-[10px] md:text-xs text-zinc-300 overflow-x-auto">
{`NEXT_PUBLIC_APP_URL=http://localhost:3000`}
              </pre>
            </div>
            <div className="space-y-2">
              <span className="text-white font-bold block">4. Start the Development Server</span>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-white/5 font-mono text-[10px] md:text-xs text-zinc-300 overflow-x-auto">
{`npm run dev`}
              </pre>
            </div>
          </div>
        </section>

        {/* Blurred Core Architecture Section with GitHub Paywall */}
        <section className="relative border border-white/10 rounded-3xl bg-black/40 overflow-hidden shadow-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Server className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white tracking-wide">🧠 Core Architecture</h2>
          </div>
          
          {/* Blurred/masked content */}
          <div 
            className="space-y-6 select-none pointer-events-none"
            style={{ 
              maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
            }}
          >
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
              DezDownload operates on a distributed stream-pooling architecture designed for ultra-low latency, parallel extraction, and fail-safe redundancy. The system routes all incoming media URLs through a set of specialized decoders that communicate with remote extraction clusters.
            </p>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. High-Performance Stream Proxying</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                By bypassing client-side browser restrictions through an optimized routing gateway, DezDownload ensures that cross-origin media files (video/mp4, video/webm, audio/mp3) can be downloaded directly onto local storage without triggering navigation or security blocks.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Token-Based Request Rotation</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                A dynamic header injection layer automatically rotates credentials, user-agents, and cookies to minimize rate-limiting and connection throttling from high-traffic content networks.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Concurrency Protection & In-Memory Cache</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                An internal lock manager synchronizes duplicate request streams, while a short-lived cache prevents redundant operations to downstream extraction services, improving overall server performance.
              </p>
            </div>
          </div>

          {/* Blur backdrop & CTA Paywall Overlay */}
          <div className="absolute inset-x-0 bottom-0 top-[20%] backdrop-blur-[5px] bg-gradient-to-b from-transparent via-[#050505]/90 to-[#050505] flex items-center justify-center p-6">
            <div className="chess-glass max-w-md w-full rounded-[24px] p-6 md:p-8 flex flex-col items-center text-center shadow-[0_24px_60px_rgba(0,0,0,0.9)] border border-white/10">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-wide">Developer Documentation Paywall</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                ⭐ Star the repository and Follow <span className="text-white font-semibold">@nblauliadka</span> on GitHub to unlock the complete Core Architecture specs and production source code.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                <a 
                  href="https://github.com/nblauliadka/DezDownload" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-zinc-200 text-black font-bold text-xs px-5 py-3 rounded-full transition-all duration-200 cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  View Repository
                </a>
                <a 
                  href="https://github.com/nblauliadka" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-transparent hover:bg-white/5 border border-white/10 text-white font-semibold text-xs px-5 py-3 rounded-full transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center"
                >
                  Follow @nblauliadka
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Legal Drawer */}
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

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-6 bg-[#080808] px-6 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>DezDownload © {new Date().getFullYear()} • Designed by DezReacher</p>
          <a 
            href="/"
            className="hover:text-white transition-colors cursor-pointer font-medium flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Home
          </a>
        </div>
      </footer>

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

    </div>
  );
}
