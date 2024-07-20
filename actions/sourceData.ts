"use server"
import { db } from "@/lib/db";
import { currentUser } from "@/lib/serverAuth";
import { ExcelDataType } from "@/types/excelTypes";
import { revalidatePath } from "next/cache";

export const sourceDataAction = async (excelCredential: ExcelDataType) => {

    const user = await currentUser()

    if (!user) return { error: "Avtorizatsiyadan o'tmagan!" }

    const existingUser = await db.user.findUnique({
        where: { id: user.id }
    })

    if (!existingUser) return { error: "Foydalanuvchi topilmadi!" }

    const { excelData, excelColumns } = excelCredential

    const existingSourceData = await db.sourceData.findUnique({
        where: { uploaderId: existingUser.id }
    })

    if (existingSourceData) {
        await db.sourceData.delete({
            where: { uploaderId: existingUser.id }
        })
    }

    await db.sourceData.create({
        data: {
            uploaderId: existingUser.id,
            excelData,
            excelColumns
        },
    })

    revalidatePath("/", 'page')
    return { success: "Ma'lumot qo'shildi!" }
}