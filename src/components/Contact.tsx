'use client';

import { useState, FormEvent } from 'react';
import { Send, Linkedin, Github, Twitter, Instagram, Facebook, BookOpen, BarChart2, Mail, Phone } from 'lucide-react';
import styles from './Contact.module.css';

// Custom Hugging Face icon
const HuggingFaceIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-5-5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm7 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
);

// Custom Reddit icon
const RedditIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
);

// Custom TikTok icon
const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

const socialLinks = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/hubert-idoko-47b817342', icon: Linkedin },
    { name: 'GitHub', href: 'https://github.com/Hubert24hrs', icon: Github },
    { name: 'Hugging Face', href: 'https://huggingface.co/', icon: HuggingFaceIcon },
    { name: 'Twitter/X', href: 'https://twitter.com/', icon: Twitter },
    { name: 'Reddit', href: 'https://reddit.com/user/', icon: RedditIcon },
    { name: 'Medium', href: 'https://medium.com/@', icon: BookOpen },
    { name: 'Kaggle', href: 'https://kaggle.com/', icon: BarChart2 },
    { name: 'TikTok', href: 'https://tiktok.com/@', icon: TikTokIcon },
    { name: 'Instagram', href: 'https://instagram.com/', icon: Instagram },
    { name: 'Facebook', href: 'https://facebook.com/', icon: Facebook },
    { name: 'Email', href: 'mailto:iheanachohubert@gmail.com', icon: Mail },
    { name: 'Phone', href: 'tel:+1234567890', icon: Phone },
];

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to send message');

            alert('Thank you for your message! I will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section id="contact" className={styles.contact} aria-labelledby="contact-title">
            <div className={styles.contactBg} aria-hidden="true" />

            <div className={styles.contactContainer}>
                {/* Info Side */}
                <div className={styles.contactInfo}>
                    <h2 id="contact-title" className={styles.contactTitle}>
                        Let&apos;s Build Something <span className="gradient-text">Amazing</span> Together
                    </h2>
                    <p className={styles.contactDescription}>
                        I&apos;m always interested in discussing new projects, creative ideas, or opportunities
                        to be part of your vision. Whether you need an AI solution, a data platform, or a
                        full-stack application, let&apos;s connect.
                    </p>

                    <nav className={styles.socialLinks} aria-label="Social media links">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={styles.socialLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit my ${link.name} profile`}
                            >
                                <link.icon className={styles.socialIcon} aria-hidden="true" />
                                {link.name}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Form Side */}
                <form className={styles.contactForm} onSubmit={handleSubmit}>
                    <h3 className={styles.formTitle}>Send a Message</h3>

                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.formLabel}>Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.formInput}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.formInput}
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="subject" className={styles.formLabel}>Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={styles.formInput}
                            placeholder="Project Inquiry"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="message" className={styles.formLabel}>Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className={styles.formTextarea}
                            placeholder="Tell me about your project..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : (
                            <>
                                <Send size={18} aria-hidden="true" />
                                Send Message
                            </>
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
}
