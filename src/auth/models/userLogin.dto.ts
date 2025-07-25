import {z} from "zod";

export const userLoginDTO = z.object({
    login: z.string().min(6),
    password: z.string().min(6)
})