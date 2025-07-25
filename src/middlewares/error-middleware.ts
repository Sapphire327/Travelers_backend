import ApiError from "@/exceptions/api-error";
import {Response,Request,NextFunction} from "express";
import {ZodError} from "zod";
export default function (err: Error, req: Request, res: Response, next: NextFunction) {
    if(err instanceof ApiError) {
        res.status(err.status).json({message: err.message,errors:err.errors})
    }else if (err instanceof ZodError){
        res.status(400).json({message: err.message,errors:err.errors.map(x=>x.message)})
    }
    else{
        res.status(500).json({message: 'Непредвиденная ошибка'})
        console.log(err)
    }
}