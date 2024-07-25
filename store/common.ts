import { ScannedData } from '@prisma/client'
import { create } from 'zustand'

interface CommonState {
    currentProduct: ScannedData | null,
    openScannerModal: boolean,
    tabContent: string,
    scanModalHeader: string,
    openDialog: boolean,
    setCurrentProduct: (product: ScannedData | null) => void,
    setTabContent: (content: string) => void,
    setScanModalHeader: (headerName: string) => void,
    setOpenDialog: (value: boolean) => void,
    setOpenScannerModal: (value: boolean) => void,
}

export const useCommonStore = create<CommonState>()((set) => ({
    currentProduct: null,
    scanModalHeader: "",
    openDialog: false,
    openScannerModal: false,
    tabContent: "current",
    setCurrentProduct: (currentProduct: ScannedData | null) => set(() => ({ currentProduct })),
    setTabContent: (content) => set((state) => ({ tabContent: content })),
    setScanModalHeader: (headerName) => set(() => ({ scanModalHeader: headerName })),
    setOpenDialog: (value) => set((state) => ({ openDialog: value })),
    setOpenScannerModal: (value) => set((state) => ({ openScannerModal: value })),
}))