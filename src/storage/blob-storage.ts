import { put, del } from '@vercel/blob'
import { IStorage } from './storage.interface'

export class BlobStorage implements IStorage {
  async upload(buffer: Buffer, filename: string): Promise<string> {
    const blob = await put(filename, buffer, { access: 'public' })
    return blob.url
  }

  async delete(url: string): Promise<void> {
    await del(url)
  }
}
