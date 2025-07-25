import {Quote} from "@/quotes/quote.types";
import {z} from "zod";

export const createQuoteDTO = z.object({
    author: z.string().min(1).max(280),
    quotes: z.string().min(1).max(280),
})