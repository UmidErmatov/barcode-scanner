"use server"
import { db } from "@/lib/db";
import { currentUser } from "@/lib/serverAuth";
import { BarcodeSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from 'zod'

export const createScannedDataAction = async (values: z.infer<typeof BarcodeSchema>) => {
    const validatedFields = BarcodeSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Noto'g'ri ma'lumotlar!" }
    }

    const user = await currentUser()

    if (!user) return { error: "Avtorizatsiyadan o'tmagan!" }

    const existingUser = await db.user.findUnique({
        where: { id: user.id }
    })

    if (!existingUser) return { error: "Foydalanuvchi topilmadi!" }

    const { barcode, name, quantity, shelfLife, buyPrice, manufacturer } = validatedFields.data

    await db.scannedData.create({
        data: {
            barcode,
            name,
            shelfLife,
            quantity,
            manufacturer,
            buyPrice,
            user: {
                connect: {
                    id: existingUser.id,
                }
            }
        },
    })

    revalidatePath("/", 'page')
    return { success: "Ma'lumot qo'shildi!" }
}

export const updateScannedDataAction = async (values: z.infer<typeof BarcodeSchema>, scanDataId: string) => {
    const validatedFields = BarcodeSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Noto'g'ri ma'lumotlar!" }
    }

    const user = await currentUser()
    if (!user) return { error: "Avtorizatsiyadan o'tmagan!" }

    const existingUser = await db.user.findUnique({
        where: { id: user.id }
    })

    if (!existingUser) return { error: "Foydalanuvchi topilmadi!" }

    const { name, quantity, shelfLife, buyPrice, manufacturer } = validatedFields.data

    await db.scannedData.update({
        where: { id: scanDataId },
        data: {
            name,
            shelfLife,
            quantity,
            manufacturer,
            buyPrice
        },
    })
    revalidatePath("/", 'page')
    return { success: "Ma'lumot tahrirlandi!" }
}

export const deleteScannedDataAction = async (scanDataId: string) => {

    const user = await currentUser()
    if (!user) return { error: "Avtorizatsiyadan o'tmagan!" }

    const existingUser = await db.user.findUnique({
        where: { id: user.id }
    })

    if (!existingUser) return { error: "Foydalanuvchi topilmadi!" }

    await db.scannedData.delete({
        where: { id: scanDataId }
    })
    revalidatePath("/", 'page')
    return { success: "Ma'lumot o'chirildi!" }
}
export const deleteAllScannedDataAction = async () => {

    const user = await currentUser()
    if (!user) return { error: "Avtorizatsiyadan o'tmagan!" }

    const existingUser = await db.user.findUnique({
        where: { id: user.id }
    })

    if (!existingUser) return { error: "Foydalanuvchi topilmadi!" }

    await db.scannedData.deleteMany({
        where: {
            user: {
                id: existingUser.id
            }
        }
    })
    revalidatePath("/", 'page')
    return { success: "Ro'yhat o'chirildi!" }
}