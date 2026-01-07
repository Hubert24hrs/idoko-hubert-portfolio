'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Award, Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import styles from '../admin.module.css';

interface Certification {
    id: string;
    title: string;
    issuer: string;
    category: 'ai' | 'data' | 'fullstack';
    published: boolean;
    order: number;
}

export default function CertificationsPage() {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCertifications();
    }, []);

    const fetchCertifications = async () => {
        try {
            const res = await fetch('/api/certifications?published=false');
            const data = await res.json();
            setCertifications(data.certifications || []);
        } catch (error) {
            console.error('Error fetching certifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePublished = async (id: string, currentState: boolean) => {
        try {
            await fetch('/api/certifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, published: !currentState }),
            });
            fetchCertifications();
        } catch (error) {
            console.error('Error updating certification:', error);
        }
    };

    const deleteCertification = async (id: string) => {
        if (!confirm('Are you sure you want to delete this certification?')) return;
        try {
            await fetch(`/api/certifications?id=${id}`, { method: 'DELETE' });
            fetchCertifications();
        } catch (error) {
            console.error('Error deleting certification:', error);
        }
    };

    const getCategoryLabel = (cat: string) => {
        switch (cat) {
            case 'ai': return 'AI & ML';
            case 'data': return 'Data Solutions';
            case 'fullstack': return 'Full-Stack';
            default: return cat;
        }
    };

    return (
        <div className={styles.adminLayout}>
            <main className={styles.mainContent}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Certifications</h1>
                    <Link href="/admin/certifications/new" className="btn btn-primary">
                        <Plus size={18} />
                        Add Certification
                    </Link>
                </div>

                <div className={styles.dataTable}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Issuer</th>
                                <th>Category</th>
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
                            ) : certifications.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No certifications found.
                                    </td>
                                </tr>
                            ) : (
                                certifications.map((cert) => (
                                    <tr key={cert.id}>
                                        <td><strong>{cert.title}</strong></td>
                                        <td>{cert.issuer}</td>
                                        <td>
                                            <span className={styles.badge}>
                                                {getCategoryLabel(cert.category)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${cert.published ? styles.badgeSuccess : styles.badgeWarning}`}>
                                                {cert.published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => togglePublished(cert.id, cert.published)}
                                                title={cert.published ? 'Unpublish' : 'Publish'}
                                            >
                                                {cert.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                onClick={() => deleteCertification(cert.id)}
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
