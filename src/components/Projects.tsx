'use client';

import { AnimatedFolder, type FolderProject } from './AnimatedFolder';
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

/* Color assignments per the user's request:
   - All Projects     → Slate Blue
   - AI & ML          → Amethyst Purple
   - Data Solutions   → Burnt Orange
   - Full-Stack Dev   → Cerulean Blue
*/
const folderCategories = [
    {
        id: 'all' as const,
        label: 'All Projects',
        gradient: 'linear-gradient(135deg, #6476A0, #4A5A80)',   // Slate Blue
    },
    {
        id: 'ai' as const,
        label: 'AI & Machine Learning',
        gradient: 'linear-gradient(135deg, #9B59B6, #7D3C98)',   // Amethyst Purple
    },
    {
        id: 'data' as const,
        label: 'Data Solutions',
        gradient: 'linear-gradient(135deg, #E67E22, #CA6F1E)',   // Burnt Orange
    },
    {
        id: 'fullstack' as const,
        label: 'Full-Stack Development',
        gradient: 'linear-gradient(135deg, #2E86C1, #2471A3)',   // Cerulean Blue
    },
];

/**
 * Convert a raw project into a FolderProject for display
 * inside the AnimatedFolder component.
 */
function toFolderProject(p: Project): FolderProject {
    // Use project-specific gradient image as placeholder when no real image exists
    const categoryGradients: Record<string, string> = {
        ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        fullstack: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800',
    };

    return {
        id: p.id,
        title: p.title,
        image: p.imageUrl || categoryGradients[p.category] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
        liveUrl: p.liveUrl,
    };
}

export default function Projects({ data }: ProjectsProps) {
    // Build folder data from the project list
    const folders = folderCategories.map((cat) => {
        const filtered = cat.id === 'all'
            ? data
            : data.filter((p) => p.category === cat.id);

        return {
            title: cat.label,
            gradient: cat.gradient,
            projects: filtered.map(toFolderProject),
        };
    });

    return (
        <section id="projects" className={styles.projects} aria-labelledby="projects-title">
            <div className={styles.projectsHeader}>
                <h2 id="projects-title" className="section-title">
                    Featured <span className="gradient-text">Projects</span>
                </h2>
                <p className={styles.projectsDescription}>
                    Hover over each folder to reveal project previews. Click a project card to view it in detail.
                </p>
            </div>

            {/* 3D Animated Folders */}
            <div className={styles.foldersGrid}>
                {folders.map((folder) => (
                    <AnimatedFolder
                        key={folder.title}
                        title={folder.title}
                        projects={folder.projects}
                        gradient={folder.gradient}
                    />
                ))}
            </div>
        </section>
    );
}
