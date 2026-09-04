import { prisma } from '@/db'
import ApiError from "@/exceptions/api-error"
import { FileData, placeCreate, placeEdit } from "@/places/models/places.dto"
import { storage } from "@/storage"

export class PlaceService {
    private async uploadFile(file: FileData): Promise<string> {
        return storage.upload(file.buffer, file.filename)
    }

    private async deleteFile(stored: string): Promise<void> {
        await storage.delete(stored)
    }

    async createPlace(placeData: placeCreate) {
        const imageNames: string[] = []
        for (const img of placeData.images) {
            imageNames.push(await this.uploadFile(img))
        }

        let previewName: string | null = null
        if (placeData.preview) {
            previewName = await this.uploadFile(placeData.preview)
        }

        await prisma.places.create({
            data: {
                name: placeData.name,
                description: placeData.description,
                otherInfo: placeData.otherInfo,
                mapCode: placeData.mapCode?.replace('https://yandex.ru/maps/?um=constructor%', ''),
                images: JSON.stringify(imageNames),
                preview: previewName,
            }
        })
    }

    async editPlace(placeData: placeEdit) {
        const place = await prisma.places.findUnique({ where: { id: placeData.id } })
        if (!place) throw ApiError.BadRequest('Запись была удалена или перемещена')

        // Delete removed images
        if (placeData.deleteImages) {
            for (const file of placeData.deleteImages) {
                await this.deleteFile(file)
            }
        }

        // Delete old preview if replacing
        if (placeData.preview && place.preview) {
            await this.deleteFile(place.preview)
        }

        // Merge images: keep old ones (minus deleted) + add new ones
        let oldImages: string[] = JSON.parse(place.images)
        const deleteImages = placeData.deleteImages
        if (deleteImages && deleteImages.length > 0) {
            oldImages = oldImages.filter(img => !deleteImages.includes(img))
        }

        const newImageNames: string[] = []
        for (const img of placeData.images) {
            newImageNames.push(await this.uploadFile(img))
        }

        const allImages = [...oldImages, ...newImageNames]
        const preview = placeData.preview ? await this.uploadFile(placeData.preview) : place.preview

        await prisma.places.update({
            where: { id: placeData.id },
            data: {
                preview,
                name: placeData.name,
                otherInfo: placeData.otherInfo,
                mapCode: placeData.mapCode?.replace('https://yandex.ru/maps/?um=constructor%', ''),
                description: placeData.description,
                images: JSON.stringify(allImages)
            }
        })
    }

    async removePlace(id: number) {
        const place = await prisma.places.findUnique({ where: { id: id } })
        if (!place) throw ApiError.BadRequest('Запись не найдена')

        const images = JSON.parse(place.images) as string[]
        if (images && images.length > 0) {
            for (const file of images) {
                await this.deleteFile(file)
            }
        }
        if (place.preview) {
            await this.deleteFile(place.preview)
        }

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
        return { ...findedPlace, images: JSON.parse(findedPlace.images) }
    }
}
