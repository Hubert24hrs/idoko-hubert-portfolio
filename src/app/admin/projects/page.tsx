'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FolderKanban,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    Plus,
} from 'lucide-react';
import styles from '../admin.module.css';

interface Project {
    id: string;
    title: string;
    category: string;
    categoryLabel: string;
    featured: boolean;
    published: boolean;
    order: number;
}

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects?published=false');
            const data = await res.json();
            setProjects(data.projects || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

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
        <div className={styles.adminContainer}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>All Projects</h1>
                <Link href="/admin/projects/new" className="btn btn-primary">
                    <Plus size={18} style={{ marginRight: '0.5rem' }} />
                    Add New Project
                </Link>
            </div>

            <div className={styles.dataTable}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Featured</th>
                            <th>Order</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                                    Loading...
                                </td>
                            </tr>
                        ) : projects.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No projects found. <Link href="/admin/projects/new">Create one!</Link>
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr key={project.id}>
                                    <td><strong>{project.title}</strong></td>
                                    <td>{project.categoryLabel}</td>
                                    <td>
                                        <span className={`${styles.badge} ${project.published ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {project.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td>
                                        {project.featured ? (
                                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>Featured</span>
                                        ) : (
                                            <span className={styles.textMuted}>-</span>
                                        )}
                                    </td>
                                    <td>{project.order}</td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => toggleProjectPublished(project.id, project.published)}
                                                title={project.published ? 'Unpublish' : 'Publish'}
                                            >
                                                {project.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <Link href={`/admin/projects/${project.id}/edit`} className={styles.actionBtn} title="Edit">
                                                <Pencil size={16} />
                                            </Link>
                                            <button
                                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                onClick={() => deleteProject(project.id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
