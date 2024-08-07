/* eslint-disable @next/next/no-before-interactive-script-outside-document */
"use client"

import { ITelegramUser, IWebApp } from "@/types/telegramTypes";
import Script from "next/script";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface ITelegramContext {
    webApp?: IWebApp;
    user?: ITelegramUser;
}

export const TelegramContext = createContext<ITelegramContext>({});

export const TelegramProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [webApp, setWebApp] = useState<IWebApp | null>(null);

    useEffect(() => {
        const app = (window as any).Telegram?.WebApp;
        console.log("app: ", app);

        if (app) {
            app.ready();
            setWebApp(app);
        }
    }, []);

    const value = useMemo(() => {
        return webApp
            ? {
                webApp,
                unsafeData: webApp.initDataUnsafe,
                user: webApp.initDataUnsafe.user,
            }
            : {};
    }, [webApp]);

    return (
        <TelegramContext.Provider value={value}>
            {/* Make sure to include script tag with "beforeInteractive" strategy to pre-load web-app script */}
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy='beforeInteractive'
            />      {children}
        </TelegramContext.Provider>
    );
};

export const useTelegram = () => useContext(TelegramContext);