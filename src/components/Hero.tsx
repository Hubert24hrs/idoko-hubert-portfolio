'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, ArrowRight, Brain, Code } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section id="about" className={styles.hero} aria-labelledby="hero-title">
            <div className={styles.heroBg} aria-hidden="true" />
            <div className={styles.heroGrid} aria-hidden="true" />

            <div className={styles.heroContainer}>
                {/* Content Side */}
                <div className={styles.heroContent}>
                    <div className={styles.heroTagline}>
                        <span className={styles.taglineDot} aria-hidden="true" />
                        <span>Available for new opportunities</span>
                    </div>

                    <h1 id="hero-title" className={styles.heroTitle}>
                        Hi, I&apos;m <span className="gradient-text">Idoko Hubert</span>
                    </h1>

                    <p className={styles.professionalTagline}>
                        <em>AI & ML Engineer</em> <span className={styles.taglineDivider}>|</span>
                        <em>Designing End-to-End Data Solutions</em> <span className={styles.taglineDivider}>|</span>
                        <em>Full-Stack Mobile & Web Development</em>
                    </p>

                    <div className={styles.heroBio}>
                        <p>
                            I design and deploy end-to-end AI and data-driven solutions by integrating machine learning,
                            advanced analytics, and full-stack mobile and web development to build scalable,
                            production-ready systems. With over three years of hands-on experience, I transform
                            complex data into actionable insights and develop intelligent applications that deliver measurable impact.
                        </p>
                        <p>
                            I excel in solution architecture, data pipeline optimization, cloud-native development,
                            API integration, and deploying AI models in real-world environments. My work combines
                            technical depth with product-focused thinking, enabling me to build reliable, high-impact
                            solutions that align with business goals and scale globally, setting me apart in a competitive field.
                        </p>
                    </div>

                    <div className={styles.heroActions}>
                        <Link href="#projects" className="btn btn-primary">
                            View My Work
                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                        <Link href="/resume.pdf" className="btn btn-secondary" target="_blank" rel="noopener">
                            <Download size={18} aria-hidden="true" />
                            Download Resume
                        </Link>
                    </div>

                    <div className={styles.heroStats}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>3+</span>
                            <span className={styles.statLabel}>Years Experience</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>20+</span>
                            <span className={styles.statLabel}>Projects Delivered</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>100%</span>
                            <span className={styles.statLabel}>Client Satisfaction</span>
                        </div>
                    </div>
                </div>

                {/* Image Side */}
                <div className={styles.heroImageWrapper}>
                    <div className={styles.decor1} aria-hidden="true" />
                    <div className={styles.decor2} aria-hidden="true" />

                    <div className={styles.heroImageContainer}>
                        <Image
                            src="/images/profile.jpg"
                            alt="Idoko Hubert - AI & ML Engineer, professional headshot at Lagos Tech Week"
                            fill
                            priority
                            className={styles.heroImage}
                            sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 400px"
                        />
                    </div>

                    {/* Floating Cards */}
                    <div className={`${styles.floatingCard} ${styles.floatingCard1}`} aria-hidden="true">
                        <div className={`${styles.cardIcon} ${styles.cardIconPrimary}`}>
                            <Brain size={16} />
                        </div>
                        <span>AI Engineer</span>
                    </div>

                    <div className={`${styles.floatingCard} ${styles.floatingCard2}`} aria-hidden="true">
                        <div className={`${styles.cardIcon} ${styles.cardIconAccent}`}>
                            <Code size={16} />
                        </div>
                        <span>Full-Stack Dev</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
