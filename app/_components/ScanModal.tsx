"use client"
import * as React from "react"
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons"
// import dynamic from 'next/dynamic'
// const BarcodeScanner = dynamic(() => {
//     import('react-barcode-scanner/polyfill')
//     return import('react-barcode-scanner').then(mod => mod.BarcodeScanner)
// }, { ssr: false })

// import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { ScanBarcode } from "lucide-react"
import BarcodeScanner from "./BarcodeScanner"
import { useCommonStore } from "@/store/common"


type Props = {}

function ScanModal({ }: Props) {
    const [openScannerModal, setOpenScannerModal, scanModalHeader, setScanModalHeader, tabContent] = useCommonStore(state => [state.openScannerModal, state.setOpenScannerModal, state.scanModalHeader, state.setScanModalHeader, state.tabContent])

    return (tabContent === "current" &&
        <Drawer open={openScannerModal} onOpenChange={(value) => {
            setScanModalHeader("Skanerlanmoqda...")
            setOpenScannerModal(value)
        }}>
            <DrawerTrigger asChild>
                <Button className="w-full"> <ScanBarcode className="mr-2 h-4 w-4" />Scan</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full h-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>{scanModalHeader}</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pb-0 h-full">
                        <BarcodeScanner />
                    </div>
                    <DrawerFooter>
                        {/* <Button>Submit</Button> */}
                        <DrawerClose asChild>
                            <Button variant="outline">Bekor qilish</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default ScanModal