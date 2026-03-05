'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { PremiumToggle } from './PremiumToggle';
import styles from './Header.module.css';

const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
];

export default function Header() {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Check for saved theme, default to 'dark' if none found
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const initialTheme = savedTheme || 'dark';

        setTheme(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
        setMounted(true);
    }, []);

    const handleToggleChange = (isDark: boolean) => {
        const newTheme = isDark ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <header className={styles.header} role="banner">
            <div className={styles.headerContainer}>
                <Link href="/" className={styles.logo} aria-label="Idoko Hubert - Home">
                    IH<span style={{ opacity: 0.7 }}>.dev</span>
                </Link>

                <nav className={styles.nav} role="navigation" aria-label="Main navigation">
                    <ul className={styles.navLinks}>
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} className={styles.navLink}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {mounted && (
                        <div className={styles.toggleWrapper}>
                            <PremiumToggle
                                defaultChecked={theme === 'dark'}
                                onChange={handleToggleChange}
                            />
                        </div>
                    )}

                    <button
                        className={styles.mobileMenuBtn}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <nav className={styles.mobileNav} role="navigation" aria-label="Mobile navigation">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={styles.navLink}
                            onClick={closeMobileMenu}
                        >
                            {item.label}
                        </Link>
                    ))}
                    {mounted && (
                        <div className={styles.mobileToggleWrapper}>
                            <PremiumToggle
                                defaultChecked={theme === 'dark'}
                                onChange={handleToggleChange}
                            />
                        </div>
                    )}
                </nav>
            )}
        </header>
    );
}
