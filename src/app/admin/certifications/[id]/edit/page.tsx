'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import styles from '../../../projects/form.module.css';

interface Certification {
    id: string;
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    logoUrl?: string;
    category: 'ai' | 'data' | 'fullstack';
    published: boolean;
    order: number;
}

export default function EditCertificationPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
        logoUrl: '',
        category: 'ai',
        published: true,
        order: 0,
    });

    useEffect(() => {
        fetchCertification();
    }, [id]);

    const fetchCertification = async () => {
        try {
            const res = await fetch('/api/certifications?published=false');
            const data = await res.json();
            const cert = data.certifications?.find((c: Certification) => c.id === id);

            if (cert) {
                setFormData({
                    title: cert.title || '',
                    issuer: cert.issuer || '',
                    issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
                    expiryDate: cert.expiryDate ? cert.expiryDate.split('T')[0] : '',
                    credentialId: cert.credentialId || '',
                    credentialUrl: cert.credentialUrl || '',
                    logoUrl: cert.logoUrl || '',
                    category: cert.category || 'ai',
                    published: cert.published !== false,
                    order: cert.order || 0,
                });
            } else {
                setError('Certification not found');
            }
        } catch (error) {
            console.error('Error fetching certification:', error);
            setError('Failed to load certification');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/certifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...formData }),
            });

            if (!res.ok) throw new Error('Failed to update certification');

            setSuccess('Certification updated successfully!');
            setTimeout(() => {
                router.push('/admin/certifications');
                router.refresh();
            }, 1500);
        } catch (err) {
            setError('Failed to update certification');
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.formPage}>
                <div className={styles.formContainer} style={{ textAlign: 'center', padding: '4rem' }}>
                    <Loader2 size={32} className="spinning" />
                    <p>Loading certification...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.formPage}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <Link href="/admin/certifications" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        Back to Certifications
                    </Link>
                    <h1 className={styles.formTitle}>Edit Certification</h1>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    {success && <div className={styles.successMessage}>{success}</div>}

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title" className={styles.formLabel}>Certification Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="issuer" className={styles.formLabel}>Issuing Organization *</label>
                            <input
                                type="text"
                                id="issuer"
                                name="issuer"
                                value={formData.issuer}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="category" className={styles.formLabel}>Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={styles.formSelect}
                                required
                            >
                                <option value="ai">AI & Machine Learning</option>
                                <option value="data">Data Solutions</option>
                                <option value="fullstack">Full-Stack Mobile & Web Development</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="issueDate" className={styles.formLabel}>Issue Date *</label>
                            <input
                                type="date"
                                id="issueDate"
                                name="issueDate"
                                value={formData.issueDate}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="expiryDate" className={styles.formLabel}>Expiry Date</label>
                            <input
                                type="date"
                                id="expiryDate"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="credentialUrl" className={styles.formLabel}>Credential URL</label>
                            <input
                                type="url"
                                id="credentialUrl"
                                name="credentialUrl"
                                value={formData.credentialUrl}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="https://..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="published"
                                    name="published"
                                    checked={formData.published}
                                    onChange={handleChange}
                                    className={styles.checkbox}
                                />
                                <label htmlFor="published" className={styles.formLabel}>Published</label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (
                                <>
                                    <Save size={18} />
                                    Update Certification
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
