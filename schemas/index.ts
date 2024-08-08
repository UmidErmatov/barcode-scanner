import * as z from "zod";

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Kamida 6 ta belgi kiritng!"
    }),
})
export const ResetSchema = z.object({
    email: z.string({
        invalid_type_error: "Noto'g'ri email!"
    }).email({ message: "Email kiritish majburiy" }),
})
export const LoginSchema = z.object({
    email: z.string({
        invalid_type_error: "Noto'g'ri email!"
    }).email({ message: "Email kiritish majburiy" }),
    password: z.string().min(1, {
        message: "Parol kiritish majburiy"
    }),
    code: z.optional(z.string().min(6, {
        message: "Kodni kiritish majburiy"
    })),
    // rememberMe: z.boolean(),
})
export const RegisterSchema = z.object({
    email: z.string({
        invalid_type_error: "Noto'g'ri email!"
    }).email({ message: "Email kiritish majburiy" }),
    password: z.string().min(6, {
        message: "Kamida 6 ta belgi kiritng!"
    }),
    fullname: z.string({
        message: "F.I.Sh kiritish majburiy!"
    }).min(1, {
        message: "F.I.Sh kiritish majburiy!"
    }),
    // rememberMe: z.boolean(),
})

export const BarcodeSchema = z.object({
    barcode: z.string().min(1, { message: "Barcode kiritish majburiy!" }),
    name: z.string().min(3, {
        message: "Kamida 3 ta belgi kiritng!"
    }),
    quantity: z.number({
        required_error: "Raqam kiritng",
        invalid_type_error: "Raqam kiritng"
    }).min(1, {
        message: "Miqdorni kiritish majburiy!"
    }),
    peace: z.number({
        required_error: "Raqam kiritng",
        invalid_type_error: "Raqam kiritng"
    }).nullable(),
    shelfLife: z.date({
        required_error: "Muddatni kiriting.",
    }),
    manufacturer: z.string().min(3, {
        message: "Kamida 3 ta belgi kiritng!"
    }),
    buyPrice: z.number({
        required_error: "Raqam kiritng",
        invalid_type_error: "Raqam kiritng"
    }).min(1, {
        message: "Tan narxini kiritish majburiy!"
    }),
})

export const UpdateBarcodeSchema = z.object({
    id: z.string().min(1, { message: "ID ni belgilang!" }),
    barcode: z.string().min(1, { message: "Barcode kiritish majburiy!" }),
    name: z.string().min(3, {
        message: "Kamida 3 ta belgi kiritng!"
    }),
    quantity: z.number({
        required_error: "Raqam kiritng",
        invalid_type_error: "Raqam kiritng"
    }).min(1, {
        message: "Miqdorni kiritish majburiy!"
    }),
    peace: z.number({
        required_error: "Raqam kiritng",
        invalid_type_error: "Raqam kiritng"
    }).nullable(),
    shelfLife: z.date({
        required_error: "Muddatni kiriting.",
    }),
    manufacturer: z.string().min(3, {
        message: "Kamida 3 ta belgi kiritng!"
    }),
    buyPrice: z.number({
        required_error: "Raqam kiritng",
        invalid_type_error: "Raqam kiritng"
    }).min(1, {
        message: "Tan narxini kiritish majburiy!"
    }),
}) 