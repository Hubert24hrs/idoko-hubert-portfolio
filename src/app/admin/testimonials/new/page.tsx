'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import styles from '../../projects/form.module.css';

export default function NewTestimonialPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        author: '',
        role: '',
        company: '',
        content: '',
        link: '',
        contact: '',
        published: true,
        order: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            const res = await fetch('/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to create testimonial');

            router.push('/admin/testimonials');
            router.refresh();
        } catch (err) {
            setError('Failed to create testimonial');
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formPage}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <Link href="/admin/testimonials" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        Back to Testimonials
                    </Link>
                    <h1 className={styles.formTitle}>Add Testimonial</h1>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="author" className={styles.formLabel}>Client Name *</label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="role" className={styles.formLabel}>Role/Position</label>
                            <input
                                type="text"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="e.g. CTO"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="company" className={styles.formLabel}>Company</label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="e.g. TechCorp"
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                            <label htmlFor="content" className={styles.formLabel}>Testimonial Content *</label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className={styles.formTextarea}
                                required
                                rows={5}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="link" className={styles.formLabel}>Client Link (LinkedIn/Website)</label>
                            <input
                                type="url"
                                id="link"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="contact" className={styles.formLabel}>Client Contact (Private)</label>
                            <input
                                type="text"
                                id="contact"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="Email or Phone for reference"
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
                                    Save Testimonial
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
