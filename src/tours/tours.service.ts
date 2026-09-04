import { prisma } from '@/db'
import ApiError from "@/exceptions/api-error"
import { tourCreate, tourEdit } from "@/tours/models/tours.dto"
export class ToursService {
    async createTour(tourData: tourCreate) {
        const place = await prisma.places.findUnique({ where: { id: tourData.placesId } })
        if (!place) { throw ApiError.BadRequest('Указанное место не найдено', ['Указанное место не найдено']) }
        await prisma.tours.create({
            data: {
                ...tourData
            }
        })
    }
    async editTour(tourData: tourEdit) {
        const tour = await prisma.tours.findUnique({ where: { id: tourData.id } })
        if (!tour) throw ApiError.BadRequest('Запись была удалена или перемещена')
        const place = await prisma.places.findUnique({ where: { id: tourData.placesId } })
        if (!place) { throw ApiError.BadRequest('Указанное место не найдено') }

        await prisma.tours.update({
            where: {
                id: tourData.id
            },
            data: {
                ...tourData,
            }
        })
    }
    async removeTour(id: number) {
        const tour = await prisma.tours.findUnique({ where: { id: id } })
        if (!tour) throw ApiError.BadRequest('Запись не найдена')
        await prisma.tours.delete({ where: { id: id } })
    }
    async getToursList() {
        return prisma.tours.findMany({
            select: {
                id: true,
                datesFrom: true,
                datesTo: true,
                place: {
                    select: {
                        name: true,
                    }
                },
                applications: {
                    select: {
                        id: true,
                        fio: true,
                        status: true,
                        phone: true,
                        comment: true
                    },
                    where: { status: 'APPROVED' }
                }
            },
        })
    }
    async getPublicToursList() {
        const tours = await prisma.tours.findMany({
            select: {
                id: true,
                datesFrom: true,
                datesTo: true,
                place: {
                    select: {
                        name: true,
                        preview: true,
                    }
                },
                maxPeople: true,
                _count: {
                    select: {
                        applications: {
                            where: {
                                status: "APPROVED"
                            }
                        }
                    }
                }
            },
        })
        return tours.map((tour) => ({
            id: tour.id,
            imgPath: tour.place.preview,
            name: tour.place.name,
            datesFrom: tour.datesFrom,
            datesTo: tour.datesTo,
            maxPeople: tour.maxPeople,
            currentPeople: tour._count.applications,
        }))
    }
    async getPublicToursById(id: number) {
        const tour = await prisma.tours.findUnique({
            where: { id: id },
            select: {
                id: true,
                datesFrom: true,
                datesTo: true,
                price: true,
                startPlace: true,
                maxPeople: true,
                place: {
                    select: {
                        id: true,
                        name: true,
                        preview: true,
                        images: true,
                        mapCode: true,
                        otherInfo: true,
                        description: true
                    }
                },
                _count: {
                    select: {
                        applications: true
                    }
                }
            },
        })
        if (!tour) throw ApiError.BadRequest('Запись не найдена')
        return { ...tour,
                 currentPeople: tour._count.applications,
                 place:{
                    ...tour.place,
                    images:JSON.parse(tour.place.images)
                }}
    }

    async getTourById(id: number) {
        const findedTour = await prisma.tours.findUnique({
            where: { id },
            select: {
                id: true,
                datesFrom: true,
                datesTo: true,
                maxPeople: true,
                startPlace: true,
                price: true,
                place: { select: { id: true, name: true } },
            }
        })
        if (!findedTour) throw ApiError.BadRequest('Запись не найдена')
        return findedTour
    }
}