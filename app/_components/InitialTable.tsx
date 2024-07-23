"use client"
import {
    FileDown,
    Pencil,
    Trash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ChangeEvent, useRef, useState, useTransition } from "react"
import * as XLSX from 'xlsx'
import { format, parseISO } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useCommonStore } from "@/store/common"
import { DrawerDialog } from "./UpdateDataModal"
import { useTableContext } from "@/hooks/store-hooks/table-hook"
import { deleteAllScannedDataAction, deleteScannedDataAction } from "@/actions/sannedData"
import { deleteSourceData, sourceDataAction } from "@/actions/sourceData"
import { SearchUser } from "./SearchUser"
import ExportToExcel from "./ExportToExcel"
import { useCurrentUser } from "@/hooks/use-current-user"
import { commonDateFormat } from "@/utils/constants"
import { ScannedData } from "@prisma/client"
import { excelDateToJSDate, tableShelfLife } from "@/utils/functions"
import { ConfirmDialog } from "@/components/Confirmation"

type Props = {
    // sourceData: SourceData | null,
    // scannedData: ScannedData[] | null,
}


function InitialTable({ }: Props) {
    const [isPending, startTransition] = useTransition()
    const [currentProduct, setCurrentProduct] = useState<ScannedData | null>(null)
    const [tabContent, setOpenDialog, setTabContent] = useCommonStore(state => [state.tabContent, state.setOpenDialog, state.setTabContent])
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [excelData, currentData, employees] = useTableContext(state => [state.excelData, state.currentData, state.employees])

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                const excelColumns: any = json[0]; // First row for column names
                const rows = json.slice(1); // Rest rows for data

                const excelData = rows.flatMap((row: any) => {
                    const rowData: any = {};
                    excelColumns.forEach((col: any, index: number) => {
                        rowData[col] = row[index];
                    });
                    if (Object.keys(rowData).length < 6) {
                        return []
                    } else
                        return { ...rowData, Muddati: excelDateToJSDate(rowData.Muddati) };
                });
                sourceDataAction({ excelColumns, excelData })
                // setExcelData({ excelColumns, excelData });
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const deleteCurrentProduct = (id: string) => {
        deleteScannedDataAction(id)
    }

    const updateCurrentProduct = (product: ScannedData) => {
        setCurrentProduct(product)
        setOpenDialog(true)
    }

    const tableData = excelData && excelData.excelData && typeof excelData.excelData === 'object' &&
        Array.isArray(excelData.excelData) ? excelData.excelData as any[] : []


    return (
        <Tabs defaultValue={tabContent} onValueChange={value => setTabContent(value)}>
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="source">Manba</TabsTrigger>
                    <TabsTrigger value="current">Joriy</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    {tabContent === "source" && employees && <SearchUser />}
                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                    />
                    {tabContent === "current" && <ExportToExcel />}
                    {tabContent === "source" && employees && <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-sm"
                        onClick={handleButtonClick}
                    >
                        <FileDown className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Import</span>
                    </Button>}
                </div>
            </div>
            <TabsContent value="source">
                <Card x-chunk="dashboard-05-chunk-3">
                    <CardHeader className="px-7">
                        <CardTitle className="flex justify-between">
                            <span className="flex items-center">
                                Mahsulotlar ro'yhati
                            </span>
                            {!!employees && <ConfirmDialog
                                saveText="Ha"
                                cancelText="Yo'q"
                                title="Manba o'chirilsinmi?"
                                onConfirm={() => {
                                    deleteSourceData()
                                }}
                                saveLoading={isPending}
                            >
                                <Button
                                    variant='destructive'
                                    size="icon"
                                    className="h-7 gap-1 text-sm"
                                    disabled={!excelData}
                                >
                                    <Trash className="h-4 w-4" />
                                    {/* <span className="sr-only sm:not-sr-only">O'chirish</span> */}
                                </Button>
                            </ConfirmDialog>}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table
                            className="w-full overflow-clip relative"
                            containerClassname="h-fit h-[calc(100vh-240px)] overflow-y-auto relative"
                        >
                            {excelData?.excelColumns.length ? <TableHeader className="sticky w-full top-0 dark:bg-slate-800 bg-slate-100">
                                <TableRow>
                                    {excelData.excelColumns?.map((header: string, index: number) => {
                                        return <TableHead key={index}>
                                            {header}
                                        </TableHead>
                                    })}
                                </TableRow>
                            </TableHeader> : <TableHeader className="sticky w-full top-0 dark:bg-slate-800 bg-slate-100">
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
                                        Muddati
                                    </TableHead>
                                    <TableHead>
                                        Ishlab chiqaruvchi
                                    </TableHead>
                                    <TableHead>
                                        Tan narxi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>}
                            <TableBody>
                                {tableData.length && excelData?.excelColumns.length ? <>{tableData.map((product, index) => (
                                    <TableRow key={product?.Barcode + index || index}>
                                        {excelData?.excelColumns.map((header: string) => {
                                            return (
                                                <TableCell key={header}>{header === "Muddati" ? product[header] ? tableShelfLife(product[header]) : "-" : product[header]}</TableCell>
                                            )
                                        })}

                                    </TableRow>
                                ))}</> : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center"
                                        >
                                            Excel fayl yuklang
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            {/* <TableFooter className="sticky w-full bottom-0 dark:bg-slate-800 bg-slate-100">
                                <TableRow>
                                    <TableCell colSpan={3}>Total</TableCell>
                                    <TableCell className="text-right">$2,500.00</TableCell>
                                </TableRow>
                            </TableFooter> */}
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="current">
                <Card x-chunk="dashboard-05-chunk-3" >
                    <CardHeader className="px-7">
                        <CardTitle className="flex justify-between">
                            <span className="flex items-center">
                                Kiritilgan mahsulotlar ro'yhati
                            </span>
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
                                            <DrawerDialog product={currentProduct} />
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
                                            colSpan={7}
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
            </TabsContent>
        </Tabs>
    )
}

export default InitialTable