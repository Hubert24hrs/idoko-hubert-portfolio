'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import styles from '../../projects/form.module.css';

export default function NewCertificationPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
        logoUrl: '', // Could add upload later if needed
        category: 'ai',
        published: true,
        order: 0,
    });

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

        try {
            const res = await fetch('/api/certifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to create certification');

            router.push('/admin/certifications');
            router.refresh();
        } catch {
            setError('Failed to create certification');
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formPage}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <Link href="/admin/certifications" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        Back to Certifications
                    </Link>
                    <h1 className={styles.formTitle}>Add Certification</h1>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title" className={styles.formLabel}>Classification Title *</label>
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
                            <span className={styles.formHint}>Determines sorting order (AI first, then Data, then Full-Stack)</span>
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
                                    Save Certification
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
