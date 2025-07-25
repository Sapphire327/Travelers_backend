import {z} from "zod";
import {Applications} from "@/generated/prisma";

export type applicationCreate = Omit<Applications,'id'|'status'|'createdAt'>&{toursId:number}
export type applicationEdit = Omit<Applications,'createdAt'|'status'>&{toursId:number}
export type applicationPatchDto = {id:number,toursId:number}
export type applicationGetByTourDto = {toursId?:number}

export const applicationGetByTourDTO = z.object({
    toursId:z.coerce.number({message:'Тур не найден'}),
})
export const applicationCreateDTO = z.object({
    fio:z.string({message:'Отсутствует ФИО'}).min(1,{message:'Отсутствует ФИО'}),
    phone:z.string({message:'Отсутствует номер телефона'}).min(1,{message:'Отсутствует номер телефона'}),
    comment:z.string(),
    toursId:z.coerce.number({message:'Запись тура не найдена'}),
})
export const applicationEditDTO = z.object({
    id:z.coerce.number(),
    fio:z.string({message:'Отсутствует ФИО'}).min(1,{message:'Отсутствует ФИО'}),
    phone:z.string({message:'Отсутствует номер телефона'}).min(1,{message:'Отсутствует номер телефона'}),
    comment:z.string(),
    toursId:z.coerce.number(),
})
export const applicationPatchDTO = z.object({
    id:z.coerce.number(),
    toursId:z.coerce.number(),
})