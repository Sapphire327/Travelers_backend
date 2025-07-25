import {Request, Response, Router} from "express";
import {QuoteService} from "./quotes.service";
import {authMiddleware} from "@/middlewares/auth.middleware";
import {createQuoteDTO} from "@/quotes/quote.dto";
const router = Router()

const quotesService = new QuoteService()

router.post('/',authMiddleware,(req:Request,res:Response)=>{
    const validation = createQuoteDTO.safeParse(req.body)
    if(!validation.success) {
        res.json({message: validation.error}).status(400)
        return
    }
    const quote = quotesService.createQuote(req.body)
    res.status(201).json(quote)
})

export const quotesRouter=router