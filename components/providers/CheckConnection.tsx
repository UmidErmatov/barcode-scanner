"use client"

import useNetworkStatus from "@/hooks/use-network-status";
import { ReactNode } from "react"

type Props = {
    children: ReactNode
}
function CheckConnection({ children }: Props) {
    const { isOnline } = useNetworkStatus();

    if (!isOnline) {
        return (
            <div className=" h-screen flex justify-center items-center">You are offline!</div>
        )
    } else {
        return <>{children}</>
    }
}

export default CheckConnection