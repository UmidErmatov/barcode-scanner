import SourceTable from "@/app/(main-layout)/source/_components/SourceTable";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/serverAuth";

type Props = {}

async function SourcePage({ }: Props) {
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

    return (
        <div className="flex flex-col gap-8 items-center text-center justify-center">
            Soon...
            {/* <SourceTable excelData={sourceData} employees={employees} /> */}
        </div>
    )
}

export default SourcePage