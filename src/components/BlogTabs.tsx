'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DevtoArticle } from '@/lib/devto-service';
import styles from './BlogTabs.module.css';

type CustomPost = {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    coverImage?: string | null;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    author: string;
    categoryId?: string | null;
    category?: string;
    date: string | Date; // added manually by getPosts
};

export default function BlogTabs({ customPosts, newsPosts }: { customPosts: any[], newsPosts: DevtoArticle[] }) {
    const [activeTab, setActiveTab] = useState<'custom' | 'news'>('custom');

    return (
        <div>
            <div className={styles.tabsContainer}>
                <button 
                    className={`${styles.tabBtn} ${activeTab === 'custom' ? styles.active : ''}`}
                    onClick={() => setActiveTab('custom')}
                >
                    Idoko&apos;s Publications
                </button>
                <button 
                    className={`${styles.tabBtn} ${activeTab === 'news' ? styles.active : ''}`}
                    onClick={() => setActiveTab('news')}
                >
                    Tech Weekly / Live News
                </button>
            </div>

            <div className={styles.grid}>
                {activeTab === 'custom' && (
                    customPosts.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No custom posts published yet. Check back soon!</p>
                        </div>
                    ) : (
                        customPosts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} className={styles.card}>
                                {post.coverImage && (
                                    <div className={styles.imageContainer}>
                                        <img src={post.coverImage} alt={post.title} className={styles.image} />
                                    </div>
                                )}
                                <div className={styles.content}>
                                    <div className={styles.meta}>
                                        <span className={styles.category}>{post.category || 'Engineering'}</span>
                                        <span className={styles.date}>{new Date(post.date).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className={styles.postTitle}>{post.title}</h2>
                                    <p className={styles.excerpt}>{post.excerpt || post.content.substring(0, 150) + '...'}</p>
                                    <span className={styles.readMore}>Read Article &rarr;</span>
                                </div>
                            </Link>
                        ))
                    )
                )}

                {activeTab === 'news' && (
                    newsPosts.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Loading the latest tech news from Dev.to...</p>
                        </div>
                    ) : (
                        newsPosts.map((article) => (
                            <a href={article.url} key={article.id} target="_blank" rel="noopener noreferrer" className={styles.card}>
                                {article.cover_image && (
                                    <div className={styles.imageContainer}>
                                        <img src={article.cover_image} alt={article.title} className={styles.image} />
                                    </div>
                                )}
                                <div className={styles.content}>
                                    <div className={styles.meta}>
                                        <span className={styles.category}>INDUSTRY NEWS</span>
                                        <span className={styles.date}>{new Date(article.published_timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className={styles.postTitle}>{article.title}</h2>
                                    <p className={styles.excerpt}>{article.description}</p>
                                    <span className={styles.readMore}>Read on Dev.to &rarr;</span>
                                </div>
                            </a>
                        ))
                    )
                )}
            </div>
        </div>
    );
}
