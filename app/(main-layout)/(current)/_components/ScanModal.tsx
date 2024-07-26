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
import { ScanBarcode } from "lucide-react"
import BarcodeScanner from "./BarcodeScanner"
import { useCommonStore } from "@/store/common"
import { useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

type Props = {}

function ScanModal({ }: Props) {

    const [isManual, setIsManual] = useState(false)
    const [openScannerModal, setOpenScannerModal, scanModalHeader, setScanModalHeader, tabContent] = useCommonStore(state => [state.openScannerModal, state.setOpenScannerModal, state.scanModalHeader, state.setScanModalHeader, state.tabContent])

    return (tabContent === "current" &&
        <>
            <Drawer
                open={openScannerModal}
                onOpenChange={(value) => {
                    setScanModalHeader("Skanerlang")
                    setOpenScannerModal(value)
                }}>
                <DrawerTrigger asChild>
                    <Button className="w-full"> <ScanBarcode className="mr-2 h-4 w-4" />Skanerlash</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full h-full max-w-sm mb-4">
                        <DrawerHeader>
                            <DrawerTitle>{scanModalHeader}</DrawerTitle>
                        </DrawerHeader>
                        <div className="px-4">
                            {isManual ? <div>Qidirish</div> : <BarcodeScanner />}
                        </div>
                        {/* <DrawerFooter>
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
                        </DrawerFooter> */}
                    </div>
                </DrawerContent>
            </Drawer>

            {/* <Sheet
                open={openScannerModal}
                onOpenChange={(value) => {
                    setScanModalHeader("Skanerlang")
                    setOpenScannerModal(value)
                }}
            >
                <SheetTrigger asChild>
                    <Button className="w-full" size={'sm'}> <ScanBarcode className="mr-2 h-4 w-4" />Skanerlash</Button>
                </SheetTrigger>
                <ScrollArea className='overflow-x-auto'>
                    <SheetContent side='top'>
                        <div className="mx-auto w-full h-full max-w-sm">
                            <SheetHeader>
                                <SheetTitle>{scanModalHeader}</SheetTitle>
                            </SheetHeader>
                            {isManual ? <div>Qidirish</div> : <BarcodeScanner />}
                        </div>
                    </SheetContent>
                </ScrollArea>
            </Sheet> */}
        </>
    )
}

export default ScanModal