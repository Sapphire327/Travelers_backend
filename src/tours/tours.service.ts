import {PrismaClient} from "@/generated/prisma";
import {tourCreate, tourEdit} from "@/tours/models/tours.dto";
import fs from "fs";
import ApiError from "@/exceptions/api-error";

export class ToursService {
    prisma = new PrismaClient();
    async createTour(tourData:tourCreate){
        const place = await this.prisma.places.findUnique({where:{id:tourData.placesId}})
        if(!place){throw ApiError.BadRequest('Указанное место не найдено',['Указанное место не найдено'])}
        await this.prisma.tours.create({data:{
            ...tourData
        }})
    }
    async editTour(tourData:tourEdit){
        const tour = await this.prisma.tours.findUnique({where:{id:tourData.id}})
        if(!tour) throw ApiError.BadRequest('Запись была удалена или перемещена')
        const place = await this.prisma.places.findUnique({where:{id:tourData.placesId}})
        if(!place){throw ApiError.BadRequest('Указанное место не найдено')}

        await this.prisma.tours.update({
            where:{
                id:tourData.id
            },
            data:{
                ...tourData,
            }})
    }
    async removeTour(id:number){
        const tour = await this.prisma.tours.findUnique({where:{id:id}})
        if(!tour) throw ApiError.BadRequest('Запись не найдена')
        await this.prisma.tours.delete({where:{id:id}})
    }
    async getToursList(){
        return this.prisma.tours.findMany({
            select:{
                id:true,
                datesFrom:true,
                datesTo:true,
                place:{
                    select:{
                        name:true,
                    }
                },
                applications:{
                    select:{
                        id:true,
                        fio:true,
                        status:true,
                        phone:true,
                        comment:true
                    },
                    where:{status:'APPROVED'}
                }
            },
        })
    }
    async getPublicToursList(){
        const tours = await this.prisma.tours.findMany({
            select:{
                id:true,
                datesFrom:true,
                datesTo:true,
                place:{
                    select:{
                        name:true,
                        preview:true,
                    }
                },
                maxPeople:true,
                _count:{
                    select:{
                        applications:true
                    }
                }
            },


        })
        return tours.map((tour)=>({
            id: tour.id,
            imgPath: tour.place.preview,
            name: tour.place.name,
            datesFrom: tour.datesFrom,
            datesTo: tour.datesTo,
            maxPeople: tour.maxPeople,
            currentPeople:tour._count.applications,
        }))
    }
    async getPublicToursById(id:number){
        const tour = await this.prisma.tours.findUnique({
            where:{id:id},
            select:{
                id:true,
                datesFrom:true,
                datesTo:true,
                price:true,
                startPlace:true,
                maxPeople:true,
                place:{
                    select:{
                        id:true,
                        name:true,
                        preview:true,
                        images:true,
                        mapCode:true,
                        otherInfo:true,
                        description:true
                    }
                },
                _count:{
                    select:{
                        applications:true
                    }
                }
            },
        })
        if(!tour)throw ApiError.BadRequest('Запись не найдена')
        return {...tour,currentPeople:tour._count.applications}
    }

    async getTourById(id:number){
        const findedTour =  await this.prisma.tours.findUnique({
            where:{id},
            select:{
                id:true,
                datesFrom:true,
                datesTo:true,
                maxPeople:true,
                startPlace:true,
                price:true,
                place:{select:{id:true,name:true}},
            }
        })
        if(!findedTour)throw ApiError.BadRequest('Запись не найдена')
        return findedTour;
    }
}