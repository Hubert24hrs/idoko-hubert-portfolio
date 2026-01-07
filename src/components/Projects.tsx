'use client';

import { useState } from 'react';
import { ExternalLink, Github, Star } from 'lucide-react';
import styles from './Projects.module.css';

type ProjectCategory = 'all' | 'ai' | 'data' | 'fullstack';

interface Project {
    id: string;
    title: string;
    description: string;
    category: ProjectCategory;
    categoryLabel: string;
    technologies: string[];
    imageUrl?: string | null;
    liveUrl?: string | null;
    githubUrl?: string | null;
    featured?: boolean;
}

interface ProjectsProps {
    data: Project[];
}

const categories = [
    { id: 'all' as const, label: 'All Projects' },
    { id: 'ai' as const, label: 'AI & Machine Learning' },
    { id: 'data' as const, label: 'Data Solutions' },
    { id: 'fullstack' as const, label: 'Full-Stack Development' },
];

export default function Projects({ data }: ProjectsProps) {
    const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');

    const filteredProjects = activeCategory === 'all'
        ? data
        : data.filter((p) => p.category === activeCategory);

    return (
        <section id="projects" className={styles.projects} aria-labelledby="projects-title">
            <div className={styles.projectsHeader}>
                <h2 id="projects-title" className="section-title">
                    Featured <span className="gradient-text">Projects</span>
                </h2>
                <p className={styles.projectsDescription}>
                    A selection of projects showcasing my expertise in AI systems, data engineering,
                    and full-stack application development.
                </p>
            </div>

            {/* Category Filters */}
            <div className={styles.categoryFilters} role="tablist" aria-label="Project categories">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterBtnActive : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                        role="tab"
                        aria-selected={activeCategory === cat.id}
                        aria-controls="projects-grid"
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            <div id="projects-grid" className={styles.projectsGrid} role="tabpanel">
                {(!data || data.length === 0) ? (
                    <div className={styles.emptyState}>
                        <p>Projects coming soon...</p>
                    </div>
                ) : filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <article key={project.id} className={styles.projectCard}>
                            <div className={styles.projectImageWrapper}>
                                {/* Placeholder gradient for missing images */}
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        background: project.category === 'ai'
                                            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                                            : project.category === 'data'
                                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '3rem',
                                        fontWeight: 700,
                                        opacity: 0.9,
                                    }}
                                >
                                    {project.title.charAt(0)}
                                </div>
                                <span className={styles.projectCategory}>{project.categoryLabel}</span>
                                {project.featured && (
                                    <span className={styles.featuredTag}>
                                        <Star size={12} style={{ marginRight: 4 }} />
                                        Featured
                                    </span>
                                )}
                            </div>

                            <div className={styles.projectContent}>
                                <h3 className={styles.projectTitle}>{project.title}</h3>
                                <p className={styles.projectDescription}>{project.description}</p>

                                <div className={styles.projectTech}>
                                    {project.technologies.slice(0, 4).map((tech) => (
                                        <span key={tech} className={styles.techTag}>{tech}</span>
                                    ))}
                                    {project.technologies.length > 4 && (
                                        <span className={styles.techTag}>+{project.technologies.length - 4}</span>
                                    )}
                                </div>

                                <div className={styles.projectLinks}>
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            className={styles.projectLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`View ${project.title} live demo`}
                                        >
                                            <ExternalLink size={16} aria-hidden="true" />
                                            Live Demo
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            className={styles.projectLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`View ${project.title} source code on GitHub`}
                                        >
                                            <Github size={16} aria-hidden="true" />
                                            Source Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <p>No projects found in this category.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
