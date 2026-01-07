'use client';

import { useState, FormEvent, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Lock, Mail } from 'lucide-react';
import styles from './login.module.css';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const callbackUrl = searchParams.get('callbackUrl') || '/admin';

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <div className={styles.loginLogo}>IH Admin</div>
                    <h1 className={styles.loginTitle}>Welcome Back</h1>
                    <p className={styles.loginSubtitle}>Sign in to manage your portfolio</p>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>
                            <Mail size={14} style={{ display: 'inline', marginRight: 6 }} />
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.formInput}
                            placeholder="admin@idokohubert.dev"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>
                            <Lock size={14} style={{ display: 'inline', marginRight: 6 }} />
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.formInput}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.loginBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : (
                            <>
                                <LogIn size={18} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.demoCredentials}>
                    <strong>Demo Credentials:</strong>
                    Email: <code>admin@idokohubert.dev</code><br />
                    Password: <code>admin123</code>
                </div>

                <Link href="/" className={styles.backLink}>
                    ← Back to Portfolio
                </Link>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={
            <div className={styles.loginPage}>
                <div className={styles.loginCard}>
                    <div className={styles.loginHeader}>
                        <div className={styles.loginLogo}>IH Admin</div>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
