import type { StoredFile, StoreFileInput } from "@/lib/storage/types"

export async function storeFileLocallyForDevelopment(
  input: StoreFileInput
): Promise<StoredFile> {
  // Development-only placeholder. Do not use for production storage.
  // Future local testing can write to a temporary, gitignored directory after explicit approval.
  console.warn("Local placeholder storage is not production storage.")

  return {
    key: `${input.folder}/${input.file.name}`,
    visibility: input.visibility ?? "private",
    contentType: input.file.type,
    sizeBytes: input.file.size,
    createdAt: new Date().toISOString(),
  }
}
