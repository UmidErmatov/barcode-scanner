"use server";
import { signIn } from '@/auth';
import { getUserByEmail } from '@/data/user';
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail, sendTwoFactorEmail } from '@/lib/mails';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import * as z from 'zod'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { db } from '@/lib/db';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Noto'g'ri ma'lumotlar!" }
    }

    const { email, password, code } = validatedFields.data
    const existingUser = await getUserByEmail(email)
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Bunday email mavjud emas!" }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return { success: "Tasdiqlov email manzilga jo'natildi!" }
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
            if (!twoFactorToken) return { error: "Noto'g'ri kod" }
            if (twoFactorToken.token !== code) return { error: "Noto'g'ri kod" }

            const hasExpired = new Date(twoFactorToken.expires) < new Date()
            if (hasExpired) return { error: "Kod eskirgan" }
            await db.twoFactorToken.delete({
                where: { id: twoFactorToken.id }
            })
            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id }
                })
            }

            await db.twoFactorConfirmation.create({
                data: { userId: existingUser.id }
            })
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token)
            return { twoFactor: true }
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/"
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: error.cause?.err?.cause || "Noto'g'ri ma'lumotlar!" }
                default:
                    return { error: error.cause?.err?.message || "Xatolik ro'y berdi!" }
            }
        }
        throw error
    }
}