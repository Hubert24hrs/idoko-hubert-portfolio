import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPostBySlug } from '@/lib/data-service';
import styles from '../blog.module.css';
import { Metadata } from 'next';

export const revalidate = 60;

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Idoko Hubert`,
        description: post.excerpt || post.title,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <>
            <Header />
            <main className={styles.container} style={{ minHeight: '80vh', maxWidth: '800px' }}>
                <article>
                    <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <div className={styles.meta} style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                            <span className={styles.category}>{post.category}</span>
                            <span> • </span>
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <h1 className={styles.title} style={{ fontSize: '2.5rem' }}>{post.title}</h1>
                        {post.excerpt && (
                            <p className={styles.subtitle} style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
                                {post.excerpt}
                            </p>
                        )}
                    </header>

                    {post.coverImage && (
                        <div className={styles.imageContainer} style={{ marginBottom: '2rem', borderRadius: '1rem' }}>
                            <img src={post.coverImage} alt={post.title} className={styles.image} style={{ transform: 'none' }} />
                        </div>
                    )}

                    <div className="prose" style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'pre-wrap' // Simple markdown preservation
                    }}>
                        {post.content}
                    </div>

                    <div style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--border)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Tags</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {post.tags.map(tag => (
                                <span key={tag} className={styles.badge} style={{
                                    background: 'var(--background-secondary)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-primary)'
                                }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
