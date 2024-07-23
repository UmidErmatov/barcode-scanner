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

    // const existingRelatedSourceData = await db.sourceData.findFirst({
    //     where: {
    //         users: { some: { id: existingUser.id } }
    //     }
    // })

    // if (existingRelatedSourceData) {
    //     await db.sourceData.update({
    //         where: { id: existingRelatedSourceData.id },
    //         data: {
    //             users: {
    //                 disconnect: {
    //                     id: existingUser.id
    //                 }
    //             }
    //         }
    //     })
    // }

    try {
        await db.sourceData.create({
            data: {
                uploaderId: existingUser.id,
                excelData,
                excelColumns
            },
        })
    } catch (error) {
        console.log("save data error: ", error);
    }

    revalidatePath("/", 'page')
    return { success: "Ma'lumot qo'shildi!" }
}


export const deleteSourceData = async () => {
    const user = await currentUser()

    if (!user) return { error: "Avtorizatsiyadan o'tmagan!" }

    const existingUser = await db.user.findUnique({
        where: { id: user.id }
    })

    if (!existingUser) return { error: "Foydalanuvchi topilmadi!" }

    await db.sourceData.delete({
        where: { uploaderId: existingUser.id }
    })

    revalidatePath("/", 'page')
    return { success: "Manba o'chirildi!" }
}