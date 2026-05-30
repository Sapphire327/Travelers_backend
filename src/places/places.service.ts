import { prisma } from '@/db'
import ApiError from "@/exceptions/api-error"
import { placeCreate, placeEdit } from "@/places/models/places.dto"
import fs from "fs"
export class PlaceService {
    async createPlace(placeData: placeCreate) {
        await prisma.places.create({
            data: {
                ...placeData,
                images:JSON.stringify(placeData.images),
                mapCode: placeData.mapCode?.replace('https://yandex.ru/maps/?um=constructor%', ''),
            }
        })
    }
    async editPlace(placeData: placeEdit) {
        const place = await prisma.places.findUnique({ where: { id: placeData.id } })
        if (!place) throw ApiError.BadRequest('Запись была удалена или перемещена')
        if (placeData.deleteImages)
            placeData.deleteImages.forEach((file) => {
                fs.unlink('public\\' + file, () => { })
            })
        if (placeData.preview)
            fs.unlink('public\\' + place.preview, () => { })

        let oldImage =JSON.parse(place.images) as string[];
        if (placeData.deleteImages != null && placeData.deleteImages.length > 0) { // @ts-ignore
            oldImage = oldImage.filter(img => !placeData.deleteImages.includes(img))
        }

        const newImgList = [...oldImage, ...placeData.images]
        const preview = placeData.preview || place.preview
        await prisma.places.update({
            where: {
                id: placeData.id
            },
            data: {
                preview: preview,
                name: placeData.name,
                otherInfo: placeData.otherInfo,
                mapCode: placeData.mapCode?.replace('https://yandex.ru/maps/?um=constructor%', ''),
                description: placeData.description,
                images: JSON.stringify(newImgList)
            }
        })
    }
    async removePlace(id: number) {
        const place = await prisma.places.findUnique({ where: { id: id } })
        if (!place) throw ApiError.BadRequest('Запись не найдена')
        const images = JSON.parse(place.images) as string[];
        if (images && images.length > 0)
            images.forEach((file) => {
                fs.unlink('uploads\\' + file, () => { })
            })
        if (place.preview)
            fs.unlink('uploads\\' + place.preview, () => { })
        await prisma.tours.deleteMany({ where: { placesId: id } })
        await prisma.places.delete({ where: { id: id } })
    }
    async getPlacesList() {
        return prisma.places.findMany({ select: { id: true, name: true } })
    }
    async getPlaceById(id: number) {
        const findedPlace = await prisma.places.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                images: true,
                preview: true,
                mapCode: true,
                description: true,
                otherInfo: true
            }
        })
        if (!findedPlace) throw ApiError.BadRequest('Запись не найдена')
            console.log(findedPlace.images);
            console.log(JSON.parse(findedPlace.images));
            
        return {...findedPlace,images:JSON.parse(findedPlace.images)}
    }
}