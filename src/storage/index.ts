import { IStorage } from './storage.interface'
import { LocalStorage } from './local-storage'
import { BlobStorage } from './blob-storage'

export const storage: IStorage =
  process.env.STORAGE_TYPE === 'vercel-blob'
    ? new BlobStorage()
    : new LocalStorage()
