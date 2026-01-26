'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import styles from '../admin.module.css';

interface Testimonial {
    id: string;
    content: string;
    author: string;
    role: string;
    company: string;
    published: boolean;
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('/api/testimonials?published=false');
            const data = await res.json();
            setTestimonials(data.testimonials || []);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePublished = async (id: string, currentState: boolean) => {
        try {
            await fetch('/api/testimonials', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, published: !currentState }),
            });
            fetchTestimonials();
        } catch (error) {
            console.error('Error updating testimonial:', error);
        }
    };

    const deleteTestimonial = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;
        try {
            await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
            fetchTestimonials();
        } catch (error) {
            console.error('Error deleting testimonial:', error);
        }
    };

    return (
        <div className={styles.adminLayout}>
            <main className={styles.mainContent}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Testimonials</h1>
                    <Link href="/admin/testimonials/new" className="btn btn-primary">
                        <Plus size={18} />
                        Add Testimonial
                    </Link>
                </div>

                <div className={styles.dataTable}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Author</th>
                                <th>Role/Company</th>
                                <th>Excerpt</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        <Loader2 className={styles.spinning} />
                                    </td>
                                </tr>
                            ) : testimonials.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No testimonials found.
                                    </td>
                                </tr>
                            ) : (
                                testimonials.map((t) => (
                                    <tr key={t.id}>
                                        <td><strong>{t.author}</strong></td>
                                        <td>{t.role} {t.company && `at ${t.company}`}</td>
                                        <td>{t.content.substring(0, 50)}...</td>
                                        <td>
                                            <span className={`${styles.badge} ${t.published ? styles.badgeSuccess : styles.badgeWarning}`}>
                                                {t.published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td>
                                            <Link
                                                href={`/admin/testimonials/${t.id}/edit`}
                                                className={styles.actionBtn}
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => togglePublished(t.id, t.published)}
                                                title={t.published ? 'Unpublish' : 'Publish'}
                                            >
                                                {t.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                onClick={() => deleteTestimonial(t.id)}
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
