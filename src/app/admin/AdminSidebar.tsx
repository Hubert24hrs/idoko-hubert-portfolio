'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FolderKanban,
    Award,
    Settings,
    LogOut,
    Home,
    MessageSquare,
    Mail,
    PenTool,
    Menu,
    X
} from 'lucide-react';
import styles from './admin.module.css';

const sidebarLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/posts', label: 'Blog', icon: PenTool },
    { href: '/admin/certifications', label: 'Certifications', icon: Award },
    { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
    { href: '/admin/messages', label: 'Messages', icon: Mail },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close sidebar on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                className={styles.mobileMenuBtn}
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
            >
                <Menu size={24} />
            </button>

            {/* Overlay backdrop */}
            {mobileOpen && (
                <div
                    className={styles.sidebarOverlay}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarLogo}>IH Admin</div>
                    <button
                        className={styles.mobileCloseBtn}
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close navigation menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className={styles.sidebarNav}>
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.sidebarLink} ${pathname === link.href || pathname.startsWith(link.href + '/') ? styles.sidebarLinkActive : ''
                                }`}
                        >
                            <link.icon size={20} />
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.sidebarLink}>
                        <Home size={20} />
                        <span>View Site</span>
                    </Link>
                    <button className={styles.sidebarLink} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
