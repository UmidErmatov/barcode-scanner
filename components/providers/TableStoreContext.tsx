"use client";
import { TableProps, TableStore, useTableStore } from "@/store/tableStore";
import { useRef } from "react";
import { createContext } from "react";

export const TableContext = createContext<TableStore | null>(null);

type TableProviderProps = React.PropsWithChildren<TableProps>;

export function TableStoreProvider({ children, ...props }: TableProviderProps) {
  const storeRef = useRef<TableStore>()
  if (!storeRef.current) {
    storeRef.current = useTableStore(props)
  } else {
    if (
      JSON.stringify(props.currentData) !==
      JSON.stringify(storeRef.current.getState().currentData)
    ) {
      storeRef.current.setState({
        currentData: props.currentData,
      });
    }
    if (
      JSON.stringify(props.excelData) !==
      JSON.stringify(storeRef.current.getState().excelData)
    ) {
      storeRef.current.setState({
        excelData: props.excelData,
      });
    }
  }
  return (
    <TableContext.Provider value={storeRef.current}>
      {children}
    </TableContext.Provider>
  )
}