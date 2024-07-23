"use server"
import { db } from "@/lib/db"
import { currentUser } from "@/lib/serverAuth"
import { revalidatePath } from "next/cache"


export const searchUserAction = async (text: string) => {
    const user = await currentUser()
    if (!user) return { error: "Avtorizatsiyadan o'tmagan!" }
    const existingUser = await db.user.findUnique({
        where: { id: user.id }
    })
    if (!existingUser) return { error: "Foydalanuvchi topilmadi!" }

    try {
        const data = await db.user.findMany({
            where: {
                OR: [
                    { fullname: { contains: text } },
                    { email: { contains: text } },
                ],
                NOT: {
                    id: existingUser.id
                }
            },
            select: { id: true, fullname: true, email: true },
        })

        return data
    } catch (error) {
        // throw new Error(error as any)
        console.log("search users error: ", error)
        return { error: "Serverda xatolik" }
    }
}

export const addUserToSourceAction = async (userId: string) => {
    const user = await currentUser()
    if (!user) return { error: "Avtorizatsiyadan o'tmagan!" }
    const existingUser = await db.user.findUnique({
        where: { id: user.id }
    })
    if (!existingUser) return { error: "Foydalanuvchi topilmadi!" }

    await db.user.update({
        where: { id: existingUser.id },
        data: {
            employees: {
                connect: {
                    id: userId,
                }
            }
        }
    })
    revalidatePath("/", "page")
}

export const removeUserFromSourceAction = async (userId: string) => {
    const user = await currentUser()
    if (!user) return { error: "Avtorizatsiyadan o'tmagan!" }
    const existingUser = await db.user.findUnique({
        where: { id: user.id }
    })
    if (!existingUser) return { error: "Foydalanuvchi topilmadi!" }

    await db.user.update({
        where: { id: existingUser.id },
        data: {
            employees: {
                disconnect: {
                    id: userId,
                }
            }
        }
    })

    revalidatePath("/", "page")
}