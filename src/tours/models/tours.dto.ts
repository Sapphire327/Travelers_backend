import {z} from "zod";
import {Tours} from "@/generated/prisma";

export type tourCreate = Omit<Tours,'id'|'applications'>
export type tourEdit = Omit<Tours,'applications'>

export const tourCreateDTO = z.object({
    datesFrom:z.coerce.date({message:"Отсутствует дата старта"}),
    datesTo:z.coerce.date({message:"Отсутствует дата финиша"}),
    maxPeople:z.coerce.number({message:"Отсутствует число людей в группе"}),
    startPlace:z.string({message:"Отсутствует ссылка на место старта"}),
    price:z.coerce.number({message:"Отсутствует цена"}),
    placesId:z.coerce.number({message:"Не выбрано место"}),
})
export const tourEditDTO = z.object({
    id:z.coerce.number(),
    datesFrom:z.coerce.date(),
    datesTo:z.coerce.date(),
    maxPeople:z.coerce.number(),
    startPlace:z.string(),
    price:z.coerce.number(),
    placesId:z.coerce.number(),
    
})