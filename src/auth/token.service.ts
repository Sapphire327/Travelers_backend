import { prisma } from '@/db'
import jwt from 'jsonwebtoken'
import process from "node:process"
export class TokenService {
    generateTokens(payload:tokenPayload){
        const accessSecret = process.env.JWT_ACCESS_SECRET
        const refreshSecret = process.env.JWT_REFRESH_SECRET
        if (accessSecret && refreshSecret) {
            const accessToken = jwt.sign(payload, accessSecret, {expiresIn: '30m'});
            const refreshToken = jwt.sign(payload, refreshSecret, {expiresIn: '30d'});
            return {accessToken, refreshToken};
        }else{
            throw new Error('No secrets in env');
        }
    }
    async updateToken(userId:number,refreshTokenId:number,newRefreshToken:string){
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 30);
        await prisma.tokens.update({
            data: {
                refreshToken:newRefreshToken,
                usersId:userId,
                expDate:currentDate
            },
            where:{id:refreshTokenId}
            });

    }
    async saveToken(userId:number,refreshToken:string){
        await prisma.tokens.deleteMany({
            where: {
                expDate: { lt: new Date() },
                usersId:userId
            },
        });
        const tokenData = await prisma.tokens.findMany({where:{id:userId,refreshToken}})
        if(tokenData.length==0){
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 30);
            await prisma.tokens.create({data:{
                    refreshToken:refreshToken,
                    usersId:userId,
                    expDate:currentDate
                }})
        }
    }
    async removeToken(refreshToken:string){
        await prisma.tokens.deleteMany({where:{refreshToken:refreshToken}})
    }
    async findToken(refreshToken:string){
        return prisma.tokens.findFirst({where: {refreshToken: refreshToken}});
    }
    getJwtSecrets(){
        const accessSecret = process.env.JWT_ACCESS_SECRET
        const refreshSecret = process.env.JWT_REFRESH_SECRET
        if (accessSecret && refreshSecret) {
            return {accessSecret, refreshSecret};
        }else{
            throw new Error('No secrets in env');
        }
    }
    validateAccessToken(token:string){
        try{
            const {accessSecret} = this.getJwtSecrets()
            return jwt.verify(token, accessSecret)
        }catch (e){
            return null
        }
    }
    validateRefreshToken(token:string){
        try{
            const {refreshSecret} = this.getJwtSecrets()
            return jwt.verify(token, refreshSecret)
        }catch (e){
            return null
        }
    }
}