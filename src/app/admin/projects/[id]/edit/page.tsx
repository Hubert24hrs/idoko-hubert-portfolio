'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Upload } from 'lucide-react';
import styles from '../../../projects/form.module.css';

interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    longDescription?: string;
    category: string;
    categoryLabel: string;
    technologies: string[];
    imageUrl?: string;
    videoUrl?: string;
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    published: boolean;
}

function getCategoryLabel(cat: string) {
    switch (cat) {
        case 'ai': return 'AI & Machine Learning';
        case 'data': return 'Data Solutions';
        case 'fullstack': return 'Full-Stack Mobile & Web Development';
        default: return cat;
    }
}

export default function EditProjectPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadProgress, setUploadProgress] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        longDescription: '',
        category: 'ai',
        technologies: '',
        imageUrl: '',
        videoUrl: '',
        liveUrl: '',
        githubUrl: '',
        featured: false,
        published: true,
    });

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const res = await fetch('/api/projects?published=false');
            const data = await res.json();
            const p = data.projects?.find((item: Project) => item.id === id);

            if (p) {
                setFormData({
                    title: p.title || '',
                    slug: p.slug || '',
                    description: p.description || '',
                    longDescription: p.longDescription || '',
                    category: p.category || 'ai',
                    technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
                    imageUrl: p.imageUrl || '',
                    videoUrl: p.videoUrl || '',
                    liveUrl: p.liveUrl || '',
                    githubUrl: p.githubUrl || '',
                    featured: p.featured || false,
                    published: p.published !== false,
                });
            } else {
                setError('Project not found');
            }
        } catch (error) {
            console.error('Error fetching project:', error);
            setError('Failed to load project');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (name === 'title') {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, mediaType: 'image' | 'video') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(`Uploading ${mediaType}...`);
        setError('');

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('type', mediaType);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            if (mediaType === 'image') {
                setFormData(prev => ({ ...prev, imageUrl: data.url }));
            } else {
                setFormData(prev => ({ ...prev, videoUrl: data.url }));
            }

            setUploadProgress(`${mediaType === 'image' ? 'Image' : 'Video'} uploaded successfully!`);
            setTimeout(() => setUploadProgress(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    ...formData,
                    technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
                    categoryLabel: getCategoryLabel(formData.category),
                }),
            });

            if (!res.ok) throw new Error('Failed to update project');

            setSuccess('Project updated successfully!');
            setTimeout(() => {
                router.push('/admin');
                router.refresh();
            }, 1500);
        } catch (err) {
            setError('Failed to update project');
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.formPage}>
                <div className={styles.formContainer} style={{ textAlign: 'center', padding: '4rem' }}>
                    <Loader2 size={32} className="spinning" />
                    <p>Loading project...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.formPage}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <Link href="/admin" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>
                    <h1 className={styles.formTitle}>Edit Project</h1>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    {success && <div className={styles.successMessage}>{success}</div>}
                    {uploadProgress && <div className={styles.uploadProgress}>{uploadProgress}</div>}

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title" className={styles.formLabel}>Project Title *</label>
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
                            <label htmlFor="slug" className={styles.formLabel}>URL Slug *</label>
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

                        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                            <label htmlFor="description" className={styles.formLabel}>Short Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={styles.formTextarea}
                                required
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                            <label htmlFor="longDescription" className={styles.formLabel}>Long Description</label>
                            <textarea
                                id="longDescription"
                                name="longDescription"
                                value={formData.longDescription}
                                onChange={handleChange}
                                className={styles.formTextarea}
                                style={{ minHeight: 150 }}
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
                            <label htmlFor="technologies" className={styles.formLabel}>Technologies</label>
                            <input
                                type="text"
                                id="technologies"
                                name="technologies"
                                value={formData.technologies}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="Python, TensorFlow, Docker (comma-separated)"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="liveUrl" className={styles.formLabel}>Live Demo URL</label>
                            <input
                                type="url"
                                id="liveUrl"
                                name="liveUrl"
                                value={formData.liveUrl}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="githubUrl" className={styles.formLabel}>GitHub URL</label>
                            <input
                                type="url"
                                id="githubUrl"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                            <label className={styles.formLabel}>Project Image</label>
                            <div className={styles.uploadArea}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, 'image')}
                                    disabled={isUploading}
                                />
                                {formData.imageUrl && (
                                    <div className={styles.previewBox}>
                                        <img src={formData.imageUrl} alt="Preview" style={{ maxHeight: 100 }} />
                                    </div>
                                )}
                            </div>
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
                                />
                                <label htmlFor="featured" className={styles.formLabel}>Featured Project</label>
                            </div>
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
                                    Update Project
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
