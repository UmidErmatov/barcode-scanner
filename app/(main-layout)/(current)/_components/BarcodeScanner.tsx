/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { useCommonStore } from '@/store/common';
// import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import './codeScannerStyle.css'
import BarcodeDataForm from './BarcodeDataForm';
import { DefaultBarcodeData } from '@/types/excelTypes';
import { useTableContext } from '@/hooks/store-hooks/table-hook';
import Lottie from 'lottie-react'
import Scanner from '@/public/scanner.json'
import { useToast } from '@/components/ui/use-toast';

function BarcodeScanner() {
    const { toast } = useToast()

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
    const [openScannerModal, setOpenScannerModal, setScanModalHeader, setOpenDialog, setCurrentProduct] = useCommonStore(state => [state.openScannerModal, state.setOpenScannerModal, state.setScanModalHeader, state.setOpenDialog, state.setCurrentProduct])
    const [excelData, currentData] = useTableContext(state => [state.excelData, state.currentData])

    const tableData = excelData && excelData.excelData && typeof excelData.excelData === 'object' &&
        Array.isArray(excelData.excelData) ? excelData.excelData as any[] : []

    useEffect(() => {
        var barcode = ''
        const handleKeyPress = (event: KeyboardEvent) => {
            if (openScannerModal) {
                if (isNaN(+event.key) && event.key !== 'Backspace') {
                    event.preventDefault();
                }
                if (event.key === 'Enter') {
                    event.preventDefault();

                    const findCurrentData = currentData.find(item => item?.barcode?.toString()?.split(",")?.map((code: string) => code.trim())?.includes(barcode))
                    if (findCurrentData) {
                        setCurrentProduct(findCurrentData)
                        setOpenDialog(true)
                        setOpenScannerModal(false)
                        window.removeEventListener('keydown', handleKeyPress);
                        barcode = ''
                        return
                    }

                    const findProduct = tableData.find(excelProduct => excelProduct?.Barcode?.toString()?.split(",")?.map((code: string) => code.trim())?.includes(barcode))
                    if (findProduct) {
                        setScanModalHeader("Ma'lumotlar")
                        setQrResult(findProduct ? { barcode: findProduct.Barcode.toString(), name: findProduct.Nomi, quantity: +findProduct.Miqdori, shelfLife: new Date(findProduct.Muddati), manufacturer: findProduct['Ishlab chiqaruvchi'], buyPrice: findProduct['Tan narxi'] } : { ...defaultBarcodeData, barcode: barcode })
                        window.removeEventListener('keydown', handleKeyPress);
                        barcode = ''
                        return;
                    }

                    if (tableData.length && currentData.length) {
                        toast({
                            title: "Qutiga tashlang!",
                            variant: 'destructive'
                        })
                        window.removeEventListener('keydown', handleKeyPress);
                        barcode = ''
                        return;
                    }

                    setQrResult({ ...qrResult, barcode })
                    window.removeEventListener('keydown', handleKeyPress);
                } else {
                    barcode = barcode + event.key
                }
            }
        };

        if (!qrResult.barcode) {
            window.addEventListener('keydown', handleKeyPress);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            barcode = ''
        };
    }, [openScannerModal]);


    // const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (event.key === 'Enter') {
    //         event.preventDefault();
    //         setBarcode('');
    //         // You can process the barcode data here
    //         const findCurrentData = currentData.find(item => item?.barcode?.toString()?.split(",")?.map((code: string) => code.trim())?.includes(barcode))

    //         if (findCurrentData) {
    //             setCurrentProduct(findCurrentData)
    //             setOpenDialog(true)
    //             setOpenScannerModal(false)
    //             return
    //         }

    //         const findProduct = tableData.find(excelProduct => excelProduct?.Barcode?.toString()?.split(",")?.map((code: string) => code.trim())?.includes(barcode))
    //         if (findProduct) {
    //             // qrScannerStop()
    //             setScanModalHeader("Ma'lumotlar")
    //             setQrResult(findProduct ? { barcode: findProduct.Barcode.toString(), name: findProduct.Nomi, quantity: +findProduct.Miqdori, shelfLife: new Date(findProduct.Muddati), manufacturer: findProduct['Ishlab chiqaruvchi'], buyPrice: findProduct['Tan narxi'] } : { ...defaultBarcodeData, barcode: barcode })
    //             return;
    //         }

    //         setQrResult({ ...qrResult, barcode })
    //         // setIsEnabled(false);
    //     }
    // };

    return (
        <>
            {!qrResult.barcode && (
                <Lottie animationData={Scanner} loop />
            )}
            {qrResult.barcode && <BarcodeDataForm defaultBarcodeData={{ ...qrResult, id: "" }} />}
        </>
    )
}

export default BarcodeScanner