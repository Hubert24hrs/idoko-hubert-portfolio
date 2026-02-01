import Link from 'next/link';
import { getPosts } from '@/lib/data-service';
import styles from './blog.module.css';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Blog | Idoko Hubert',
    description: 'Thoughts on AI, Software Engineering, and Technology.',
};

export const revalidate = 60; // Revalidate every minute

export default async function BlogPage() {
    const posts = await getPosts(true);

    return (
        <>
            <Header />
            <main className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Blog</h1>
                    <p className={styles.subtitle}>Thoughts, tutorials, and insights on AI & Engineering.</p>
                </header>

                <div className={styles.grid}>
                    {posts.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No posts published yet. Check back soon!</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} className={styles.card}>
                                {post.coverImage && (
                                    <div className={styles.imageContainer}>
                                        <img src={post.coverImage} alt={post.title} className={styles.image} />
                                    </div>
                                )}
                                <div className={styles.content}>
                                    <div className={styles.meta}>
                                        <span className={styles.category}>{post.category}</span>
                                        <span className={styles.date}>{new Date(post.date).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className={styles.postTitle}>{post.title}</h2>
                                    <p className={styles.excerpt}>{post.excerpt || post.content.substring(0, 150) + '...'}</p>
                                    <span className={styles.readMore}>Read Article &rarr;</span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
