'use client';

import { AnimatedTestimonials } from './ui/AnimatedTestimonials';
import { AnimatedGradient } from './ui/animated-gradient-with-svg';
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

// Testimonials mapping helper
const mapTestimonial = (t: Testimonial) => ({
    quote: t.content,
    name: t.author,
    designation: `${t.role}${t.company ? `, ${t.company}` : ''}`,
    src: t.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=500&auto=format&fit=crop',
});


export default function Testimonials({ data }: TestimonialsProps) {
    const testimonials = data && data.length > 0 ? data.map(mapTestimonial) : [];



    return (
        <section id="testimonials" className={`section ${styles.testimonials} relative overflow-hidden`}>
            <AnimatedGradient colors={['#4f46e5', '#8b5cf6', '#e11d48']} speed={10} blur="medium" />
            <div className="container relative z-10">
                <div className={styles.header}>
                    <h2 className="section-title">Client Testimonials</h2>
                    <p className={styles.subtitle}>
                        What clients say about working with me
                    </p>
                </div>

                {testimonials.length > 0 ? (
                    <AnimatedTestimonials
                        testimonials={testimonials}
                        autoplay={true}
                    />
                ) : (
                    <div className={styles.emptyState}>
                        <p>No testimonials published yet. Add some in the Admin panel!</p>
                    </div>
                )}
            </div>
        </section>
    );
}
