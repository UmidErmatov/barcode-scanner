import { TableContext } from "@/components/providers/TableStoreContext";
import { TableState } from "@/store/tableStore";
import { useContext } from "react";
import { useStore } from "zustand";

export function useTableContext<T>(selector: (state: TableState) => T): T {
    const store = useContext(TableContext);
    if (!store) throw new Error("Missing TableContext.Provider in the tree");
    return useStore(store, selector);
}
