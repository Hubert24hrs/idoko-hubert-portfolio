
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dataPath = path.join(process.cwd(), 'src/data/portfolio-data.json');
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Settings
    if (data.settings) {
        await prisma.siteSettings.upsert({
            where: { id: 'settings' },
            update: data.settings,
            create: {
                id: 'settings',
                ...data.settings
            },
        });
        console.log('Synced Settings');
    }

    // Projects
    if (data.projects) {
        for (const p of data.projects) {
            await prisma.project.upsert({
                where: { slug: p.slug },
                update: {
                    title: p.title,
                    description: p.description,
                    longDescription: p.longDescription,
                    category: p.category,
                    technologies: JSON.stringify(p.technologies || []),
                    imageUrl: p.imageUrl,
                    liveUrl: p.liveUrl,
                    githubUrl: p.githubUrl,
                    metrics: JSON.stringify(p.metrics || {}),
                    featured: p.featured,
                    published: p.published,
                    order: p.order,
                },
                create: {
                    title: p.title,
                    slug: p.slug,
                    description: p.description,
                    longDescription: p.longDescription,
                    category: p.category,
                    technologies: JSON.stringify(p.technologies || []),
                    imageUrl: p.imageUrl,
                    liveUrl: p.liveUrl,
                    githubUrl: p.githubUrl,
                    metrics: JSON.stringify(p.metrics || {}),
                    featured: p.featured,
                    published: p.published,
                    order: p.order,
                },
            });
        }
        console.log(`Synced ${data.projects.length} Projects`);
    }

    console.log('Seeding completed.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
