"use client"

import { cn } from "@/lib/utils"
import { menuItems } from "@/utils/constants"
import { ScanBarcode } from "lucide-react"
import Link from "next/link"
import { menuItemIcons } from "./Sidebar"
import { usePathname } from "next/navigation"

type Props = {}

function MobileMenu({ }: Props) {
    const pathname = usePathname()
    return (
        <>
            <Link
                href="#"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
                <ScanBarcode className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">Acme Inc</span>
            </Link>
            {menuItems.map(item => {
                return (
                    <Link
                        href={item.link}
                        className={cn("flex items-center gap-4 px-2.5",
                            item.link === pathname ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {menuItemIcons[item.icon as keyof typeof menuItemIcons]}
                        <span className="sr-only">{item.title}</span>
                        {item.title}
                    </Link>
                )
            })}
        </>
    )
}

export default MobileMenu