'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import styles from '../../../projects/form.module.css';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        category: 'tech',
        tags: '',
        featured: false,
        published: true,
        readingTime: 5,
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/${id}`);
                if (!res.ok) throw new Error('Failed to fetch post');
                const post = await res.json();

                setFormData({
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt || '',
                    content: post.content,
                    coverImage: post.coverImage || '',
                    category: post.category || 'tech',
                    tags: post.tags ? post.tags.join(', ') : '',
                    featured: post.featured,
                    published: post.published,
                    readingTime: post.readingTime || 5,
                });
            } catch (err) {
                setError('Could not load post');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchPost();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update post');
            }

            setSuccess('Post updated successfully!');
            setTimeout(() => {
                router.push('/admin/posts');
                router.refresh();
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div className={styles.formPage}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <Link href="/admin/posts" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        Back to Posts
                    </Link>
                    <h1 className={styles.formTitle}>Edit Post</h1>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        {success && <div className={styles.successMessage}>{success}</div>}

                        <div className={styles.formGroup}>
                            <label htmlFor="title" className={styles.formLabel}>Title *</label>
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
                            <label htmlFor="slug" className={styles.formLabel}>Slug *</label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="category" className={styles.formLabel}>Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={styles.formSelect}
                            >
                                <option value="tech">Tech & Engineering</option>
                                <option value="ai">AI & ML</option>
                                <option value="career">Career & Growth</option>
                                <option value="tutorial">Tutorial</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="tags" className={styles.formLabel}>Tags (comma separated)</label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                            <label htmlFor="excerpt" className={styles.formLabel}>Excerpt</label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                className={styles.formTextarea}
                                style={{ height: '80px' }}
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                            <label htmlFor="content" className={styles.formLabel}>Content (Markdown) *</label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className={styles.formTextarea}
                                style={{ minHeight: '300px', fontFamily: 'monospace' }}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="coverImage" className={styles.formLabel}>Cover Image URL</label>
                            <input
                                type="text"
                                id="coverImage"
                                name="coverImage"
                                value={formData.coverImage}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="readingTime" className={styles.formLabel}>Reading Time (mins)</label>
                            <input
                                type="number"
                                id="readingTime"
                                name="readingTime"
                                value={formData.readingTime}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="featured"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className={styles.checkbox}
                                    style={{ width: 'auto', marginRight: '0.5rem' }}
                                />
                                <label htmlFor="featured" className={styles.formLabel}>Featured</label>
                            </div>
                            <div className={styles.checkboxGroup} style={{ marginTop: 8 }}>
                                <input
                                    type="checkbox"
                                    id="published"
                                    name="published"
                                    checked={formData.published}
                                    onChange={handleChange}
                                    className={styles.checkbox}
                                    style={{ width: 'auto', marginRight: '0.5rem' }}
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
                                    Update Post
                                </>
                            )}
                        </button>
                        <Link href="/admin/posts" className={styles.cancelBtn}>
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
