import { BarcodeSchema } from '@/schemas';
import * as z from 'zod'
export interface Obj { [key: string]: any }
export interface ExcelRowData extends Obj {
    Barcode: string;
    Nomi: string;
    Miqdori: number;
    Muddati: string;
    "Ishlab chiqaruvchi": string;
    "Tan narxi": number;
}

export interface ExcelDataType {
    excelColumns: string[], excelData: ExcelRowData[]
}

export type DefaultBarcodeData = z.infer<typeof BarcodeSchema>
