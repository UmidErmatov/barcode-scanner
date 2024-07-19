"use client"

import { LoginButtonProps } from "@/types/loginTypes"
import { useRouter } from "next/navigation"

function LoginButton({ children, asChild, mode = "redirect" }: LoginButtonProps) {
    const router = useRouter()
    const handleClick = () => {
        router.push("/login")
    }

    if (mode === "modal") {
        return (
            <span>Modal mode</span>
        )
    }
    return (
        <span
            className="cursor-pointer"
            onClick={handleClick}
        >
            {children}
        </span>
    )
}

export default LoginButton