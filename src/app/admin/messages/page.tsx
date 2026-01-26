'use client';

import { useEffect, useState } from 'react';
import { Trash2, Check, Loader2 } from 'lucide-react';
import styles from '../admin.module.css';

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
    read: boolean;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages');
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch('/api/messages', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            fetchMessages();
        } catch (error) {
            console.error('Error marking message read:', error);
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        try {
            await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
            fetchMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    return (
        <div className={styles.adminLayout}>
            <main className={styles.mainContent}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Messages</h1>
                    <div className={styles.badge}>{messages.filter(m => !m.read).length} Unread</div>
                </div>

                <div className={styles.dataTable}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>From</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        <Loader2 className={styles.spinning} />
                                    </td>
                                </tr>
                            ) : messages.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No messages yet.
                                    </td>
                                </tr>
                            ) : (
                                messages.map((msg) => (
                                    <tr key={msg.id} style={{ opacity: msg.read ? 0.6 : 1, background: msg.read ? 'transparent' : 'var(--background-secondary)' }}>
                                        <td>{new Date(msg.date).toLocaleDateString()}</td>
                                        <td>
                                            <strong>{msg.name}</strong>
                                            <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>{msg.email}</div>
                                        </td>
                                        <td>{msg.subject}</td>
                                        <td style={{ maxWidth: 300 }}>{msg.message.length > 50 ? msg.message.substring(0, 50) + '...' : msg.message}</td>
                                        <td>
                                            {!msg.read && (
                                                <button
                                                    className={styles.actionBtn}
                                                    onClick={() => markAsRead(msg.id)}
                                                    title="Mark as Read"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            <button
                                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                onClick={() => deleteMessage(msg.id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
