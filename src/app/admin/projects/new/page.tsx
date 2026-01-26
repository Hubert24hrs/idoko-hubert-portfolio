'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Save, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import styles from '../form.module.css';

export default function AddProjectPage() {
    const router = useRouter();
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Auto-generate slug from title
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

            // Update the appropriate URL field
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
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
                    categoryLabel: getCategoryLabel(formData.category),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create project');
            }

            setSuccess('Project created successfully!');
            setTimeout(() => {
                router.push('/admin');
                router.refresh();
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formPage}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <Link href="/admin" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>
                    <h1 className={styles.formTitle}>Add New Project</h1>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        {success && <div className={styles.successMessage}>{success}</div>}

                        <div className={styles.formGroup}>
                            <label htmlFor="title" className={styles.formLabel}>Project Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="e.g., Intelligent Document Processing"
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
                                placeholder="auto-generated-from-title"
                                required
                            />
                            <span className={styles.formHint}>Used in the project URL</span>
                        </div>

                        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                            <label htmlFor="description" className={styles.formLabel}>Short Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={styles.formTextarea}
                                placeholder="Brief project description (1-2 sentences)"
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
                                placeholder="Detailed project description"
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
                                placeholder="Python, PyTorch, Docker (comma-separated)"
                            />
                        </div>

                        {/* Media Upload Section */}
                        <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                            <label className={styles.formLabel}>Project Media</label>
                            <div className={styles.mediaUploadContainer}>
                                {/* Image Upload */}
                                <div className={styles.uploadBox}>
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        onChange={(e) => handleFileUpload(e, 'image')}
                                        className={styles.fileInput}
                                        disabled={isUploading}
                                    />
                                    <label htmlFor="imageUpload" className={styles.uploadLabel}>
                                        {isUploading ? (
                                            <Loader2 size={24} className={styles.spinning} />
                                        ) : (
                                            <ImageIcon size={24} />
                                        )}
                                        <span>Upload Image</span>
                                        <span className={styles.uploadHint}>JPG, PNG, GIF, WebP (max 10MB)</span>
                                    </label>
                                    {formData.imageUrl && (
                                        <div className={styles.uploadPreview}>
                                            <NextImage src={formData.imageUrl} alt="Preview" width={100} height={100} style={{ width: 'auto', height: 'auto' }} />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                                className={styles.removeMedia}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Video Upload */}
                                <div className={styles.uploadBox}>
                                    <input
                                        type="file"
                                        id="videoUpload"
                                        accept="video/mp4,video/webm,video/ogg"
                                        onChange={(e) => handleFileUpload(e, 'video')}
                                        className={styles.fileInput}
                                        disabled={isUploading}
                                    />
                                    <label htmlFor="videoUpload" className={styles.uploadLabel}>
                                        {isUploading ? (
                                            <Loader2 size={24} className={styles.spinning} />
                                        ) : (
                                            <Video size={24} />
                                        )}
                                        <span>Upload Video</span>
                                        <span className={styles.uploadHint}>MP4, WebM, OGG (max 50MB)</span>
                                    </label>
                                    {formData.videoUrl && (
                                        <div className={styles.uploadPreview}>
                                            <video src={formData.videoUrl} controls />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, videoUrl: '' }))}
                                                className={styles.removeMedia}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {uploadProgress && (
                                <span className={styles.formHint} style={{ color: 'var(--primary)' }}>
                                    {uploadProgress}
                                </span>
                            )}
                        </div>

                        {/* Manual URL inputs as fallback */}
                        <div className={styles.formGroup}>
                            <label htmlFor="imageUrl" className={styles.formLabel}>Image URL (or paste link)</label>
                            <input
                                type="text"
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="/images/projects/project-name.jpg"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="videoUrl" className={styles.formLabel}>Video URL (or paste link)</label>
                            <input
                                type="text"
                                id="videoUrl"
                                name="videoUrl"
                                value={formData.videoUrl}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="/images/projects/demo-video.mp4"
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
                                placeholder="https://demo.example.com"
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
                                placeholder="https://github.com/username/repo"
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
                                />
                                <label htmlFor="featured" className={styles.formLabel}>Featured Project</label>
                            </div>
                            <div className={styles.checkboxGroup} style={{ marginTop: 8 }}>
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
                        <button type="submit" className={styles.submitBtn} disabled={isSubmitting || isUploading}>
                            {isSubmitting ? 'Saving...' : (
                                <>
                                    <Save size={18} />
                                    Save Project
                                </>
                            )}
                        </button>
                        <Link href="/admin" className={styles.cancelBtn}>
                            <X size={18} style={{ marginRight: 4 }} />
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        ai: 'AI & ML',
        data: 'Data Solutions',
        fullstack: 'Full-Stack Mobile & Web Development',
    };
    return labels[category] || category;
}
