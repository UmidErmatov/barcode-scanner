"use server"

import { getUserByEmail } from "@/data/user"
import { getVerificationTokenByToken } from "@/data/verification-token"
import { db } from "@/lib/db"

export const newVerificationAction = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token)

    if (!existingToken) {
        return { error: "Token mavjud emas!" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) {
        return { error: "Tokenning muddati tugagan!" }
    }

    const existingUser = await getUserByEmail(existingToken.email)
    if (!existingUser) return { error: "Email topilmadi!" }

    await db.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: new Date(), email: existingToken.email }
    })

    await db.verificationToken.delete({ where: { id: existingToken.id } })

    return { success: "Emailingiz tasdiqlandi!" }
}