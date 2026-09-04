import { BlobStorage } from './blob-storage'
import { LocalStorage } from './local-storage'
import { IStorage } from './storage.interface'
// import process from "node:process"
export const storage: IStorage =
  process.env.STORAGE_TYPE === 'vercel-blob'
    ? new BlobStorage()
    : new LocalStorage()
