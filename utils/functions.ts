export function excelDateToJSDate(excelDate: number) {
    return new Date(Math.round((excelDate - 25569) * 86400 * 1000));
}

