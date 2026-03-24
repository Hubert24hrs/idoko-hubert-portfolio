'use client';

import { useState, useEffect } from 'react';
import styles from './CookieConsent.module.css';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.banner} role="alert">
            <div className={styles.content}>
                <p className={styles.text}>
                    We use cookies to enhance your experience and analyze our traffic. 
                    By clicking "Accept", you consent to our use of cookies.
                    Read our <a href="/privacy" className={styles.link}>Privacy Policy</a> for more details.
                </p>
                <div className={styles.actions}>
                    <button onClick={handleDecline} className={styles.declineBtn}>
                        Decline
                    </button>
                    <button onClick={handleAccept} className={styles.acceptBtn}>
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
