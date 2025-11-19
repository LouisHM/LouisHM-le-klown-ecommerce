// src/utils/imageCache.ts
const CACHE_NAME = 'lekown-media-cache-v1'
const MAX_ENTRIES = 140

const objectUrlCache = new Map<string, string>()
const inflight = new Map<string, Promise<string | null>>()

function isBrowser() {
  return typeof window !== 'undefined' && typeof fetch !== 'undefined'
}

function supportsCacheStorage() {
  return isBrowser() && typeof caches !== 'undefined'
}

function normalizeUrl(raw?: string | null) {
  const value = (raw ?? '').trim()
  if (!value) return null
  if (value.startsWith('data:') || value.startsWith('blob:')) return null
  return value
}

async function openCache(): Promise<Cache | null> {
  if (!supportsCacheStorage()) return null
  try {
    return await caches.open(CACHE_NAME)
  } catch (err) {
    console.warn('[imageCache] unable to open cache', err)
    return null
  }
}

async function trimCache(cache: Cache) {
  try {
    const keys = await cache.keys()
    if (keys.length <= MAX_ENTRIES) return
    const excess = keys.length - MAX_ENTRIES
    for (let i = 0; i < excess; i += 1) {
      await cache.delete(keys[i])
    }
  } catch (err) {
    console.warn('[imageCache] unable to trim cache', err)
  }
}

async function fetchAndPersist(url: string): Promise<string | null> {
  if (!isBrowser()) return url

  const cache = await openCache()
  let response: Response | null = null
  let foundInCache = false

  try {
    response = cache ? (await cache.match(url)) ?? null : null
    foundInCache = !!response
  } catch (err) {
    console.warn('[imageCache] cache.match failed', err)
  }

  if (!response) {
    try {
      response = await fetch(url, { mode: 'cors', cache: 'default' })
    } catch (err) {
      console.warn('[imageCache] fetch failed', err)
      return url
    }
  }

  if (!response || !response.ok) return url

  if (cache && !foundInCache) {
    try {
      await cache.put(url, response.clone())
      await trimCache(cache)
    } catch (err) {
      console.warn('[imageCache] cache.put failed', err)
    }
  }

  try {
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (err) {
    console.warn('[imageCache] unable to build blob URL', err)
    return url
  }
}

export async function getCachedImageUrl(rawUrl?: string | null): Promise<string | null> {
  const url = normalizeUrl(rawUrl)
  if (!url) return null

  const existing = objectUrlCache.get(url)
  if (existing) return existing

  let pending = inflight.get(url)
  if (!pending) {
    pending = fetchAndPersist(url)
    inflight.set(url, pending)
  }

  try {
    const result = await pending
    if (result) {
      objectUrlCache.set(url, result)
      return result
    }
    return url
  } finally {
    inflight.delete(url)
  }
}

export async function prefetchImages(urls: Array<string | null | undefined> | Set<string>) {
  if (!isBrowser()) return
  const unique = Array.from(new Set(Array.from(urls).map((u) => normalizeUrl(u)).filter(Boolean) as string[]))
  if (!unique.length) return
  await Promise.all(unique.map((url) => getCachedImageUrl(url).catch(() => null)))
}

export function resetImageMemoryCache() {
  objectUrlCache.clear()
  inflight.clear()
}
