import { db } from "@/lib/db";
import InitialTable from "./_components/InitialTable";
import ScanModal from "./_components/ScanModal";
import { currentUser } from "@/lib/serverAuth";
import { TableStoreProvider } from "@/components/providers/TableStoreContext";

export default async function MainPage() {
    const user = await currentUser()
    if (!user) {
        return <div>Avtorizatsiyadan o&apos;tmagan</div>;
    }

    let sourceData = null;
    let employees = null;

    const myMourceData = await db.sourceData.findUnique({
        where: {
            uploaderId: user.id
        }
    })

    const userData = await db.user.findUnique({
        where: { id: user.id },
        include: {
            employees: true
        }
    })

    employees = userData && userData.employees

    const findRelatedUser = await db.user.findFirst({
        where: {
            employees: { some: { id: user.id } }
        },
        include: {
            employees: true
        }
    })
    if (findRelatedUser) {
        employees = null
        sourceData = await db.sourceData.findUnique({
            where: {
                uploaderId: findRelatedUser.id
            }
        })
    } else {
        sourceData = myMourceData
    }

    const scannedData = await db.scannedData.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" }
    })

    return (
        <TableStoreProvider
            excelData={sourceData}
            currentData={scannedData}
            employees={employees}
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
