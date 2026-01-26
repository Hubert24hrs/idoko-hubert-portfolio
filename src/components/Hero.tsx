'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, ArrowRight, Brain, Code, Cloud, Database } from 'lucide-react';
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

                    <div className={styles.roleWrapper}>
                        <span className={styles.roleTag}>AI & ML Engineer</span>
                        <span className={styles.roleTag}>End-to-End Data Solutions</span>
                        <span className={styles.roleTag}>Full-Stack Development</span>
                        <span className={styles.roleTag}>Cloud & DevOps</span>
                    </div>

                    <div className={styles.heroBio}>
                        <p>
                            I build intelligent, scalable systems that bridge machine learning, advanced analytics,
                            and full-stack development. With over three years of experience, I specialize in
                            transforming complex data into production-ready applications that drive real business value.
                        </p>
                        <p>
                            My expertise spans solution architecture, data pipeline engineering, cloud-native infrastructure,
                            and AI model deployment. I approach every project with both technical rigor and product vision,
                            ensuring solutions are not only robust and scalable but aligned with strategic objectives.
                            This combination of deep technical capability and business acumen allows me to deliver
                            high-impact results that stand out in today's competitive landscape.
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
                        <span>AI/ML Engineer</span>
                    </div>

                    <div className={`${styles.floatingCard} ${styles.floatingCard2}`} aria-hidden="true">
                        <div className={`${styles.cardIcon} ${styles.cardIconAccent}`}>
                            <Code size={16} />
                        </div>
                        <span>Full-Stack Dev</span>
                    </div>

                    <div className={`${styles.floatingCard} ${styles.floatingCard3}`} aria-hidden="true">
                        <div className={`${styles.cardIcon} ${styles.cardIconAccent}`}>
                            <Cloud size={16} />
                        </div>
                        <span>Cloud/DevOps Engineer</span>
                    </div>

                    <div className={`${styles.floatingCard} ${styles.floatingCard4}`} aria-hidden="true">
                        <div className={`${styles.cardIcon} ${styles.cardIconPrimary}`}>
                            <Database size={16} />
                        </div>
                        <span>Data Specialist</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
