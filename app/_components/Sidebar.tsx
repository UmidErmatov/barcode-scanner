"use client"
import Link from 'next/link'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Home,
    LineChart,
    Package,
    ScanBarcode,
    Settings,
    ShoppingCart,
    Users2,
} from "lucide-react"
import { usePathname } from 'next/navigation'
import { menuItems } from '@/utils/constants'
import { cn } from '@/lib/utils'

type Props = {}

export const menuItemIcons = {
    home: <Home className="h-5 w-5" />,
    shoppingCart: <ShoppingCart className="h-5 w-5" />,
    package: <Package className="h-5 w-5" />,
    users2: <Users2 className="h-5 w-5" />,
    lineChart: <LineChart className="h-5 w-5" />
}

function Sidebar({ }: Props) {
    const pathname = usePathname()

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
                <Link
                    href="#"
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                    <ScanBarcode className="h-4 w-4 transition-all group-hover:scale-110" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                {menuItems.map(item => {
                    return (
                        <Tooltip key={item.link}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={item.link}
                                    className={cn("flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                                        item.link === pathname ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {menuItemIcons[item.icon as keyof typeof menuItemIcons]}
                                    <span className="sr-only">{item.title}</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">{item.title}</TooltipContent>
                        </Tooltip>
                    )
                })}
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/settings"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
            </nav>
        </aside>
    )
}

export default Sidebar