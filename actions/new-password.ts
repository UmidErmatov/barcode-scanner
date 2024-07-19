"use server"
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs"
import { db } from "@/lib/db";

export const newPasswordAction = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null) => {
    if (!token) return { error: "Token topilmadi!" };

    const validatedFields = NewPasswordSchema.safeParse(values)
    if (!validatedFields.success) return { error: "Noto'g'ri ma'lumotlar!" };

    const { password } = validatedFields.data
    const existingToken = await getPasswordResetTokenByToken(token)

    if (!existingToken) return { error: "Noto'g'ri token!" };

    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) return { error: "Token eskirgan!" };

    const existingUser = await getUserByEmail(existingToken.email)
    if (!existingUser) return { error: "Email topilmadi!" }

    const hashedPassword = await bcrypt.hash(password, 10)
    await db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
    })
    await db.passwordResetToken.delete({ where: { id: existingToken.id } })

    return { success: "Parol tiklandi!" };
}