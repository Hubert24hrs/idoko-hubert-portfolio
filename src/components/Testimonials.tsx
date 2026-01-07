'use client';

import { Quote, Star } from 'lucide-react';
import styles from './Testimonials.module.css';

interface Testimonial {
    id: string;
    content: string;
    author: string;
    role: string;
    company?: string;
    imageUrl?: string;
    link?: string;
}

interface TestimonialsProps {
    data: Testimonial[];
}

export default function Testimonials({ data }: TestimonialsProps) {
    if (!data || data.length === 0) return null;

    // Allow for a fallback if no rating is stored (default 5)
    // In db we don't store rating currently, so we default to 5 stars as implied.

    return (
        <section id="testimonials" className={`section ${styles.testimonials}`}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className="section-title">Client Testimonials</h2>
                    <p className={styles.subtitle}>
                        What clients say about working with me
                    </p>
                </div>

                <div className={styles.grid}>
                    {data.map((testimonial) => (
                        <div key={testimonial.id} className={styles.card}>
                            <div className={styles.quoteIcon}>
                                <Quote size={32} />
                            </div>

                            <p className={styles.content}>{testimonial.content}</p>

                            <div className={styles.rating}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>

                            <div className={styles.author}>
                                <div className={styles.avatar}>
                                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className={styles.authorInfo}>
                                    <div className={styles.authorName}>{testimonial.author}</div>
                                    <div className={styles.authorRole}>
                                        {testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
