export type StorageVisibility = "private" | "public"

export interface StoredFile {
  key: string
  url?: string
  visibility: StorageVisibility
  contentType: string
  sizeBytes: number
  createdAt: string
}

export interface StoreFileInput {
  file: File
  folder: string
  visibility?: StorageVisibility
}
