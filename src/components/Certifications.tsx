import { Calendar, ExternalLink, Award } from 'lucide-react';
import styles from './Certifications.module.css';

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

export default function Certifications({ data }: CertificationsProps) {
    // Generate initials for logo placeholder if no logoUrl
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('');

    // Sort logic is handled in backend service, but data here is already sorted.

    if (!data || data.length === 0) return null;
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

            <div className={styles.certificationsGrid}>
                {data.map((cert) => (
                    <article key={cert.id} className={styles.certCard}>
                        <div className={styles.certHeader}>
                            <div className={styles.certLogo}>
                                {cert.logoUrl ? (
                                    <img src={cert.logoUrl} alt={cert.issuer} className={styles.certLogoImg} />
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
        </section>
    );
}
