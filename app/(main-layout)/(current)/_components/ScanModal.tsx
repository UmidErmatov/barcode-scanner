"use client"

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
import { FilePen, Scan, ScanBarcode } from "lucide-react"
import BarcodeScanner from "./BarcodeScanner"
import { useCommonStore } from "@/store/common"
import { useState } from "react"
import { DialogDescription } from "@/components/ui/dialog"

type Props = {}

function ScanModal({ }: Props) {
    const [isManual, setIsManual] = useState(false)
    const [openScannerModal, setOpenScannerModal, scanModalHeader, setScanModalHeader, tabContent] = useCommonStore(state => [state.openScannerModal, state.setOpenScannerModal, state.scanModalHeader, state.setScanModalHeader, state.tabContent])

    return (tabContent === "current" &&
        <Drawer open={openScannerModal} onOpenChange={(value) => {
            setScanModalHeader("Skanerlang")
            setOpenScannerModal(value)
        }}>
            <DrawerTrigger asChild>
                <Button className="w-full"> <ScanBarcode className="mr-2 h-4 w-4" />Skanerlash</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full h-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>{scanModalHeader}</DrawerTitle>
                    </DrawerHeader>
                    {isManual ? <div>Qidirish</div> : <BarcodeScanner />}
                    <DrawerFooter>
                        {/* <Button onClick={() => {
                            setScanModalHeader(!isManual ? "Qidirish" : "Skanerlanmoqda...")
                            setIsManual(!isManual)
                        }}>
                            {isManual ? <><ScanBarcode className="mr-2 h-4 w-4" /> Skanerlash</> : <><FilePen className='h-4 w-4 mr-2' /> Qo'lda kiritish</>}
                        </Button> */}
                        <DrawerClose asChild>
                            <Button
                                onClick={() => {
                                    if (isManual)
                                        setIsManual(false)
                                }}
                                variant="outline">
                                Bekor qilish
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default ScanModal