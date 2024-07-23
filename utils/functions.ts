import { format, parseISO } from "date-fns";
import { commonDateFormat } from "./constants";

export function excelDateToJSDate(excelDate: number) {
    return new Date(Math.round((excelDate - 25569) * 86400 * 1000));
}

export function tableShelfLife(date: any) {
    if (typeof date === 'string') {
        return format(parseISO(date), commonDateFormat)
    }
}