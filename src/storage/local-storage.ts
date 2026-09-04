import fs from 'fs'
import path from 'path'
import { IStorage } from './storage.interface'

export class LocalStorage implements IStorage {
  private uploadDir = path.resolve('public')

  async upload(buffer: Buffer, filename: string): Promise<string> {
    const filePath = path.join(this.uploadDir, filename)
    await fs.promises.writeFile(filePath, buffer)
    return filename
  }

  async delete(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename)
    await fs.promises.unlink(filePath).catch(() => {})
  }
}
