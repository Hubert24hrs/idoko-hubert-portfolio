import Link from 'next/link';
import { getPosts } from '@/lib/data-service';
import styles from './blog.module.css';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogTabs from '@/components/BlogTabs';
import { fetchTechNews } from '@/lib/devto-service';

export const metadata: Metadata = {
    title: 'Blog | Idoko Hubert',
    description: 'Thoughts on AI, Software Engineering, and Technology.',
};

export const revalidate = 60; // Revalidate every minute

export default async function BlogPage() {
    const posts = await getPosts(true);
    const newsPosts = await fetchTechNews(12);

    return (
        <>
            <Header />
            <main className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Blog</h1>
                    <p className={styles.subtitle}>Thoughts, tutorials, and live insights on AI, Data, and Engineering.</p>
                </header>

                <BlogTabs customPosts={posts} newsPosts={newsPosts} />
            </main>
            <Footer />
        </>
    );
}
