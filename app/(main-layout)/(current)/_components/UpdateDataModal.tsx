"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { useCommonStore } from "@/store/common"
import { useMediaQuery } from "@/hooks/use-media-query"
import BarcodeDataForm from "./BarcodeDataForm"

type Props = {
    // product: ScannedData | null
}

export function DrawerDialog({ }: Props) {

    const [openDialog, setOpenDialog, currentProduct] = useCommonStore(state => [state.openDialog, state.setOpenDialog, state.currentProduct])
    const isDesktop = useMediaQuery("(min-width: 768px)")
    // console.log("product: ", product);

    if (isDesktop) {
        return (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="mx-auto w-full h-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Tahrirlash</DrawerTitle>
                        </DrawerHeader>
                        {/* <div className="p-4 pb-0 h-full"> */}
                        {currentProduct ? <BarcodeDataForm defaultBarcodeData={currentProduct} /> : "Mahsulot mavjud emas!"}
                        {/* </div> */}
                        <DrawerFooter className="px-0">
                            <DrawerClose asChild>
                                <Button variant="outline">Bekor qilish</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={openDialog} onOpenChange={value => setOpenDialog(value)}>
            <DrawerContent>
                <div className="mx-auto w-full h-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Tahrirlash</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4">
                        {currentProduct ? <BarcodeDataForm defaultBarcodeData={currentProduct} /> : "Mahsulot mavjud emas!"}
                    </div>
                    <DrawerFooter className="px-4">
                        <DrawerClose asChild>
                            <Button variant="outline">Bekor qilish</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
