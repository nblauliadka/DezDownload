# DezDownload

<p align="center">
  <b>Enterprise-Grade Universal Media Extraction Architecture</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge" alt="PWA" />
</p>

---

## ⚡ The Vision

DezDownload is an ultra-fast, latency-optimized universal media extraction platform. The project is designed with a core architectural goal: to provide an ad-free, completely unlimited, and lightweight client-side routing layer that allows users to instantly retrieve raw high-quality video, audio, and image assets from any major platform. By implementing connection-pooled serverless edge proxies, DezDownload bypasses browser cross-origin constraints and serves clean streams directly to the local storage interface.

---

## 🌟 Core Features

- **Dynamic Client Routing**: Evaluates and routes raw incoming URL strings to dedicated extractor handlers instantly, ensuring zero lookup overhead.
- **Fail-Safe Redundancy & Proxy Streaming**: Leverages a highly optimized `/api/proxy` endpoint that pipes upstream chunked data streams directly as native file downloads, avoiding browser blockages and CORS restrictions.
- **Auto-Sorting Media Outputs**: Automatically categorizes extracted media resources by type (video, audio, fallback), sorting videos descending by parsed resolution (e.g. 4K, 1080p, 720p) and audio by quality/bitrate (e.g. 320kbps, 192kbps).
- **Offline-Ready Progressive Web App (PWA)**: Completely PWA-ready with an automated service worker cache register and native prompt overlays for instantaneous standalone desktop and mobile deployment.
- **Minimalist Premium Dark Theme**: A gorgeous dark-themed user interface styled with rich glassmorphism container sheets, responsive slide-over drawers, and interactive transition micro-animations.

---

## 🌐 Supported Networks

DezDownload includes native extraction parsing logic for over 60+ social platforms, video sharing systems, and music networks:

| Media Type | Supported Platforms |
|---|---|
| **Social & Video** | YouTube, TikTok, Instagram, X (Twitter), Facebook, Threads, Reddit, Vimeo, Snapchat, Pinterest, Dailymotion, Bilibili, Douyin, Kuaishou, Xiaohongshu, Weibo, Bitchute, Rumble, Odysee, Flickr, TED, Redgifs, 9GAG, VK, OK.ru |
| **Audio & Music** | Spotify, SoundCloud, Bandcamp, Mixcloud, Apple Podcasts, Tidal, Deezer, Napster, Amazon Music, Audiomack, Boomplay, Anghami, JioSaavn, Gaana, Wynk, Resso |
| **Developer & Portfolios** | GitHub, GitLab, Quora, Medium, Substack, Dribbble, Behance |

---

## 🛠️ Quick Start (Local Development)

Get a local copy of DezDownload up and running in a few simple steps:

### 1. Clone the Repository
```bash
git clone https://github.com/nblauliadka/DezDownload.git
cd DezDownload
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file at the root of the workspace directory:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser to access the local deployment instance.

---

## ⚖️ Legal Disclaimer

DezDownload is an educational utility tool designed strictly for parsing public resource metadata links. By running or using this repository, you agree to access content only for personal, non-commercial purposes in full compliance with copyright laws and DMCA policies. The creator (**DezReacher**) and contributors assume no legal responsibility or liability for how users access, handle, or utilize the parsed public streams. We do not store, host, or cache any files or user records.
