'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import styles from '../../../projects/form.module.css';

interface Testimonial {
    id: string;
    content: string;
    author: string;
    role: string;
    company?: string;
    imageUrl?: string;
    link?: string;
    contact?: string;
    published: boolean;
    order: number;
}

export default function EditTestimonialPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    useEffect(() => {
        fetchTestimonial();
    }, [id]);

    const fetchTestimonial = async () => {
        try {
            const res = await fetch('/api/testimonials?published=false');
            const data = await res.json();
            const t = data.testimonials?.find((item: Testimonial) => item.id === id);

            if (t) {
                setFormData({
                    author: t.author || '',
                    role: t.role || '',
                    company: t.company || '',
                    content: t.content || '',
                    link: t.link || '',
                    contact: t.contact || '',
                    published: t.published !== false,
                    order: t.order || 0,
                });
            } else {
                setError('Testimonial not found');
            }
        } catch (error) {
            console.error('Error fetching testimonial:', error);
            setError('Failed to load testimonial');
        } finally {
            setIsLoading(false);
        }
    };

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
        setSuccess('');

        try {
            const res = await fetch('/api/testimonials', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...formData }),
            });

            if (!res.ok) throw new Error('Failed to update testimonial');

            setSuccess('Testimonial updated successfully!');
            setTimeout(() => {
                router.push('/admin/testimonials');
                router.refresh();
            }, 1500);
        } catch (err) {
            setError('Failed to update testimonial');
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.formPage}>
                <div className={styles.formContainer} style={{ textAlign: 'center', padding: '4rem' }}>
                    <Loader2 size={32} className="spinning" />
                    <p>Loading testimonial...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.formPage}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <Link href="/admin/testimonials" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        Back to Testimonials
                    </Link>
                    <h1 className={styles.formTitle}>Edit Testimonial</h1>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    {success && <div className={styles.successMessage}>{success}</div>}

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
                                    Update Testimonial
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
