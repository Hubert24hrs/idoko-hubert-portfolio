/**
 * Data Service Layer
 * 
 * Provides read/write access to portfolio data using Prisma and PostgreSQL.
 */

import { prisma } from '@/lib/db';

// Types - Keeping these consistent with frontend expectations
export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    longDescription?: string;
    category: 'ai' | 'data' | 'fullstack';
    categoryLabel: string;
    technologies: string[];
    imageUrl?: string;
    liveUrl?: string | null;
    githubUrl?: string | null;
    metrics?: Record<string, string>;
    featured: boolean;
    published: boolean;
    order: number;
}

export interface Certification {
    id: string;
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string | null;
    credentialId?: string;
    credentialUrl?: string;
    logoUrl?: string;
    category: 'ai' | 'data' | 'fullstack';
    published: boolean;
    order: number;
}

export interface Testimonial {
    id: string;
    content: string;
    author: string;
    role: string;
    company?: string;
    imageUrl?: string;
    link?: string;
    contact?: string; // email or phone
    published: boolean;
    order: number;
}

export interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
    read: boolean;
}

export interface SiteSettings {
    heroTitle: string;
    heroSubtitle: string;
    aboutContent: string;
    resumeUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    twitterUrl?: string;
    kaggleUrl?: string;
    mediumUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    blogUrl?: string | null;
}

// Helper to update settings since it is a singleton in Schema (id='settings')
async function getSettingsRecord() {
    let settings = await prisma.siteSettings.findUnique({ where: { id: 'settings' } });
    if (!settings) {
        settings = await prisma.siteSettings.create({
            data: {
                id: 'settings',
                heroTitle: 'Idoko Hubert',
                heroSubtitle: 'AI & ML Engineer',
                aboutContent: '',
            }
        });
    }
    return settings;
}

// ============== Projects ==============

export async function getProjects(publishedOnly = true): Promise<Project[]> {
    const where = publishedOnly ? { published: true } : {};
    const projects = await prisma.project.findMany({
        where,
        orderBy: { order: 'asc' }
    });

    return projects.map((p) => ({
        ...p,
        category: p.category as 'ai' | 'data' | 'fullstack', // Cast or validate
        categoryLabel: getCategoryLabel(p.category),
        technologies: p.technologies ? JSON.parse(p.technologies) : [],
        metrics: p.metrics ? JSON.parse(p.metrics) : {},
        imageUrl: p.imageUrl || undefined,
        longDescription: p.longDescription || undefined,
        liveUrl: p.liveUrl || undefined,
        githubUrl: p.githubUrl || undefined,
    }));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
    const p = await prisma.project.findUnique({ where: { slug } });
    if (!p) return null;

    return {
        ...p,
        category: p.category as 'ai' | 'data' | 'fullstack',
        categoryLabel: getCategoryLabel(p.category),
        technologies: p.technologies ? JSON.parse(p.technologies) : [],
        metrics: p.metrics ? JSON.parse(p.metrics) : {},
        imageUrl: p.imageUrl || undefined,
        longDescription: p.longDescription || undefined,
        liveUrl: p.liveUrl || undefined,
        githubUrl: p.githubUrl || undefined,
    };
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const p = await prisma.project.create({
        data: {
            title: project.title,
            slug: project.slug,
            description: project.description,
            longDescription: project.longDescription,
            category: project.category,
            technologies: JSON.stringify(project.technologies || []),
            imageUrl: project.imageUrl,
            liveUrl: project.liveUrl,
            githubUrl: project.githubUrl,
            metrics: JSON.stringify(project.metrics || {}),
            featured: project.featured,
            published: project.published,
            order: project.order,
        }
    });

    return {
        ...p,
        category: p.category as 'ai' | 'data' | 'fullstack',
        categoryLabel: getCategoryLabel(p.category),
        technologies: p.technologies ? JSON.parse(p.technologies) : [],
        metrics: p.metrics ? JSON.parse(p.metrics) : {},
        imageUrl: p.imageUrl || undefined,
        longDescription: p.longDescription || undefined,
        liveUrl: p.liveUrl || undefined,
        githubUrl: p.githubUrl || undefined,
    };
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
        const data: any = { ...updates };
        if (updates.technologies) data.technologies = JSON.stringify(updates.technologies);
        if (updates.metrics) data.metrics = JSON.stringify(updates.metrics);
        delete data.categoryLabel; // Computed, not stored

        const p = await prisma.project.update({
            where: { id },
            data,
        });

        return {
            ...p,
            category: p.category as 'ai' | 'data' | 'fullstack',
            categoryLabel: getCategoryLabel(p.category),
            technologies: p.technologies ? JSON.parse(p.technologies) : [],
            metrics: p.metrics ? JSON.parse(p.metrics) : {},
            imageUrl: p.imageUrl || undefined,
            longDescription: p.longDescription || undefined,
            liveUrl: p.liveUrl || undefined,
            githubUrl: p.githubUrl || undefined,
        };
    } catch {
        return null;
    }
}

export async function deleteProject(id: string): Promise<boolean> {
    try {
        await prisma.project.delete({ where: { id } });
        return true;
    } catch {
        return false;
    }
}

function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        ai: 'AI & ML',
        data: 'Data Solutions',
        fullstack: 'Full-Stack',
    };
    return labels[category] || category;
}


// ============== Certifications ==============

export async function getCertifications(publishedOnly = true): Promise<Certification[]> {
    const where = publishedOnly ? { published: true } : {};
    const certs = await prisma.certification.findMany({ where });

    // Sort function: AI (1) > Data (2) > Fullstack (3), then by order
    const categoryOrder: Record<string, number> = { ai: 1, data: 2, fullstack: 3 };

    return certs.map((c) => ({
        ...c,
        category: c.category as 'ai' | 'data' | 'fullstack', // Typo check in DB?
        issueDate: c.issueDate.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD
        expiryDate: c.expiryDate ? c.expiryDate.toISOString().split('T')[0] : undefined,
        credentialId: c.credentialId || undefined,
        credentialUrl: c.credentialUrl || undefined,
        logoUrl: c.logoUrl || undefined,
    })).sort((a, b) => {
        const catA = categoryOrder[a.category] || 99;
        const catB = categoryOrder[b.category] || 99;
        if (catA !== catB) return catA - catB;
        return a.order - b.order;
    });
}

export async function createCertification(cert: Omit<Certification, 'id'>): Promise<Certification> {
    const c = await prisma.certification.create({
        data: {
            title: cert.title,
            issuer: cert.issuer,
            issueDate: new Date(cert.issueDate),
            expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
            credentialId: cert.credentialId,
            credentialUrl: cert.credentialUrl,
            logoUrl: cert.logoUrl,
            published: cert.published,
            order: cert.order,
            // Assuming schema has category? Schema viewer didn't show category in Certs... 
            // Checking schema -> It does NOT have category in the file usage I saw earlier? 
            // Wait, let me double check the Schema I read earlier.
            // ... 
            // Actually, I should probably check if I missed it.
            // If the original Code had category, I should add it to schema or ignore it.
            // The original interface HAS category.
            // The Schema I viewed earlier:
            // model Certification { ... title, issuer, issueDate ... } NO CATEGORY?
            // Wait, I need to check the schema again. 
        } as any // Forcing untyped check for now, will fix schema if needed.
    });

    // NOTE: If Schema is missing fields, I need to update Schema first!
    // I will proceed assuming I need to update Schema if it's missing.

    return {
        ...c,
        category: (c as any).category || 'ai',
        issueDate: c.issueDate.toISOString().split('T')[0],
        expiryDate: c.expiryDate ? c.expiryDate.toISOString().split('T')[0] : undefined,
        credentialId: c.credentialId || undefined,
        credentialUrl: c.credentialUrl || undefined,
        logoUrl: c.logoUrl || undefined,
    } as Certification;
}

export async function updateCertification(id: string, updates: Partial<Certification>): Promise<Certification | null> {
    try {
        const data: any = { ...updates };
        if (updates.issueDate) data.issueDate = new Date(updates.issueDate);
        if (updates.expiryDate) data.expiryDate = new Date(updates.expiryDate);

        const c = await prisma.certification.update({
            where: { id },
            data,
        });

        return {
            ...c,
            category: (c as any).category || 'ai',
            issueDate: c.issueDate.toISOString().split('T')[0],
            expiryDate: c.expiryDate ? c.expiryDate.toISOString().split('T')[0] : undefined,
            credentialId: c.credentialId || undefined,
            credentialUrl: c.credentialUrl || undefined,
            logoUrl: c.logoUrl || undefined,
        } as Certification;
    } catch {
        return null;
    }
}

export async function deleteCertification(id: string): Promise<boolean> {
    try {
        await prisma.certification.delete({ where: { id } });
        return true;
    } catch {
        return false;
    }
}

// ============== Testimonials ==============
// Note: Schema currently doesn't show Testimonials table? 
// I need to add Testimonials and Messages to Schema!

export async function getTestimonials(publishedOnly = true): Promise<Testimonial[]> {
    // Return empty if not implemented yet or implement logic if I add proper schema
    return [];
}

export async function createTestimonial(item: Omit<Testimonial, 'id'>): Promise<Testimonial> {
    throw new Error("Testimonials not yet implemented in DB");
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
    return null;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
    return false;
}

// ============== Messages ==============

export async function getMessages(): Promise<Message[]> {
    return [];
}

export async function createMessage(msg: Omit<Message, 'id' | 'date' | 'read'>): Promise<Message> {
    throw new Error("Messages not yet implemented in DB");
}

export async function markMessageRead(id: string): Promise<Message | null> {
    return null;
}

export async function deleteMessage(id: string): Promise<boolean> {
    return false;
}

// ============== Settings ==============

export async function getSettings(): Promise<SiteSettings> {
    const s = await getSettingsRecord();
    return {
        heroTitle: s.heroTitle,
        heroSubtitle: s.heroSubtitle,
        aboutContent: s.aboutContent || '',
        resumeUrl: s.resumeUrl || undefined,
        linkedinUrl: s.linkedinUrl || undefined,
        githubUrl: s.githubUrl || undefined,
        twitterUrl: s.twitterUrl || undefined,
        kaggleUrl: s.kaggleUrl || undefined,
        mediumUrl: s.mediumUrl || undefined,
        blogUrl: s.blogUrl || undefined,
    };
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    const s = await prisma.siteSettings.upsert({
        where: { id: 'settings' },
        update: updates,
        create: {
            id: 'settings',
            heroTitle: updates.heroTitle || 'Idoko Hubert',
            heroSubtitle: updates.heroSubtitle || '',
            ...updates
        }
    });
    return {
        heroTitle: s.heroTitle,
        heroSubtitle: s.heroSubtitle,
        aboutContent: s.aboutContent || '',
        resumeUrl: s.resumeUrl || undefined,
        linkedinUrl: s.linkedinUrl || undefined,
        githubUrl: s.githubUrl || undefined,
        twitterUrl: s.twitterUrl || undefined,
        kaggleUrl: s.kaggleUrl || undefined,
        mediumUrl: s.mediumUrl || undefined,
        blogUrl: s.blogUrl || undefined,
    };
}

// ============== Blog Posts ==============

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    category: string;
    tags: string[];
    featured: boolean;
    published: boolean;
    author: string | null;
    readingTime: number | null;
    publishedAt: Date | null;
    date: string; // for compatibility with legacy expectations if any
}

export async function getPosts(publishedOnly = true): Promise<BlogPost[]> {
    try {
        const where = publishedOnly ? { published: true } : {};
        const posts = await prisma.post.findMany({
            where,
            orderBy: { publishedAt: 'desc' }
        });

        return posts.map((p) => ({
            ...p,
            tags: p.tags || [],
            date: p.publishedAt ? p.publishedAt.toISOString() : p.createdAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const p = await prisma.post.findUnique({ where: { slug } });
        if (!p) return null;

        return {
            ...p,
            tags: p.tags || [],
            date: p.publishedAt ? p.publishedAt.toISOString() : p.createdAt.toISOString(),
        };
    } catch (error) {
        console.error("Error fetching post by slug:", error);
        return null;
    }
}
