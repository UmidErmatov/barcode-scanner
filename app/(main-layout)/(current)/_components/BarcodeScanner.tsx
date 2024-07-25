/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { useCommonStore } from '@/store/common';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useEffect, useRef, useState } from 'react';
import './codeScannerStyle.css'
import BarcodeDataForm from './BarcodeDataForm';
import { cn } from '@/lib/utils';
import { DefaultBarcodeData } from '@/types/excelTypes';
import { useTableContext } from '@/hooks/store-hooks/table-hook';
import { useToast } from "@/components/ui/use-toast"

type Props = {}

function BarcodeScanner({ }: Props) {
    const { toast } = useToast()
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const defaultBarcodeData: DefaultBarcodeData = {
        barcode: "",
        name: "",
        quantity: 0,
        peace: 0,
        shelfLife: new Date(),
        manufacturer: "",
        buyPrice: 0,
    }
    const [qrResult, setQrResult] = useState<DefaultBarcodeData>(defaultBarcodeData)
    const [openScannerModal, setScanModalHeader] = useCommonStore(state => [state.openScannerModal, state.setScanModalHeader])
    const excelData = useTableContext(state => state.excelData)

    const tableData = excelData && excelData.excelData && typeof excelData.excelData === 'object' &&
        Array.isArray(excelData.excelData) ? excelData.excelData as any[] : []

    // useEffect(() => {
    //     const scanConfig: Html5QrcodeCameraScanConfig = {
    //         fps: 100,
    //         qrbox: {
    //             width: 250,
    //             height: 50,
    //         },

    //         // disableFlip: true,
    //         // aspectRatio: 5
    //     }
    //     const html5QrCode = new Html5Qrcode("qrCodeContainer")

    //     const qrScannerStop = () => {
    //         if (html5QrCode && html5QrCode.isScanning) {
    //             html5QrCode.stop()
    //                 .then(() => {
    //                     console.log("Scanner stopped");
    //                 })
    //                 .catch(() => {
    //                     console.log("Scanner error");
    //                 })
    //         }
    //     }

    //     const qrCodeSuccess = (result: string) => {
    //         if (audioRef.current) {
    //             audioRef.current.currentTime = 0;
    //             audioRef.current.play();
    //         }

    //         const findProduct = tableData.find(excelProduct => excelProduct?.Barcode?.toString()?.split(",")?.map((code: string) => code.trim())?.includes(result))
    //         if (findProduct) {
    //             qrScannerStop()
    //             setScanModalHeader("Ma'lumotlar")
    //             setQrResult(findProduct ? { barcode: findProduct.Barcode.toString(), name: findProduct.Nomi, quantity: +findProduct.Miqdori, shelfLife: new Date(findProduct.Muddati), manufacturer: findProduct['Ishlab chiqaruvchi'], buyPrice: findProduct['Tan narxi'] } : { ...defaultBarcodeData, barcode: result })
    //         } else {
    //             toast({
    //                 title: "Qutiga tashlang!",
    //                 variant: 'destructive'
    //             })
    //             return
    //         }
    //     }

    //     if (openScannerModal) {
    //         html5QrCode.start({ facingMode: "environment" }, scanConfig, qrCodeSuccess, () => {
    //             // toast({
    //             //     title: "Skanerlab bo'lmayapti"
    //             // })
    //         })
    //         setQrResult(defaultBarcodeData)
    //     } else {
    //         qrScannerStop()
    //     }

    //     return () => {
    //         qrScannerStop()
    //     }
    // }, [openScannerModal])

    return (
        <div className='px-4'>
            <audio ref={audioRef} src="/scanner-beep.mp3" preload="auto" hidden />
            {/* <Scanner onScan={(result) => console.log(result)} formats={['aztec', 'codabar', 'code_128', 'code_39', 'data_matrix', 'databar', 'databar_expanded', 'dx_film_edge', 'ean_13', 'ean_8', 'qr_code', 'itf', 'linear_codes', 'matrix_codes', 'maxi_code', 'micro_qr_code', 'pdf417', 'rm_qr_code', 'unknown', 'upc_a', 'upc_e']} /> */}
            <div id='qrCodeContainer' className={cn(qrResult.barcode ? 'hidden' : '')} />
            {qrResult.barcode && <BarcodeDataForm defaultBarcodeData={{ ...qrResult, id: "" }} />}
        </div>
    )
}

export default BarcodeScanner