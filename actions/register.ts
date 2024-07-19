"use server";
import { RegisterSchema } from '@/schemas';
import * as z from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db';
import { getUserByEmail } from '../data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mails';


export const registerAction = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Noto'g'ri ma'lumotlar!" }
    }
    const { fullname, email, password } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return { error: "Bu email bo'yicha foydalanuvchi bor!" }
    }

    await db.user.create({
        data: {
            fullname,
            email,
            password: hashedPassword,
        }
    })

    const verificationToken = await generateVerificationToken(email)
    console.log("verificationToken: ", verificationToken);

    await sendVerificationEmail(verificationToken.email, verificationToken.token)
    return { success: "Tasdiqlov email manzilga jo'natildi!" }
}