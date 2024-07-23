import { BarcodeSchema } from '@/schemas'
import { createStore } from 'zustand'
import * as z from 'zod'
import { ScannedData, SourceData, User } from '@prisma/client'


export interface TableProps {
    excelData: SourceData | null,
    currentData: ScannedData[],
    employees: User[] | null,
}
export interface TableState extends TableProps {
    setExcelData: (data: SourceData) => void,
    setCurrentData: (data: ScannedData[]) => void,
    setEmployees: (employees: User[]) => void,
}
export type TableStore = ReturnType<typeof useTableStore>

export type CurrentData = z.infer<typeof BarcodeSchema>

// export const useTableStore = create<TableState>()((set) => ({
//     excelData: { excelColumns: [], excelData: [] },
//     currentData: [],
//     setExcelData: (data) => set(() => ({ excelData: data })),
//     setCurrentData: (data) => set(() => ({ currentData: data })),
// }))

export const useTableStore = (initProps?: Partial<TableProps>) => {
    const DEFAULT_PROPS: TableProps = {
        excelData: { id: "", uploaderId: "", excelColumns: [], excelData: [], updatedAt: new Date(), createdAt: new Date() },
        currentData: [],
        employees: [],
    }
    return createStore<TableState>()((set) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setExcelData: (data) => set(() => ({ excelData: data })),
        setCurrentData: (data) => set(() => ({ currentData: data })),
        setEmployees: (employees) => set(() => ({ employees })),
    }))
}
