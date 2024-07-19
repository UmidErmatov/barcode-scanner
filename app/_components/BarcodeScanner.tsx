"use client"
import { useCommonStore } from '@/store/common';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import './codeScannerStyle.css'
import BarcodeDataForm from './BarcodeDataForm';
import { cn } from '@/lib/utils';
import { DefaultBarcodeData } from '@/types/excelTypes';
import { useTableContext } from '@/hooks/store-hooks/table-hook';

type Props = {}

function BarcodeScanner({ }: Props) {
    const defaultBarcodeData: DefaultBarcodeData = {
        barcode: "",
        name: "",
        quantity: 0,
        shelfLife: new Date(),
        manufacturer: "",
        buyPrice: 0,
    }
    const [qrResult, setQrResult] = useState<DefaultBarcodeData>(defaultBarcodeData)
    const [openScannerModal, setScanModalHeader] = useCommonStore(state => [state.openScannerModal, state.setScanModalHeader])
    const excelData = useTableContext(state => state.excelData)
    const tableData = excelData && excelData.excelData && typeof excelData.excelData === 'object' &&
        Array.isArray(excelData.excelData) ? excelData.excelData as any[] : []
    useEffect(() => {
        const scanConfig: Html5QrcodeCameraScanConfig = {
            fps: 10,
            qrbox: {
                width: 300,
                height: 50,
            },
            // disableFlip: true,
            // aspectRatio: 5
        }
        const html5QrCode = new Html5Qrcode("qrCodeContainer")

        const qrScannerStop = () => {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop()
                    .then(() => {
                        console.log("Scanner stopped");
                    })
                    .catch(() => {
                        console.log("Scanner error");
                    })
            }
        }

        const qrCodeSuccess = (result: string) => {

            const findProduct = tableData.find(excelProduct => excelProduct.Barcode.split(",").includes(result))

            qrScannerStop()
            setScanModalHeader("Ma'lumotlar")
            setQrResult(findProduct ? { barcode: findProduct.Barcode, name: findProduct.Nomi, quantity: findProduct.Miqdori, shelfLife: findProduct.Muddati as any, manufacturer: findProduct['Ishlab chiqaruvchi'], buyPrice: findProduct['Tan narxi'] } : { ...defaultBarcodeData, barcode: result })
        }

        if (openScannerModal) {
            html5QrCode.start({ facingMode: "environment" }, scanConfig, qrCodeSuccess, () => { })
            setQrResult(defaultBarcodeData)
        } else {
            qrScannerStop()
        }

        return () => {
            qrScannerStop()
        }
    }, [openScannerModal])

    return (
        <>
            <div id='qrCodeContainer' className={cn(qrResult.barcode ? 'hidden' : '')} />
            {qrResult.barcode && <BarcodeDataForm defaultBarcodeData={{ ...qrResult, id: "" }} />}
        </>
    )
}

export default BarcodeScanner