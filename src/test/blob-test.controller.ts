import { put } from '@vercel/blob'
import { Router, Request, Response } from 'express'
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })
const testBlobRouter = Router()

testBlobRouter.post('/', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    const result: Record<string, any> = {}

    // Step 1: Environment
    const token = process.env.BLOB_READ_WRITE_TOKEN
    result.step1_env = {
        STORAGE_TYPE: process.env.STORAGE_TYPE || '(not set)',
        tokenExists: !!token,
        tokenLength: token ? token.length : 0,
        tokenPrefix: token ? token.slice(0, 8) + '...' : '(empty)',
    }

    // Step 2: File from multer
    if (!req.file) {
        result.step2_file = { error: 'No file received. Check Content-Type: multipart/form-data and field name "file".' }
        res.status(400).json(result)
        return
    }

    result.step2_file = {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        bufferIsBuffer: Buffer.isBuffer(req.file.buffer),
        bufferLength: req.file.buffer?.length,
    }

    // Step 3: Upload to Vercel Blob
    try {
        const filename = Date.now() + '-' + req.file.originalname
        const blob = await put(filename, req.file.buffer, { access: 'public' })
        result.step3_blob = {
            success: true,
            url: blob.url,
            pathname: blob.pathname,
            contentType: blob.contentType,
            contentDisposition: blob.contentDisposition,
        }
        res.json(result)
    } catch (e: any) {
        result.step3_blob = {
            success: false,
            errorName: e.name,
            errorMessage: e.message,
            stack: e.stack,
        }
        res.status(500).json(result)
    }
})

export default testBlobRouter
