"use client"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useCommonStore } from "@/store/common"
import { useTableContext } from "@/hooks/store-hooks/table-hook"
import SourceTable from "../../source/_components/SourceTable"
import CurrentTable from "./CurrentTable"
import ScanModal from "./ScanModal"

type Props = {
    // sourceData: SourceData | null,
    // scannedData: ScannedData[] | null,
}


function InitialTable({ }: Props) {
    const [tabContent, setTabContent] = useCommonStore(state => [state.tabContent, state.setTabContent])
    const [excelData, currentData, employees] = useTableContext(state => [state.excelData, state.currentData, state.employees])

    return (
        <Tabs defaultValue={tabContent} onValueChange={value => setTabContent(value)}>
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="source">Manba</TabsTrigger>
                    <TabsTrigger value="current">Joriy</TabsTrigger>
                </TabsList>
                {/* <div className="ml-auto flex items-center gap-2">
                    <ScanModal />
                </div> */}
            </div>
            <TabsContent value="source">
                <SourceTable excelData={excelData} employees={employees} />
            </TabsContent>
            <TabsContent value="current">
                <CurrentTable currentData={currentData} />
            </TabsContent>
        </Tabs>
    )
}

export default InitialTable