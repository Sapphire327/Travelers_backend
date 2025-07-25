import {PrismaClient} from "@/generated/prisma";
import {placeCreate, placeEdit} from "@/places/models/places.dto";
import fs from "fs";
import ApiError from "@/exceptions/api-error";

export class PlaceService {
    prisma = new PrismaClient();
    async createPlace(placeData:placeCreate){
        await this.prisma.places.create({data:{
            ...placeData,
            mapCode:placeData.mapCode?.replace('https://yandex.ru/maps/?um=constructor%',''),
        }})
    }
    async editPlace(placeData:placeEdit){
        const place = await this.prisma.places.findUnique({where:{id:placeData.id}})
        if(!place) throw ApiError.BadRequest('Запись была удалена или перемещена')
        if(placeData.deleteImages)
            placeData.deleteImages.forEach((file)=>{
                fs.unlink('uploads\\'+file,()=>{})
            })
        if(placeData.preview)
            fs.unlink('uploads\\'+place.preview,()=>{})

        let oldImage = place.images
        if (placeData.deleteImages!=null&&placeData.deleteImages.length>0)
        { // @ts-ignore
            oldImage = oldImage.filter(img=>!placeData.deleteImages.includes(img))
        }

        const newImgList = [...oldImage,...placeData.images]
        const preview = placeData.preview||place.preview
        await this.prisma.places.update({
            where:{
                id:placeData.id
            },
            data:{
                preview:preview,
                name:placeData.name,
                otherInfo:placeData.otherInfo,
                mapCode:placeData.mapCode?.replace('https://yandex.ru/maps/?um=constructor%',''),
                description:placeData.description,
                images:newImgList
            }})
    }
    async removePlace(id:number){
        const place = await this.prisma.places.findUnique({where:{id:id}})
        if(!place) throw ApiError.BadRequest('Запись не найдена')
        if(place.images&&place.images.length>0)
            place.images.forEach((file)=>{
                fs.unlink('uploads\\'+file,()=>{})
            })
        if(place.preview)
            fs.unlink('uploads\\'+place.preview,()=>{})
        await this.prisma.places.delete({where:{id:id}})
    }
    async getPlacesList(){
        return this.prisma.places.findMany({select:{id:true,name:true}})
    }
    async getPlaceById(id:number){
        const findedPlace =  await this.prisma.places.findUnique({
            where:{id},
            select:{
                id:true,
                name:true,
                images:true,
                preview:true,
                mapCode:true,
                description:true,
                otherInfo:true
            }
        })
        if(!findedPlace)throw ApiError.BadRequest('Запись не найдена')
        return findedPlace;
    }
}