import type { StoredFile, StoreFileInput } from "@/lib/storage/types"

const storageErrorMessage =
  "Storage backend not configured. Configure Cloudflare R2 or an S3-compatible storage provider before enabling file retention."

export async function storeFile(input: StoreFileInput): Promise<StoredFile> {
  void input
  // TODO(storage): connect Cloudflare R2 or S3-compatible storage here.
  throw new Error(storageErrorMessage)
}

export async function deleteStoredFile(key: string): Promise<void> {
  void key
  // TODO(storage): delete the object from Cloudflare R2 or S3-compatible storage here.
  throw new Error(storageErrorMessage)
}

export async function getSignedFileUrl(key: string): Promise<string> {
  void key
  // TODO(storage): return a short-lived signed URL from Cloudflare R2 or S3-compatible storage.
  throw new Error(storageErrorMessage)
}
