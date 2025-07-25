import {PrismaClient} from "@/generated/prisma";
import bcrypt from 'bcrypt'
import ApiError from "@/exceptions/api-error";
import {TokenService} from "@/auth/token.service";
import process from "node:process";

export class AuthService {
    prisma = new PrismaClient();
    tokenService = new TokenService();
    async login(login:string,password:string) {
        const user = await this.prisma.users.findFirst({where:{login:login}})
        if(!user){
            throw ApiError.BadRequest('Неверный логин или пароль',[])
        }
        const isPassEqual = await bcrypt.compare(password,user.password)
        if(!isPassEqual){
            throw ApiError.BadRequest('Неверный логин или пароль',[])
        }
        const tokens = this.tokenService.generateTokens({login:user.login,isAdmin:user.isAdmin})
        await this.tokenService.saveToken(user.id,tokens.refreshToken)
        return {...tokens,login:user.login,isAdmin:user.isAdmin}
    }
    async logout(refreshToken:string) {
        const token = await this.tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken:string) {
      if(!refreshToken){
          throw ApiError.UnauthorizedError()
      }
      const userData = this.tokenService.validateRefreshToken(refreshToken)
      const tokenFromDb= await this.tokenService.findToken(refreshToken)
      if(!tokenFromDb||!userData){
          throw ApiError.UnauthorizedError()
      }
      const user = await this.prisma.users.findUnique({where:{id:tokenFromDb.usersId}})
        if(user) {
            const tokens = this.tokenService.generateTokens({login: user.login, isAdmin: user.isAdmin})
            await this.tokenService.updateToken(user.id, tokenFromDb.id,tokens.refreshToken)
            return {...tokens, login: user.login, isAdmin: user.isAdmin}
        }
        throw ApiError.UnauthorizedError()
    }
    async test() {
           return 'i have broken magic in my blood'
    }
    async createAdmin(){
        const findedAdmin = await this.prisma.users.findUnique({where:{login:'mainAdmin'}})
        const login = process.env.ADMIN_LOGIN
        const password = process.env.ADMIN_PASSWORD
        if(!login || !password){
            throw new Error('There is no ADMIN_LOGIN or ADMIN_PASSWORD in env')
        }
        if(findedAdmin==null){
            const hashedPassword = await bcrypt.hash(password,3)
            await this.prisma.users.create({data:{login:login,password:hashedPassword,isAdmin:true}})
        }
    }
}