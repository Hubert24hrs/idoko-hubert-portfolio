'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FolderKanban,
    Award,
    Settings,
    LogOut,
    Home,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    MessageSquare,
    Mail
} from 'lucide-react';
import styles from './admin.module.css';

interface Project {
    id: string;
    title: string;
    category: string;
    categoryLabel: string;
    featured: boolean;
    published: boolean;
}

interface Certification {
    id: string;
    title: string;
    issuer: string;
    published: boolean;
}

const sidebarLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/certifications', label: 'Certifications', icon: Award },
    { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
    { href: '/admin/messages', label: 'Messages', icon: Mail },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
    const pathname = usePathname();
    const [projects, setProjects] = useState<Project[]>([]);
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [projectsRes, certsRes] = await Promise.all([
                    fetch('/api/projects?published=false'),
                    fetch('/api/certifications?published=false'),
                ]);

                const projectsData = await projectsRes.json();
                const certsData = await certsRes.json();

                setProjects(projectsData.projects || []);
                setCertifications(certsData.certifications || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const stats = [
        {
            label: 'Total Projects',
            value: projects.length,
            icon: FolderKanban,
            iconClass: 'statIconBlue'
        },
        {
            label: 'Published',
            value: projects.filter(p => p.published).length,
            icon: Eye,
            iconClass: 'statIconGreen'
        },
        {
            label: 'Featured',
            value: projects.filter(p => p.featured).length,
            icon: Award,
            iconClass: 'statIconPurple'
        },
        {
            label: 'Certifications',
            value: certifications.length,
            icon: Award,
            iconClass: 'statIconOrange'
        },
    ];

    const toggleProjectPublished = async (id: string, currentState: boolean) => {
        try {
            await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, published: !currentState }),
            });
            setProjects(projects.map(p =>
                p.id === id ? { ...p, published: !currentState } : p
            ));
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const deleteProject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    return (
        <div className={styles.adminLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLogo}>IH Admin</div>

                <nav className={styles.sidebarNav}>
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.sidebarLink} ${pathname === link.href ? styles.sidebarLinkActive : ''
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

            {/* Main Content */}
            <main className={styles.mainContent}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <Link href="/admin/projects/new" className="btn btn-primary">
                        Add Project
                    </Link>
                </div>

                {/* Stats */}
                <div className={styles.statsGrid}>
                    {stats.map((stat) => (
                        <div key={stat.label} className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles[stat.iconClass]}`}>
                                <stat.icon size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <div className={styles.statValue}>{loading ? '...' : stat.value}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Projects Table */}
                <div className={styles.dataTable}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>Recent Projects</h2>
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No projects yet. <Link href="/admin/projects/new">Add one!</Link>
                                    </td>
                                </tr>
                            ) : (
                                projects.slice(0, 5).map((project) => (
                                    <tr key={project.id}>
                                        <td><strong>{project.title}</strong></td>
                                        <td>{project.categoryLabel}</td>
                                        <td>
                                            <span className={`${styles.badge} ${project.published ? styles.badgeSuccess : styles.badgeWarning}`}>
                                                {project.published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td>
                                            {project.featured && (
                                                <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                                                    Featured
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => toggleProjectPublished(project.id, project.published)}
                                                title={project.published ? 'Unpublish' : 'Publish'}
                                            >
                                                {project.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button className={styles.actionBtn} title="Edit">
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                onClick={() => deleteProject(project.id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
