import { ReactNode } from "react"
import Sidebar from "../_components/Sidebar"
import Navbar from "../_components/Navbar"

type Props = {
    children: ReactNode
}

function MainPageLayout({ children }: Props) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            {/* aside */}
            <Sidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 h-screen">
                {/* navbar */}
                <Navbar />
                {/* main */}
                <main className="flex-1 items-start gap-4 p-2 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default MainPageLayout