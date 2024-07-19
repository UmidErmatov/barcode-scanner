import { db } from "@/lib/db";
import InitialTable from "../_components/InitialTable";
import ScanModal from "../_components/ScanModal";
import { currentUser } from "@/lib/serverAuth";
import { TableStoreProvider } from "@/components/providers/TableStoreContext";

export default async function MainPage() {
    const user = await currentUser()
    if (!user) {
        return <div>Avtorizatsiyadan o&apos;tmagan</div>;
    }
    const sourceData = await db.sourceData.findFirst({
        where: {
            OR: [
                {
                    uploaderId: user.id,
                },
                { users: { some: { id: user.id } } },
            ],
        },
        include: {
            users: {
                select: { id: true, fullname: true, email: true }
            }
        }
    })

    const scannedData = await db.scannedData.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" }
    })

    return (
        <TableStoreProvider
            excelData={sourceData}
            currentData={scannedData}
        >
            <div className="flex flex-col h-full">
                <div className="flex-grow overflow-auto">
                    <InitialTable />
                </div>
                <div className="flex-shrink-0 sm:hidden">
                    <ScanModal />
                </div>
            </div>
        </TableStoreProvider>
    )
}
