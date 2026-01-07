import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://idokohubert.dev';
    const currentDate = new Date().toISOString();

    // Core pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/#about`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/#skills`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/#projects`,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/#certifications`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/#contact`,
            lastModified: currentDate,
            changeFrequency: 'yearly' as const,
            priority: 0.6,
        },
    ];

    // TODO: Add dynamic project pages when individual project routes are added
    // const projects = await getProjects();
    // const projectPages = projects.map(project => ({
    //   url: `${baseUrl}/projects/${project.slug}`,
    //   lastModified: project.updatedAt,
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.8,
    // }));

    return [...staticPages];
}
