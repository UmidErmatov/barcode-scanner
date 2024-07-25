"use client"

import { deleteAllScannedDataAction, deleteScannedDataAction } from "@/actions/sannedData"
import { DrawerDialog } from "@/app/(main-layout)/(current)/_components/UpdateDataModal"
import { ConfirmDialog } from "@/components/Confirmation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCommonStore } from "@/store/common"
import { commonDateFormat } from "@/utils/constants"
import { ScannedData } from "@prisma/client"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Pencil, Trash } from "lucide-react"
import { useState, useTransition } from "react"
import ExportToExcel from "./ExportToExcel"

type Props = {
    currentData: ScannedData[]
}

function CurrentTable({ currentData }: Props) {
    const [isPending, startTransition] = useTransition()
    const setCurrentProduct = useCommonStore(state => state.setCurrentProduct)
    const setOpenDialog = useCommonStore(state => state.setOpenDialog)

    const deleteCurrentProduct = (id: string) => {
        deleteScannedDataAction(id)
    }

    const updateCurrentProduct = (product: ScannedData) => {
        setCurrentProduct(product)
        setOpenDialog(true)
    }

    return (
        <Card x-chunk="dashboard-05-chunk-3" >
            <CardHeader className="px-7">
                <CardTitle className="flex justify-between">
                    <span className="flex items-center">
                        Kiritilgan mahsulotlar ro'yhati
                    </span>
                    <ExportToExcel />
                    <ConfirmDialog
                        saveText="Ha"
                        cancelText="Yo'q"
                        title="Mahsulotlar ro'yhati o'chirilsinmi?"
                        onConfirm={() => {
                            startTransition(() => {
                                deleteAllScannedDataAction()
                            })
                        }}
                        saveLoading={isPending}
                    >
                        <Button
                            variant='destructive'
                            size="icon"
                            className="h-7 gap-1 text-sm"
                            disabled={!currentData.length}
                        >
                            <Trash className="h-4 w-4" />
                            {/* <span className="sr-only sm:not-sr-only">O'chirish</span> */}
                        </Button>
                    </ConfirmDialog>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table
                    className="w-full overflow-clip relative"
                    containerClassname="h-fit h-[calc(100vh-240px)] overflow-y-auto relative"
                >
                    <TableHeader className="sticky w-full top-0 dark:bg-slate-800 bg-slate-100">
                        <TableRow>
                            <TableHead>
                                Barcode
                            </TableHead>
                            <TableHead>
                                Nomi
                            </TableHead>
                            <TableHead>
                                Miqdori
                            </TableHead>
                            <TableHead>
                                Dona
                            </TableHead>
                            <TableHead>
                                Muddati
                            </TableHead>
                            <TableHead>
                                Ishlab chiqaruvchi
                            </TableHead>
                            <TableHead>
                                Tan narxi
                            </TableHead>
                            <TableHead>
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData.length ? <>{currentData.map((product, index) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.barcode}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>{product.peace ? product.peace : 0}</TableCell>
                                <TableCell>{format(product.shelfLife, commonDateFormat)}</TableCell>
                                <TableCell>{product.manufacturer}</TableCell>
                                <TableCell>{product.buyPrice}</TableCell>
                                <TableCell>
                                    <DrawerDialog />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <DotsHorizontalIcon className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => updateCurrentProduct(product)}
                                            >
                                                Tahrirlash
                                                <DropdownMenuShortcut>
                                                    <Pencil className="h-4 w-4" />
                                                </DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => deleteCurrentProduct(product.id)}
                                            >
                                                O'chirish
                                                <DropdownMenuShortcut className="text-destructive">
                                                    <Trash className="h-4 w-4" />
                                                </DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                </TableCell>
                            </TableRow>
                        ))}</> : (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="h-24 text-center"
                                >
                                    Skanerlang
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default CurrentTable