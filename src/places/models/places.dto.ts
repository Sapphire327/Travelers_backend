import { Places } from "@/generated/prisma"
import { z } from "zod"

export type placeCreate = Omit<Places,'id'|'Tours'|'images'>& {images:string[]}
export type placeEdit = Omit<Places,'Tours'|'images'>&{deleteImages?:string[],images:string[]}

export const placeCreateDTO = z.object({
    name:z.string({message:'Отсутствует имя локации'}).min(1,{message:'Отсутствует имя локации'}),
    description:z.string().min(1,{message:'Отсутствует описание локации'}),
    mapCode:z.nullable(z.string()),
    otherInfo:z.nullable(z.string()),
})
export const placeEditDTO = z.object({
    id:z.coerce.number(),
    name:z.string({message:'Отсутствует имя локации'}).min(1,{message:'Отсутствует имя локации'}),
    description:z.string().min(1,{message:'Отсутствует описание локации'}),
    mapCode:z.nullable(z.string()),
    otherInfo:z.nullable(z.string()),
    deleteImages:z.optional(z.array(z.string()))
})