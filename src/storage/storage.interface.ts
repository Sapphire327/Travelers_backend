export interface IStorage {
  upload(buffer: Buffer, filename: string): Promise<string>
  delete(stored: string): Promise<void>
}
