import {PrismaClient} from "@/generated/prisma";
import {
    applicationCreate,
    applicationEdit, applicationGetByTourDto,
    applicationPatchDto
} from "@/applications/models/applications.dto";
import fs from "fs";
import ApiError from "@/exceptions/api-error";

export class ApplicationsService {
    prisma = new PrismaClient();
    async createApplication(applicationData:applicationCreate){
        const tour = await this.prisma.tours.findUnique({where:{id:applicationData.toursId}})
        if(!tour){throw ApiError.BadRequest('Тур не найден',['Тур не найден'])}
        await this.prisma.applications.create({data:{
            ...applicationData
        }})
    }
    async editApplication(applicationData:applicationEdit){
        const application = await this.prisma.applications.findUnique({where:{id:applicationData.id}})
        if(!application) throw ApiError.BadRequest('Запись была удалена или перемещена')
        const tour = await this.prisma.tours.findUnique({where:{id:applicationData.toursId}})
        if(!tour){throw ApiError.BadRequest('Указанное место не найдено')}
        await this.prisma.applications.update({
            where:{
                id:applicationData.id
            },
            data:{
                ...applicationData,
            }})
    }
    async patchApplication(applicationData:applicationPatchDto){
        const application = await this.prisma.applications.findUnique({where:{id:applicationData.id}})
        if(!application) throw ApiError.BadRequest('Запись была удалена или перемещена')
        await this.prisma.applications.update({
            where:{
                id:applicationData.id
            },
            data:{
                toursId:applicationData.toursId,
                status:"APPROVED"
            }})
    }
    async removeApplication(id:number){
        const application = await this.prisma.applications.findUnique({where:{id:id}})
        if(!application) throw ApiError.BadRequest('Запись не найдена')
        await this.prisma.applications.delete({where:{id:id}})
    }
    async getApplicationsConsideringList(){
        return this.prisma.applications.findMany({
            select:{
                id:true,
                status:true,
                fio:true,
                phone:true,
                comment:true,
                toursId:true,
                createdAt:true,
            },
            where:{status:'CONSIDERING'},
            orderBy:[
                {
                    createdAt:'desc'
                }
            ]
        })
    }
    async getApprovedApplicationsListByTourId(tourId:number){
        return this.prisma.applications.findMany({
            select:{
                id:true,
                status:true,
                fio:true,
                phone:true,
                comment:true,
                toursId:true,
                createdAt:true,
            },
            where:{toursId:tourId,status:"APPROVED"}
        })
    }

}