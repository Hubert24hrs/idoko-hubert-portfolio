'use client';

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
    PenTool
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

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarLogo}>IH Admin</div>

            <nav className={styles.sidebarNav}>
                {sidebarLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`${styles.sidebarLink} ${pathname === link.href || pathname.startsWith(link.href + '/') ? styles.sidebarLinkActive : ''
                            }`}
                    >
                        <link.icon size={20} />
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className={styles.sidebarFooter}>
                <Link href="/" className={styles.sidebarLink}>
                    <Home size={20} />
                    View Site
                </Link>
                <button className={styles.sidebarLink} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
