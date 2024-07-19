"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import LoginFormHeader from "./header";
import Socials from "./socials";
import BackButton from "./back-button";

type Props = {
    children: ReactNode,
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocials?: boolean;
}

function CardWrapper({ children, headerLabel, backButtonLabel, backButtonHref, showSocials }: Props) {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <LoginFormHeader label={headerLabel} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocials && (
                <CardFooter>
                    <Socials />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton
                    label={backButtonLabel}
                    href={backButtonHref}
                />
            </CardFooter>
        </Card>
    )
}

export default CardWrapper