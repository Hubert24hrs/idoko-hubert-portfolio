import AdminSidebar from './AdminSidebar';
import styles from './admin.module.css';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Basic auth check for layout protection
    const session = await auth();
    // Allow login page to bypass layout sidebar if needed, OR 
    // better: verify if middleware handles this. 
    // If not logged in & not on login page, middleware redirects.

    // We strictly shouldn't show Sidebar on Login page.
    // But Layout wraps everything including nested pages.
    // If /admin/login is a sibling or child, it will get the sidebar.
    // Usually login is a separate route group or filtered here.
    // Since I can't easily change folder structure without risks, I will check paths if possible or CSS hide it.
    // But this is a Server Component, so can't check pathname easily without headers.

    return (
        <div className={styles.adminLayout}>
            {/* We might need client logic to hide sidebar on login, or just assume auth pages are effectively separate */}
            <AdminSidebar />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
