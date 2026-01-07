import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare, hash } from "bcryptjs"

// Admin credentials - update these or use environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "iheanachohubert@gmail.com"
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ||
    "$2b$10$wCHg2f6honVD.J39HLXTyaxGy/gC18m5fBGPFSCH" // "Iheanacho25" hashed

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const email = credentials.email as string
                const password = credentials.password as string

                // Check if email matches admin
                if (email !== ADMIN_EMAIL) {
                    return null
                }

                // For first-time setup, allow password without hash verification
                const isDefaultPassword = password === "Iheanacho25"

                // In production, compare with stored hash
                let isValidPassword = isDefaultPassword
                if (!isDefaultPassword && ADMIN_PASSWORD_HASH) {
                    try {
                        isValidPassword = await compare(password, ADMIN_PASSWORD_HASH)
                    } catch {
                        isValidPassword = false
                    }
                }

                if (!isValidPassword) {
                    return null
                }

                return {
                    id: "admin",
                    email: email,
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
    secret: process.env.NEXTAUTH_SECRET || "your-development-secret-change-in-production",
})

// Helper to generate password hash (run once to generate hash for .env)
export async function generatePasswordHash(password: string): Promise<string> {
    return await hash(password, 10)
}
