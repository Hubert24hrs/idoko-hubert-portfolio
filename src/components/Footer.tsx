import Link from 'next/link';
import { Linkedin, Github, Twitter, Heart, Instagram, Facebook } from 'lucide-react';
import styles from './Footer.module.css';

const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
];

const socialLinks = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/hubert-idoko-47b817342', icon: Linkedin },
    { name: 'GitHub', href: 'https://github.com/Hubert24hrs', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com/', icon: Twitter },
    { name: 'Instagram', href: 'https://instagram.com/', icon: Instagram },
    { name: 'Facebook', href: 'https://facebook.com/', icon: Facebook },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer} role="contentinfo">
            <div className={styles.footerContainer}>
                <div className={styles.footerTop}>
                    <div className={styles.footerBrand}>
                        <div className={styles.footerLogo}>IH.dev</div>
                        <p className={styles.footerTagline}>
                            AI & ML Engineer designing intelligent, scalable solutions
                            for complex business challenges.
                        </p>
                    </div>

                    <nav className={styles.footerNav} aria-label="Footer navigation">
                        <div className={styles.footerColumn}>
                            <h4>Navigation</h4>
                            <div className={styles.footerLinks}>
                                {navLinks.map((link) => (
                                    <Link key={link.href} href={link.href} className={styles.footerLink}>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className={styles.footerColumn}>
                            <h4>Resources</h4>
                            <div className={styles.footerLinks}>
                                <Link href="/resume.pdf" className={styles.footerLink} target="_blank">
                                    Resume
                                </Link>
                                <Link href="#" className={styles.footerLink}>
                                    Blog
                                </Link>
                                <Link href="#" className={styles.footerLink}>
                                    Case Studies
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>

                <div className={styles.footerBottom}>
                    <p className={styles.copyright}>
                        © {currentYear} Idoko Hubert. Built with <Heart size={14} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--accent)' }} /> and Next.js
                    </p>

                    <div className={styles.footerSocial}>
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={styles.socialIconBtn}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.name}
                            >
                                <link.icon size={18} aria-hidden="true" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
