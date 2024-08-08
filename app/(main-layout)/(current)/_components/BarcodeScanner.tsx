/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { defaultBarcodeData, useCommonStore } from '@/store/common';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import './codeScannerStyle.css'
import BarcodeDataForm from './BarcodeDataForm';
import { DefaultBarcodeData } from '@/types/excelTypes';
import { useTableContext } from '@/hooks/store-hooks/table-hook';
// import Lottie from 'lottie-react'
// import Scanner from '@/public/scanner.json'
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

function BarcodeScanner() {
    const { toast } = useToast()
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // const [qrResult, setQrResult] = useState<DefaultBarcodeData>(defaultBarcodeData)
    const [openScannerModal, qrResult, setQrResult, setOpenScannerModal, setScanModalHeader, setOpenDialog, setCurrentProduct] = useCommonStore(state => [state.openScannerModal, state.qrResult, state.setQrResult, state.setOpenScannerModal, state.setScanModalHeader, state.setOpenDialog, state.setCurrentProduct])
    const [excelData, currentData] = useTableContext(state => [state.excelData, state.currentData])

    const tableData = excelData && excelData.excelData && typeof excelData.excelData === 'object' &&
        Array.isArray(excelData.excelData) ? excelData.excelData as any[] : []

    useEffect(() => {
        var barcode = ''
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

            if (!qrResult.barcode) {

                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play();
                }
                const findCurrentData = currentData.find(item => item?.barcode?.toString()?.split(",")?.map((code: string) => code.trim())?.includes(result))
                if (findCurrentData) {
                    qrScannerStop()
                    setCurrentProduct(findCurrentData)
                    setOpenDialog(true)
                    setOpenScannerModal(false)
                    return
                }

                const findProduct = tableData.find(excelProduct => excelProduct?.Barcode?.toString()?.split(",")?.map((code: string) => code.trim())?.includes(result))
                if (findProduct) {
                    setQrResult(findProduct ? { barcode: findProduct.Barcode.toString(), name: findProduct.Nomi, quantity: +findProduct.Miqdori, shelfLife: new Date(findProduct.Muddati), manufacturer: findProduct['Ishlab chiqaruvchi'], buyPrice: findProduct['Tan narxi'], peace: findProduct.Dona || 0 } : { ...defaultBarcodeData, barcode: result })
                    qrScannerStop()
                    return;
                }

                if (tableData.length && currentData.length) {
                    toast({
                        title: "Qutiga tashlang!",
                        variant: 'destructive'
                    })
                    qrScannerStop()
                    return;
                }

                qrScannerStop()
                setScanModalHeader("Ma'lumotlar")
                setQrResult(findProduct ? { barcode: findProduct.Barcode.toString(), name: findProduct.Nomi, quantity: +findProduct.Miqdori, shelfLife: new Date(findProduct.Muddati), manufacturer: findProduct['Ishlab chiqaruvchi'], buyPrice: findProduct['Tan narxi'], peace: findProduct.Dona || 0 } : { ...defaultBarcodeData, barcode: result })
            }
        }

        if (openScannerModal) {
            html5QrCode.start({ facingMode: "environment" }, scanConfig, qrCodeSuccess, () => { })
            setQrResult(defaultBarcodeData)
        } else {
            qrScannerStop()
        }

        const handleKeyPress = (event: KeyboardEvent) => {
            if (openScannerModal && !qrResult.barcode) {
                if (isNaN(+event.key) && event.key !== 'Backspace') {
                    event.preventDefault();
                }
                if (event.key === 'Enter') {
                    event.preventDefault();
                    setScanModalHeader("Ma'lumotlar")

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
                        setQrResult(findProduct ? { barcode: findProduct.Barcode.toString(), name: findProduct.Nomi, quantity: +findProduct.Miqdori, shelfLife: new Date(findProduct.Muddati), manufacturer: findProduct['Ishlab chiqaruvchi'], buyPrice: findProduct['Tan narxi'], peace: findProduct.Dona || 0 } : { ...defaultBarcodeData, barcode: barcode })
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
            qrScannerStop()
            barcode = ''
        };
    }, [openScannerModal]);

    return (
        <>
            {/* {!qrResult.barcode && (
                <Lottie animationData={Scanner} loop /> */}
            <audio ref={audioRef} src="/scanner-beep.mp3" preload="auto" hidden />
            <div id='qrCodeContainer' className={cn(qrResult.barcode ? 'hidden' : '')} />
            {/* )} */}
            {qrResult.barcode && <BarcodeDataForm defaultBarcodeData={{ ...qrResult, id: "" }} />}
        </>
    )
}

export default BarcodeScanner