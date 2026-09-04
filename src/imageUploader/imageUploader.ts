import { Request } from "express"
import multer from "multer"

const storage = multer.memoryStorage()

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

function generateFilename(originalname: string) {
    return Date.now().toString() + '-' + originalname
}

export const upload = multer({ storage, fileFilter })

export function prepareFiles(req: Request) {
    let preview: { buffer: Buffer; filename: string } | null = null
    let images: { buffer: Buffer; filename: string }[] = []

    if (req.files && 'preview' in req.files) {
        const file = req.files.preview[0]
        preview = { buffer: file.buffer, filename: generateFilename(file.originalname) }
    }
    if (req.files && 'images' in req.files) {
        images = req.files.images.map(x => ({
            buffer: x.buffer,
            filename: generateFilename(x.originalname)
        }))
    }

    return { preview, images }
}

export function cleanupFiles(req: Request) {
    // memoryStorage — nothing to clean up on disk
}