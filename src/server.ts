import express from 'express';
import dotenv from "dotenv";
import {NextFunction,Request,Response} from "express";
import cors from 'cors'
import errorMiddleware from './middlewares/error-middleware'
import router from './router/index'
import cookieParser from "cookie-parser"
import path from 'path';
import {AuthService} from "@/auth/auth.service";
dotenv.config()
const app = express()
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser())
const client_url = process.env.CLIENT_SERVER_URL || 'http://localhost:3000';
app.use(cors({origin:[client_url],credentials:true}))
// app.use('/api',router)
app.use('/',router)
app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.use(errorMiddleware)
const authService = new AuthService();

async function main(){
    try{
        authService.createAdmin()
        app.all(/.*/, (req, res)=> {
            res.status(404).json({message:"Not Found"})
        });
        app.use((err:Error,req:Request,res:Response,next:NextFunction)=> {
            res.status(500).json({message:"Internal Server Error"})
        })
        app.listen(process.env.PORT,()=>{
            console.log(`server is running on port:${process.env.PORT}`)
        });
    }
    catch (e){
    }
}

main();