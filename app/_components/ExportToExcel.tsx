"use client"
import { saveAs } from 'file-saver'
import { utils, write } from 'xlsx';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useTableContext } from '@/hooks/store-hooks/table-hook';
import { format } from 'date-fns';

type Props = {}

function ExportToExcel({ }: Props) {
    const user = useCurrentUser()
    const currentData = useTableContext(state => state.currentData)

    const exportToExcel = () => {
        const filename = "revision"
        const excelData = currentData.map(data => ({ Barcode: data.barcode, Nomi: data.name, Miqdori: data.quantity, Muddati: format(data.shelfLife, "dd.MM.yyyy"), "Ishlab chiqaruvchi": data.manufacturer, "Tan narxi": data.buyPrice }))

        const worksheet = utils.json_to_sheet(excelData);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `${filename}.xlsx`);
    };
    return (
        <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 text-sm"
            disabled={!currentData.length}
            onClick={exportToExcel}
        >
            <FileUp className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Import</span>
        </Button>
    )
}

export default ExportToExcel