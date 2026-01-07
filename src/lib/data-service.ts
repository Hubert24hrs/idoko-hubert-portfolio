/**
 * Data Service Layer
 * 
 * Provides read/write access to portfolio data.
 * Currently uses JSON file storage; can be swapped for Prisma later.
 */

import fs from 'fs/promises';
import path from 'path';

// Types
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

export interface PortfolioData {
    projects: Project[];
    certifications: Certification[];
    testimonials: Testimonial[];
    messages: Message[];
    settings: SiteSettings;
}

const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/portfolio-data.json');

// Read all data
export async function getData(): Promise<PortfolioData> {
    try {
        const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
        const data = JSON.parse(fileContent);
        // Ensure new arrays exist
        if (!data.testimonials) data.testimonials = [];
        if (!data.messages) data.messages = [];
        return data as PortfolioData;
    } catch (error) {
        console.error('Error reading data file:', error);
        return {
            projects: [],
            certifications: [],
            testimonials: [],
            messages: [],
            settings: {
                heroTitle: 'Idoko Hubert',
                heroSubtitle: 'AI & ML Engineer',
                aboutContent: '',
            },
        };
    }
}

// Write all data
async function saveData(data: PortfolioData): Promise<void> {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ============== Projects ==============

export async function getProjects(publishedOnly = true): Promise<Project[]> {
    const data = await getData();
    let projects = data.projects;
    if (publishedOnly) {
        projects = projects.filter((p) => p.published);
    }
    return projects.sort((a, b) => a.order - b.order);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
    const data = await getData();
    return data.projects.find((p) => p.slug === slug) || null;
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const data = await getData();
    const newProject: Project = {
        ...project,
        id: `proj-${Date.now()}`,
    };
    data.projects.push(newProject);
    await saveData(data);
    return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const data = await getData();
    const index = data.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    data.projects[index] = { ...data.projects[index], ...updates };
    await saveData(data);
    return data.projects[index];
}

export async function deleteProject(id: string): Promise<boolean> {
    const data = await getData();
    const index = data.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;

    data.projects.splice(index, 1);
    await saveData(data);
    return true;
}

// ============== Certifications ==============

export async function getCertifications(publishedOnly = true): Promise<Certification[]> {
    const data = await getData();
    let certs = data.certifications;
    if (publishedOnly) {
        certs = certs.filter((c) => c.published);
    }

    // Sort function: AI (1) > Data (2) > Fullstack (3), then by order
    const categoryOrder: Record<string, number> = { ai: 1, data: 2, fullstack: 3 };

    return certs.sort((a, b) => {
        const catA = categoryOrder[a.category] || 99;
        const catB = categoryOrder[b.category] || 99;
        if (catA !== catB) return catA - catB;
        return a.order - b.order;
    });
}

export async function createCertification(cert: Omit<Certification, 'id'>): Promise<Certification> {
    const data = await getData();
    const newCert: Certification = {
        ...cert,
        id: `cert-${Date.now()}`,
    };
    data.certifications.push(newCert);
    await saveData(data);
    return newCert;
}

export async function updateCertification(id: string, updates: Partial<Certification>): Promise<Certification | null> {
    const data = await getData();
    const index = data.certifications.findIndex((c) => c.id === id);
    if (index === -1) return null;

    data.certifications[index] = { ...data.certifications[index], ...updates };
    await saveData(data);
    return data.certifications[index];
}

export async function deleteCertification(id: string): Promise<boolean> {
    const data = await getData();
    const index = data.certifications.findIndex((c) => c.id === id);
    if (index === -1) return false;

    data.certifications.splice(index, 1);
    await saveData(data);
    return true;
}

// ============== Testimonials ==============

export async function getTestimonials(publishedOnly = true): Promise<Testimonial[]> {
    const data = await getData();
    let items = data.testimonials || [];
    if (publishedOnly) {
        items = items.filter((i) => i.published);
    }
    return items.sort((a, b) => a.order - b.order);
}

export async function createTestimonial(item: Omit<Testimonial, 'id'>): Promise<Testimonial> {
    const data = await getData();
    const newItem: Testimonial = {
        ...item,
        id: `test-${Date.now()}`,
    };
    if (!data.testimonials) data.testimonials = [];
    data.testimonials.push(newItem);
    await saveData(data);
    return newItem;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
    const data = await getData();
    if (!data.testimonials) data.testimonials = [];
    const index = data.testimonials.findIndex((i) => i.id === id);
    if (index === -1) return null;

    data.testimonials[index] = { ...data.testimonials[index], ...updates };
    await saveData(data);
    return data.testimonials[index];
}

export async function deleteTestimonial(id: string): Promise<boolean> {
    const data = await getData();
    if (!data.testimonials) return false;
    const index = data.testimonials.findIndex((i) => i.id === id);
    if (index === -1) return false;

    data.testimonials.splice(index, 1);
    await saveData(data);
    return true;
}

// ============== Messages ==============

export async function getMessages(): Promise<Message[]> {
    const data = await getData();
    return (data.messages || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function createMessage(msg: Omit<Message, 'id' | 'date' | 'read'>): Promise<Message> {
    const data = await getData();
    const newMessage: Message = {
        ...msg,
        id: `msg-${Date.now()}`,
        date: new Date().toISOString(),
        read: false,
    };
    if (!data.messages) data.messages = [];
    data.messages.push(newMessage);
    await saveData(data);
    return newMessage;
}

export async function markMessageRead(id: string): Promise<Message | null> {
    const data = await getData();
    if (!data.messages) return null;
    const index = data.messages.findIndex((m) => m.id === id);
    if (index === -1) return null;

    data.messages[index].read = true;
    await saveData(data);
    return data.messages[index];
}

export async function deleteMessage(id: string): Promise<boolean> {
    const data = await getData();
    if (!data.messages) return false;
    const index = data.messages.findIndex((m) => m.id === id);
    if (index === -1) return false;

    data.messages.splice(index, 1);
    await saveData(data);
    return true;
}

// ============== Settings ==============

export async function getSettings(): Promise<SiteSettings> {
    const data = await getData();
    return data.settings;
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    const data = await getData();
    data.settings = { ...data.settings, ...updates };
    await saveData(data);
    return data.settings;
}
