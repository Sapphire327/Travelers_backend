import multer from "multer";
import {Request} from "express";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString()+'-'+file.originalname)
    }
})
const fileFilter = ( req: Request,     file: Express.Multer.File,cb: multer.FileFilterCallback) => {
    if(file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"||
        file.mimetype === "image/jpeg"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}
export const upload = multer({storage, fileFilter: fileFilter})