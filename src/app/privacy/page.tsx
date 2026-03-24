import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './privacy.module.css';

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main className={styles.container}>
                <section className={styles.content}>
                    <h1>Privacy Policy</h1>
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>
                    
                    <h2>1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us through our contact form, including your name, email address, and the content of your message.
                    </p>

                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul>
                        <li>Respond to your inquiries and messages.</li>
                        <li>Analyze website performance and user experience.</li>
                        <li>Maintain the security of our website.</li>
                    </ul>

                    <h2>3. Cookies</h2>
                    <p>
                        We use cookies to enhance your browsing experience. You can choose to accept or decline cookies through our cookie banner.
                    </p>

                    <h2>4. Data Protection (GDPR)</h2>
                    <p>
                        If you are a resident of the European Economic Area (EEA), you have certain data protection rights, including the right to access, correct, or delete your personal information.
                    </p>

                    <h2>5. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hubert@idokohubert.com">hubert@idokohubert.com</a>.
                    </p>
                </section>
            </main>
            <Footer />
        </>
    );
}
