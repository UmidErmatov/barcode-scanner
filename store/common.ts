import { create } from 'zustand'

interface CommonState {
    openScannerModal: boolean,
    tabContent: string,
    scanModalHeader: string,
    openDialog: boolean
    setTabContent: (content: string) => void,
    setScanModalHeader: (headerName: string) => void,
    setOpenDialog: (value: boolean) => void,
    setOpenScannerModal: (value: boolean) => void,
}

export const useCommonStore = create<CommonState>()((set) => ({
    scanModalHeader: "",
    openDialog: false,
    openScannerModal: false,
    tabContent: "current",
    setTabContent: (content) => set((state) => ({ tabContent: content })),
    setScanModalHeader: (headerName) => set(() => ({ scanModalHeader: headerName })),
    setOpenDialog: (value) => set((state) => ({ openDialog: value })),
    setOpenScannerModal: (value) => set((state) => ({ openScannerModal: value })),
}))