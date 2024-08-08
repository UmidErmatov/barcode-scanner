import { DefaultBarcodeData } from '@/types/excelTypes'
import { ScannedData } from '@prisma/client'
import { create } from 'zustand'


export const defaultBarcodeData: DefaultBarcodeData = {
    barcode: "",
    name: "",
    quantity: 0,
    peace: 0,
    shelfLife: new Date(),
    manufacturer: "",
    buyPrice: 0,
}

interface CommonState {
    qrResult: DefaultBarcodeData,
    currentProduct: ScannedData | null,
    openScannerModal: boolean,
    tabContent: string,
    scanModalHeader: string,
    openDialog: boolean,
    setQrResult: (qrResult: DefaultBarcodeData) => void,
    setCurrentProduct: (product: ScannedData | null) => void,
    setTabContent: (content: string) => void,
    setScanModalHeader: (headerName: string) => void,
    setOpenDialog: (value: boolean) => void,
    setOpenScannerModal: (value: boolean) => void,
}

export const useCommonStore = create<CommonState>()((set) => ({
    qrResult: defaultBarcodeData,
    currentProduct: null,
    scanModalHeader: "",
    openDialog: false,
    openScannerModal: false,
    tabContent: "current",
    setQrResult: (qrResult) => set(() => ({ qrResult })),
    setCurrentProduct: (currentProduct: ScannedData | null) => set(() => ({ currentProduct })),
    setTabContent: (content) => set(() => ({ tabContent: content })),
    setScanModalHeader: (headerName) => set(() => ({ scanModalHeader: headerName })),
    setOpenDialog: (value) => set(() => ({ openDialog: value })),
    setOpenScannerModal: (value) => set(() => ({ openScannerModal: value })),
}))