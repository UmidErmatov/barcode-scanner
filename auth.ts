import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { db } from "./lib/db"
import { getUserByEmail, getUserById } from "./data/user"
import { LoginSchema } from "./schemas"
import { DEFAULT_LOGIN_REDIRECT, authRoutes, apiAuthPrefix, publicRoutes } from './routes'
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
import { getAccountByUserId } from "./data/account"

declare module "next-auth" {
    interface Session {
        user: {
            role: UserRole,
            fullname: string | null,
            isTwoFactorEnabled: boolean,
            isOAuth: boolean,
        } & DefaultSession["user"]
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        role: UserRole,
        fullname: string | null,
        isTwoFactorEnabled: boolean,
        isOAuth: boolean,
    }
}


export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
        Google({
            // clientId: process.env.GOOGLE_CLIENT_ID,
            // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
            profile(profile) {
                return {
                    id: profile.id,
                    fullname: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    emailVerified: profile.email_verified || null,
                    role: UserRole.USER // Default role for new users
                }
            }
        }),
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // credentials: {
            //     email: { label: "Email", type: "email", required: true },
            //     password: { label: "Password", type: "password", required: true },
            // },
            authorize: async (credentials) => {
                const validatedFields = LoginSchema.safeParse(credentials)
                if (validatedFields.success) {
                    const { email, password } = validatedFields.data
                    const user = await getUserByEmail(email)
                    if (!user || !user.password) throw new CredentialsSignin("Noto'g'ri email yoki parol!");

                    const passwordsMatch = await bcrypt.compare(password, user.password)
                    if (!passwordsMatch) throw new CredentialsSignin("Parol noto'g'ri")
                    return user
                }

                return null
            },
        }),
    ],
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date(),
                },
            })
        }
    },
    callbacks: {
        authorized({ auth, request }) {
            const isLoggedIn = !!auth?.user;
            const { nextUrl } = request

            const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
            const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
            const isAuthRoute = authRoutes.includes(nextUrl.pathname)

            if (isApiAuthRoute) return true

            if (isAuthRoute) {
                if (isLoggedIn) {
                    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
                }
                return true
            }

            if (!isLoggedIn && !isPublicRoute) {
                let callbackUrl = nextUrl.pathname
                if (nextUrl.search) {
                    callbackUrl += nextUrl.search
                }

                const encodedCallbackUrl = encodeURIComponent(callbackUrl)
                return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
            }

            return true
        },
        async signIn({ user, account }) {

            if (account?.provider !== "credentials") return true
            if (user && user.id) {
                const existingUser = await getUserById(user.id)
                if (!existingUser || !existingUser.emailVerified) return false

                if (existingUser.isTwoFactorEnabled) {
                    const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(user.id)
                    if (!twoFactorConfirmation) return false
                    await db.twoFactorConfirmation.delete({
                        where: { id: twoFactorConfirmation.id }
                    })
                }
            }
            return true
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role
            }
            if (token.fullname && session.user) {
                session.user.fullname = token.fullname
            }
            if (session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled
                session.user.fullname = token.fullname
                session.user.email = token.email as string
                session.user.isOAuth = token.isOAuth
            }
            return session
        },
        async jwt({ token, user }) {
            if (!token.sub) return token

            const existingUser = await getUserById(token.sub)
            if (!existingUser) return token

            const existingAccount = await getAccountByUserId(existingUser.id)

            token.isOAuth = !!existingAccount
            token.email = existingUser.email
            token.role = existingUser.role
            token.fullname = existingUser.fullname
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
            return token
        }
    },
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
        error: "/auth-error"
    }
})