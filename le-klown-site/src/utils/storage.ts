// src/utils/storage.ts
import { supabase } from '@/supabase/client'

const BUCKET = resolveBucketName(import.meta.env.VITE_SUPABASE_STORAGE_BUCKET)

function resolveBucketName(raw?: string) {
  const value = (raw ?? '').trim()
  if (!value) return 'Images'
  if (/^https?:\/\//i.test(value)) {
    console.warn('[storage] VITE_SUPABASE_STORAGE_BUCKET doit contenir uniquement le nom du bucket (ex: "media"), pas une URL. Bucket détecté: %s', value)
    return extractBucketFromUrl(value) ?? 'Images'
  }
  return value
}

function extractBucketFromUrl(url: string) {
  try {
    const parsed = new URL(url)
    const parts = parsed.pathname.split('/').filter(Boolean)
    const objectIndex = parts.findIndex((part) => part === 'object')
    if (objectIndex >= 0 && parts[objectIndex + 1] === 'public' && parts[objectIndex + 2]) {
      return parts[objectIndex + 2]
    }
  } catch {
    /* ignore */
  }
  return null
}

export type UploadCategory = 'products' | 'events'

function sanitizeFileName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[^a-zA-Z0-9.\-]/g, '_')
    .replace(/_+/g, '_')
    .trim()
}

function buildPath(category: UploadCategory, file: File, identifier: string) {
  const timestamp = Date.now()
  const safeName = sanitizeFileName(file.name.toLowerCase())
  const folderBase = identifier || crypto.randomUUID()
  const folderSanitized = sanitizeFileName(folderBase)
  const folder = folderSanitized.length > 0 ? folderSanitized : crypto.randomUUID()
  return `${category}/${folder}/${timestamp}_${safeName}`
}

export async function uploadImageToStorage(
  file: File,
  category: UploadCategory,
  identifier: string,
) {
  if (!BUCKET) throw new Error('VITE_SUPABASE_STORAGE_BUCKET is not configured.')

  if (!file.type.startsWith('image/')) {
    throw new Error('Le fichier doit être une image.')
  }

  const path = buildPath(category, file, identifier)
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    if (error.message?.toLowerCase().includes('bucket')) {
      throw new Error(`Bucket "${BUCKET}" introuvable. Vérifie VITE_SUPABASE_STORAGE_BUCKET et que le bucket existe dans Supabase Storage.`)
    }
    throw error
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  if (!data?.publicUrl) {
    throw new Error('Impossible de récupérer l’URL publique.')
  }

  return data.publicUrl
}

export function requiredBucketName() {
  return BUCKET
}
