"use client"
import * as XLSX from 'xlsx'
import { deleteSourceData, sourceDataAction } from "@/actions/sourceData"
import { ConfirmDialog } from "@/components/Confirmation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { excelDateToJSDate, tableShelfLife } from "@/utils/functions"
import { SourceData, User } from "@prisma/client"
import { FileDown, Trash } from "lucide-react"
import { ChangeEvent, useRef, useState, useTransition } from "react"
import { SearchUser } from '../../(current)/_components/SearchUser'

type Props = {
    excelData: SourceData | null,
    employees: User[] | null,
}

function SourceTable({ excelData, employees }: Props) {
    const [tableCondition, setTableCondition] = useState<"Yuklanmoqda..." | "Excel file yuklang." | string>('Excel file yuklang.')
    const [isPending, startTransition] = useTransition()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const tableData = excelData && excelData.excelData && typeof excelData.excelData === 'object' &&
        Array.isArray(excelData.excelData) ? excelData.excelData as any[] : []


    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setTableCondition('Yuklanmoqda...')
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });
                const excelColumns: any = json[0]; // First row for column names
                const rows = json.slice(1); // Rest rows for data

                const excelData = rows.map((row: any) => {
                    const rowData: any = {};
                    excelColumns.forEach((col: any, index: number) => {
                        rowData[col] = row[index];
                    });
                    return { ...rowData, Muddati: excelDateToJSDate(rowData.Muddati) };

                });

                sourceDataAction({ excelColumns, excelData })
                // setExcelData({ excelColumns, excelData });
            };
            reader.readAsArrayBuffer(file);
            // setTableCondition('Excel file yuklang.')
        }
    };

    return (
        <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
                <CardTitle className="flex justify-between items-center">
                    <span className="sm:flex items-center hidden">
                        Mahsulotlar ro'yhati
                    </span>
                    {employees && <SearchUser />}
                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                    />
                    {employees && <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-sm"
                        onClick={handleButtonClick}
                    >
                        <FileDown className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Import</span>
                    </Button>}
                    {!!employees && <ConfirmDialog
                        saveText="Ha"
                        cancelText="Yo'q"
                        title="Manba o'chirilsinmi?"
                        onConfirm={() => {
                            startTransition(() => {
                                deleteSourceData().then(() => setTableCondition('Excel file yuklang.')).catch((error) => setTableCondition(error))
                            })
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
                            <TableHead>
                                N#
                            </TableHead>
                            {excelData.excelColumns?.map((header: string, index: number) => {
                                return <TableHead key={index}>
                                    {header}
                                </TableHead>
                            })}
                        </TableRow>
                    </TableHeader> : <TableHeader className="sticky w-full top-0 dark:bg-slate-800 bg-slate-100">
                        <TableRow>
                            <TableHead>
                                N#
                            </TableHead>
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
                                <TableCell >{index + 1}</TableCell>
                                {excelData?.excelColumns.map((header: string) => {
                                    return (
                                        <TableCell key={header}>{header === "Muddati" ? product[header] ? tableShelfLife(product[header]) : "-" : product[header]}</TableCell>
                                    )
                                })}

                            </TableRow>
                        ))}</> : (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center"
                                >
                                    {tableCondition}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

    )
}

export default SourceTable