"use server"
import { getUserByEmail } from "@/data/user"
import { sendResetPasswordEmail } from "@/lib/mails"
import { generatePasswordResetToken } from "@/lib/tokens"
import { ResetSchema } from "@/schemas"
import * as z from "zod"

export const resetAction = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Noto'g'ri email!" }
    }

    const { email } = validatedFields.data
    const existingUser = await getUserByEmail(email)
    if (!existingUser) return { error: "Email topilmadi!" }

    const resetToken = await generatePasswordResetToken(email)
    await sendResetPasswordEmail(resetToken.email, resetToken.token)
    return { success: "Emailga jo'natildi!" }
}