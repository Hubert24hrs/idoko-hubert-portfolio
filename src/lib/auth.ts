import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

// Admin credentials come from the environment, never from source control.
// ADMIN_PASSWORD_HASH is a bcrypt hash: generate one with `npm run hash-password`.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
                    console.error("Admin login is disabled: set ADMIN_EMAIL and ADMIN_PASSWORD_HASH.")
                    return null
                }

                const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : ""
                const password = typeof credentials?.password === "string" ? credentials.password : ""

                if (!email || !password) {
                    return null
                }

                // Compare the password even when the email is wrong, so both failures take the same time
                const isValidPassword = await compare(password, ADMIN_PASSWORD_HASH).catch(() => false)

                if (email !== ADMIN_EMAIL || !isValidPassword) {
                    return null
                }

                return {
                    id: "admin",
                    email: ADMIN_EMAIL,
                    name: "Idoko Hubert",
                    role: "admin"
                }
            }
        })
    ],
    pages: {
        signIn: "/admin/login",
        error: "/admin/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role as string
            }
            return session
        },
        async authorized({ auth, request }) {
            const isLoggedIn = !!auth?.user
            const isOnAdmin = request.nextUrl.pathname.startsWith('/admin')
            const isOnLogin = request.nextUrl.pathname === '/admin/login'

            if (isOnAdmin && !isOnLogin) {
                return isLoggedIn
            }

            return true
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },
    // No fallback value: a known secret would let anyone forge an admin session
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
})
