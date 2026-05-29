import {
    applicationCreate,
    applicationEdit,
    applicationPatchDto
} from "@/applications/models/applications.dto"
import { prisma } from '@/db'
import ApiError from "@/exceptions/api-error"

export class ApplicationsService {
    async createApplication(applicationData: applicationCreate) {
        const tour = await prisma.tours.findUnique({ where: { id: applicationData.toursId } })
        if (!tour) { throw ApiError.BadRequest('Тур не найден', ['Тур не найден']) }
        await prisma.applications.create({
            data: {
                ...applicationData
            }
        })
    }
    async editApplication(applicationData: applicationEdit) {
        const application = await prisma.applications.findUnique({ where: { id: applicationData.id } })
        if (!application) throw ApiError.BadRequest('Запись была удалена или перемещена')
        const tour = await prisma.tours.findUnique({ where: { id: applicationData.toursId } })
        if (!tour) { throw ApiError.BadRequest('Указанное место не найдено') }
        await prisma.applications.update({
            where: {
                id: applicationData.id
            },
            data: {
                ...applicationData,
            }
        })
    }
    async patchApplication(applicationData: applicationPatchDto) {
        const application = await prisma.applications.findUnique({ where: { id: applicationData.id } })
        if (!application) throw ApiError.BadRequest('Запись была удалена или перемещена')
        await prisma.applications.update({
            where: {
                id: applicationData.id
            },
            data: {
                toursId: applicationData.toursId,
                status: "APPROVED"
            }
        })
    }
    async removeApplication(id: number) {
        const application = await prisma.applications.findUnique({ where: { id: id } })
        if (!application) throw ApiError.BadRequest('Запись не найдена')
        await prisma.applications.delete({ where: { id: id } })
    }
    async getApplicationsConsideringList() {
        return prisma.applications.findMany({
            select: {
                id: true,
                status: true,
                fio: true,
                phone: true,
                comment: true,
                toursId: true,
                createdAt: true,
            },
            where: { status: 'CONSIDERING' },
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ]
        })
    }
    async getApprovedApplicationsListByTourId(tourId: number) {
        return prisma.applications.findMany({
            select: {
                id: true,
                status: true,
                fio: true,
                phone: true,
                comment: true,
                toursId: true,
                createdAt: true,
            },
            where: { toursId: tourId, status: "APPROVED" }
        })
    }

}