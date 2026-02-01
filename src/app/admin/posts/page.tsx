'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    PenTool
} from 'lucide-react';
import styles from '../admin.module.css';

interface Post {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    featured: boolean;
    date: string;
    category: string;
}

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts');
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePublished = async (id: string, currentState: boolean) => {
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: !currentState }),
            });
            if (res.ok) {
                setPosts(posts.map(p =>
                    p.id === id ? { ...p, published: !currentState } : p
                ));
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPosts(posts.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Blog Posts</h1>
                <Link href="/admin/posts/new" className="btn btn-primary" style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <PenTool size={18} />
                    Write New Post
                </Link>
            </div>

            <div className={styles.dataTable}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td>
                            </tr>
                        ) : posts.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No posts yet. <Link href="/admin/posts/new">Write one!</Link>
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{post.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/{post.slug}</div>
                                    </td>
                                    <td>{post.category}</td>
                                    <td>
                                        <span className={`${styles.badge} ${post.published ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td>{new Date(post.date || Date.now()).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => togglePublished(post.id, post.published)}
                                            title={post.published ? 'Unpublish' : 'Publish'}
                                        >
                                            {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                        <Link href={`/admin/posts/${post.id}/edit`} className={styles.actionBtn} title="Edit">
                                            <Pencil size={16} />
                                        </Link>
                                        <button
                                            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                            onClick={() => deletePost(post.id)}
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
        </>
    );
}
