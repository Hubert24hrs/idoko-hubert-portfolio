import { Brain, Database, Globe, Cloud } from 'lucide-react';
import styles from './Skills.module.css';

const skillCategories = [
    {
        title: 'AI & Machine Learning',
        icon: Brain,
        iconClass: 'iconAI',
        skills: [
            'Machine Learning',
            'Deep Learning',
            'Model Training & Evaluation',
            'Feature Engineering',
            'Natural Language Processing (NLP)',
            'Computer Vision',
            'Recommendation Systems',
            'MLOps',
            'Model Deployment & Monitoring',
        ],
    },
    {
        title: 'Data Solutions Architecture',
        icon: Database,
        iconClass: 'iconData',
        skills: [
            'Data Engineering',
            'ETL / ELT Pipelines',
            'Data Analytics',
            'SQL & NoSQL Databases',
            'Data Warehousing',
            'Cloud Data Platforms',
            'Big Data Processing',
            'Business Intelligence',
        ],
    },
    {
        title: 'Full-Stack Mobile & Web',
        icon: Globe,
        iconClass: 'iconWeb',
        skills: [
            'Frontend Development',
            'Backend Development',
            'RESTful & GraphQL APIs',
            'Mobile App Development',
            'Web Application Development',
            'Authentication & Authorization',
            'Scalable System Design',
        ],
    },
    {
        title: 'Cloud & DevOps',
        icon: Cloud,
        iconClass: 'iconCloud',
        skills: [
            'AWS, Azure, GCP',
            'Docker & Containerization',
            'CI/CD Pipelines',
            'Cloud Deployment',
            'System Monitoring',
            'Performance Optimization',
        ],
    },
];

export default function Skills() {
    return (
        <section id="skills" className={styles.skills} aria-labelledby="skills-title">
            <div className={styles.skillsHeader}>
                <h2 id="skills-title" className="section-title">
                    Skills & <span className="gradient-text">Expertise</span>
                </h2>
                <p className={styles.skillsDescription}>
                    A comprehensive toolkit spanning artificial intelligence, data solutions,
                    full-stack development, and cloud infrastructure.
                </p>
            </div>

            <div className={styles.skillsGrid}>
                {skillCategories.map((category) => (
                    <article key={category.title} className={styles.skillCategory}>
                        <div className={`${styles.categoryIcon} ${styles[category.iconClass]}`}>
                            <category.icon size={28} aria-hidden="true" />
                        </div>
                        <h3 className={styles.categoryTitle}>{category.title}</h3>
                        <ul className={styles.skillList} role="list">
                            {category.skills.map((skill) => (
                                <li key={skill} className={styles.skillItem}>
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    );
}
