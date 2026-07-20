import axios from "axios";

// Cobalt v10 API — endpoint is POST / at the base URL (not /api/json which was the old v7 path)
// Configure via .env.local:
//   COBALT_API_URL  — base URL of your Cobalt instance (defaults to api.cobalt.tools)
//   COBALT_API_KEY  — optional Api-Key if your instance requires key auth
const COBALT_BASE_URL = (process.env.COBALT_API_URL || "https://api.cobalt.tools").replace(/\/+$/, "");
const COBALT_API = `${COBALT_BASE_URL}/`;
const COBALT_API_KEY = process.env.COBALT_API_KEY || "";

// [DIAG] Log resolved env vars on module load so misconfigurations are immediately visible
console.log("[downr] COBALT_BASE_URL resolved to:", JSON.stringify(COBALT_BASE_URL));
console.log("[downr] COBALT_API endpoint:", JSON.stringify(COBALT_API));
console.log("[downr] COBALT_API_KEY present:", COBALT_API_KEY ? `yes (${COBALT_API_KEY.length} chars)` : "no");

function buildCobaltHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };
  if (COBALT_API_KEY) {
    headers["Authorization"] = `Api-Key ${COBALT_API_KEY}`;
  }
  return headers;
}

// In-memory caching for redundant URL requests
interface CacheEntry {
  data: any;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes cache per URL to survive viral storms

// Cleanup old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now > value.expiresAt) {
      cache.delete(key);
    }
  }
}, 1000 * 60 * 5); // every 5 minutes

function sanitizeUrl(inputUrl: string): string {
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
}

export function isCobaltOk(status: number, data: any) {
  if (status < 200 || status >= 300) return false;
  if (!data || typeof data !== "object") return false;
  if (data.status === "error") return false;
  return data.status === "tunnel" || data.status === "redirect" || data.status === "picker";
}

export function getError(data: any, status: number) {
  let code = "";
  if (data && typeof data === "object") {
    if (data.status === "error" && data.error && typeof data.error === "object") {
      code = data.error.code || "";
    } else if (typeof data.error === "string") {
      code = data.error;
    }
  }

  if (code) {
    const cleanCode = code.toLowerCase();

    // Auth errors — all public Cobalt instances now require JWT or API key
    if (cleanCode.includes("auth.jwt") || cleanCode.includes("auth.apikey") || cleanCode.includes("jwt.missing")) {
      return "⚠️ Instance Cobalt ini memerlukan otentikasi (JWT/API Key). " +
        "Silakan tambahkan COBALT_API_KEY di .env.local atau ganti COBALT_API_URL ke instance yang tidak memerlukan auth.";
    }
    if (cleanCode.includes("auth")) {
      return "⚠️ Akses ditolak. Layanan memerlukan otentikasi atau kunci API yang valid.";
    }

    if (cleanCode.includes("empty") || cleanCode.includes("invalid") || cleanCode.includes("url")) {
      return "⚠️ Konten tidak ditemukan atau link tidak valid. Pastikan URL yang dimasukkan benar.";
    }
    if (cleanCode.includes("rate") || status === 429) {
      return "⚠️ Terlalu banyak permintaan (Limit Terlampaui). Mohon tunggu beberapa saat sebelum mencoba lagi.";
    }
    if (cleanCode.includes("youtube")) {
      return "⚠️ Gagal mengekstrak video YouTube. Server mendeteksi pembatasan akses.";
    }
    if (cleanCode.includes("content.too_long") || cleanCode.includes("link.short")) {
      return "⚠️ Link media tidak didukung atau terlalu panjang. Coba gunakan link langsung ke video.";
    }
    if (cleanCode.includes("service")) {
      return "⚠️ Platform ini belum didukung atau sedang mengalami gangguan. Coba platform lain.";
    }
    if (cleanCode.includes("fetch") || cleanCode.includes("fail") || cleanCode.includes("critical")) {
      return "⚠️ Server gagal mengunduh media dari link tersebut. Silakan coba lagi nanti.";
    }
  }

  if (status === 401) {
    return "⚠️ Instance Cobalt ini memerlukan otentikasi. " +
      "Tambahkan COBALT_API_KEY di .env.local atau arahkan COBALT_API_URL ke instance tanpa auth.";
  }
  if (status === 403) {
    return "⚠️ URL tidak valid atau ditolak server. Pastikan link video bersih dari parameter tambahan (seperti playlist).";
  }
  if (status === 429) {
    return "⚠️ Terlalu banyak permintaan. Mohon tunggu sebentar, lalu coba lagi.";
  }

  return "⚠️ Gagal mengekstrak media. Silakan periksa kembali URL Anda dan coba lagi.";
}

function getExtension(filename: string): string {
  if (!filename) return "";
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

function getTitle(filename: string): string {
  if (!filename) return "Extracted Media";
  const parts = filename.split(".");
  if (parts.length > 1) {
    parts.pop();
  }
  return parts.join(".");
}

function getQualityFromFilename(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes("8k") || lower.includes("4320p")) return "4320p (8K)";
  if (lower.includes("4k") || lower.includes("2160p")) return "2160p (4K)";
  if (lower.includes("2k") || lower.includes("1440p")) return "1440p (2K)";
  if (lower.includes("1080p") || lower.includes("1080")) return "1080p (FHD)";
  if (lower.includes("720p") || lower.includes("720")) return "720p (HD)";
  if (lower.includes("480p") || lower.includes("480")) return "480p";
  if (lower.includes("360p") || lower.includes("360")) return "360p";
  if (lower.includes("240p") || lower.includes("240")) return "240p";
  if (lower.includes("144p") || lower.includes("144")) return "144p";
  return "1080p (FHD)";
}

// Global promise maps so we don't fetch the exact same URL concurrently
// This prevents overwhelming the server if many people ask for the same video simultaneously
const pendingRequests = new Map<string, Promise<any>>();

export async function downr(url: string) {
  try {
    if (!url || !/^https?:\/\//i.test(url)) {
      throw new Error("Invalid url.");
    }

    const sanitizedUrl = sanitizeUrl(url);

    // Checking Cache First
    if (cache.has(sanitizedUrl)) {
      const cached = cache.get(sanitizedUrl)!;
      if (Date.now() < cached.expiresAt) {
        return cached.data;
      } else {
        cache.delete(sanitizedUrl);
      }
    }

    // Coalesce duplicate pending requests (Dog-pile prevention)
    if (pendingRequests.has(sanitizedUrl)) {
      return await pendingRequests.get(sanitizedUrl);
    }

    const requestPromise = (async () => {
      const cobaltHeaders = buildCobaltHeaders();

      // [DIAG] Log exact request being sent to Cobalt before the fetch
      console.log("[downr] >>> POST", COBALT_API);
      console.log("[downr] >>> Headers:", JSON.stringify(cobaltHeaders));
      console.log("[downr] >>> Body (video):", JSON.stringify({ url: sanitizedUrl, videoQuality: "max", downloadMode: "auto" }));

      // Call Cobalt in parallel for video (auto mode = best video+audio merged) and audio-only
      const videoPromise = axios.post(
        COBALT_API,
        {
          url: sanitizedUrl,
          videoQuality: "max",
          downloadMode: "auto"
        },
        {
          headers: cobaltHeaders,
          timeout: 30000,
          validateStatus: () => true
        }
      );

      const audioPromise = axios.post(
        COBALT_API,
        {
          url: sanitizedUrl,
          downloadMode: "audio"
        },
        {
          headers: cobaltHeaders,
          timeout: 30000,
          validateStatus: () => true
        }
      );

      const [videoResult, audioResult] = await Promise.allSettled([videoPromise, audioPromise]);

      // [DIAG] Log raw Cobalt responses
      if (videoResult.status === "fulfilled") {
        console.log("[downr] <<< Video HTTP Status:", videoResult.value.status);
        console.log("[downr] <<< Video Raw Response:", JSON.stringify(videoResult.value.data));
      } else {
        console.error("[downr] <<< Video Request REJECTED:", videoResult.reason?.message, videoResult.reason?.code, videoResult.reason?.config?.url);
      }
      if (audioResult.status === "fulfilled") {
        console.log("[downr] <<< Audio HTTP Status:", audioResult.value.status);
        console.log("[downr] <<< Audio Raw Response:", JSON.stringify(audioResult.value.data));
      } else {
        console.error("[downr] <<< Audio Request REJECTED:", audioResult.reason?.message, audioResult.reason?.code, audioResult.reason?.config?.url);
      }

      const medias: any[] = [];
      let title = "Extracted Media";
      let thumbnail: string | null = null;

      if (videoResult.status === "fulfilled" && videoResult.value) {
        const { status, data } = videoResult.value;
        if (isCobaltOk(status, data)) {
          if (data.status === "picker") {
            if (Array.isArray(data.picker)) {
              data.picker.forEach((item: any, index: number) => {
                const ext = item.type === "photo" ? "jpg" : (item.type === "gif" ? "gif" : "mp4");
                medias.push({
                  url: item.url,
                  type: item.type || "photo",
                  ext: ext,
                  quality: "original",
                  label: `${item.type || "photo"} #${index + 1}`,
                  hasAudio: item.type === "video",
                  audio: item.type === "video"
                });
                if (!thumbnail && item.thumb) {
                  thumbnail = item.thumb;
                }
              });
            }
          } else {
            const filename = data.filename || "";
            const ext = getExtension(filename) || "mp4";
            title = getTitle(filename);
            medias.push({
              url: data.url,
              type: "video",
              ext: ext,
              quality: getQualityFromFilename(filename),
              label: getQualityFromFilename(filename),
              hasAudio: true,
              audio: true
            });
          }
        }
      }

      if (audioResult.status === "fulfilled" && audioResult.value) {
        const { status, data } = audioResult.value;
        if (isCobaltOk(status, data)) {
          if (data.status === "tunnel" || data.status === "redirect") {
            const filename = data.filename || "";
            const ext = getExtension(filename) || "mp3";
            if (title === "Extracted Media" && filename) {
              title = getTitle(filename);
            }
            medias.push({
              url: data.url,
              type: "audio",
              ext: ext,
              quality: "320kbps",
              label: "Best Audio",
              hasAudio: true,
              audio: true
            });
          }
        }
      }

      const ok = medias.length > 0;

      if (!ok) {
        let errorData: any = null;
        let errorCode = 500;

        if (videoResult.status === "fulfilled") {
          errorData = videoResult.value.data;
          errorCode = videoResult.value.status;
        } else if (videoResult.status === "rejected") {
          const error = (videoResult as PromiseRejectedResult).reason;
          errorData = error?.response?.data || error;
          errorCode = error?.response?.status || 500;
        }

        if (!errorData && audioResult.status === "fulfilled") {
          errorData = audioResult.value.data;
          errorCode = audioResult.value.status;
        } else if (!errorData && audioResult.status === "rejected") {
          const error = (audioResult as PromiseRejectedResult).reason;
          errorData = error?.response?.data || error;
          errorCode = error?.response?.status || 500;
        }

        const errorMsg = getError(errorData, errorCode);
        return {
          Status: false,
          Code: errorCode,
          Input: sanitizedUrl,
          Endpoint: COBALT_API,
          Result: null,
          Error: errorMsg
        };
      }

      const finalOutput = {
        Status: true,
        Code: 200,
        Input: sanitizedUrl,
        Endpoint: COBALT_API,
        Result: {
          title,
          thumbnail,
          author: null,
          source: "Cobalt",
          duration: null,
          medias
        },
        Error: null
      };

      // Save to cache on success
      cache.set(sanitizedUrl, {
        data: finalOutput,
        expiresAt: Date.now() + CACHE_TTL_MS
      });

      return finalOutput;
    })();

    pendingRequests.set(sanitizedUrl, requestPromise);
    const data = await requestPromise;
    pendingRequests.delete(sanitizedUrl);
    return data;
  } catch (err: any) {
    // [DIAG] Surface the raw error — do NOT swallow this
    console.error("[downr] CAUGHT OUTER ERROR:", err?.message);
    console.error("[downr] Error code:", err?.code);
    console.error("[downr] Error config URL:", err?.config?.url);
    console.error("[downr] Full error:", err);
    pendingRequests.delete(url);
    return {
      Status: false,
      Code: err.response?.status || 500,
      Input: url || null,
      Endpoint: COBALT_API,
      Result: null,
      Error: err.message || "Unknown error"
    };
  }
}
