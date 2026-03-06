'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Calendar, ExternalLink, Award, Cpu, Database, LayoutPanelTop, Layers } from 'lucide-react';
import styles from './Certifications.module.css';
import { LimelightNav } from './ui/limelight-nav';

interface Certification {
    id: string;
    title: string;
    issuer: string;
    issueDate: string;
    credentialUrl?: string;
    logoUrl?: string;
    category: 'ai' | 'data' | 'fullstack';
}

interface CertificationsProps {
    data: Certification[];
}

const CATEGORIES = [
    { id: 'all', icon: <Layers size={20} />, label: 'All' },
    { id: 'ai', icon: <Cpu size={20} />, label: 'AI' },
    { id: 'data', icon: <Database size={20} />, label: 'Data' },
    { id: 'fullstack', icon: <LayoutPanelTop size={20} />, label: 'Fullstack' },
];

export default function Certifications({ data }: CertificationsProps) {
    const [activeTab, setActiveTab] = useState(0);

    // Generate initials for logo placeholder if no logoUrl
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('');

    const filteredData = useMemo(() => {
        const categoryId = CATEGORIES[activeTab].id;
        if (categoryId === 'all') return data;
        return data.filter(cert => cert.category === categoryId);
    }, [data, activeTab]);

    return (
        <section id="certifications" className={styles.certifications} aria-labelledby="certifications-title">
            <div className={styles.certificationsHeader}>
                <h2 id="certifications-title" className="section-title">
                    <span className="gradient-text">Certifications</span> & Credentials
                </h2>
                <p className={styles.certificationsDescription}>
                    Industry-recognized certifications validating expertise in cloud platforms,
                    machine learning, and software development.
                </p>
            </div>

            <div className={styles.filterContainer}>
                <LimelightNav
                    items={CATEGORIES}
                    defaultActiveIndex={0}
                    onTabChange={(index) => setActiveTab(index)}
                    className="max-w-md"
                />
            </div>

            {(!filteredData || filteredData.length === 0) ? (
                <div className={styles.emptyState}>
                    <p>No certifications found in this category.</p>
                </div>
            ) : (
                <div className={styles.certificationsGrid}>
                    {filteredData.map((cert) => (
                        <article key={cert.id} className={styles.certCard}>
                            <div className={styles.certHeader}>
                                <div className={styles.certLogo}>
                                    {cert.logoUrl ? (
                                        <Image
                                            src={cert.logoUrl}
                                            alt={cert.issuer}
                                            className={styles.certLogoImg}
                                            width={50}
                                            height={50}
                                            style={{ width: 'auto', height: 'auto' }}
                                        />
                                    ) : (
                                        <span className={styles.certLogoPlaceholder}>{getInitials(cert.issuer)}</span>
                                    )}
                                </div>
                                <div className={styles.certInfo}>
                                    <h3 className={styles.certTitle}>{cert.title}</h3>
                                    <p className={styles.certIssuer}>{cert.issuer}</p>
                                </div>
                            </div>

                            <div className={styles.certMeta}>
                                <span className={styles.certMetaItem}>
                                    <Calendar size={14} aria-hidden="true" />
                                    {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                                <span className={styles.certMetaItem}>
                                    <Award size={14} aria-hidden="true" />
                                    Verified
                                </span>
                            </div>

                            {cert.credentialUrl && (
                                <a
                                    href={cert.credentialUrl}
                                    className={styles.certLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`View ${cert.title} credential`}
                                >
                                    <ExternalLink size={14} aria-hidden="true" />
                                    View Credential
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
