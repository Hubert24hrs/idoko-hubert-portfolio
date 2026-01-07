import { NextResponse } from 'next/server';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/data-service';

// GET /api/projects - List all projects
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const publishedOnly = searchParams.get('published') !== 'false';

        const projects = await getProjects(publishedOnly);
        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

// POST /api/projects - Create new project
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.slug || !body.description || !body.category) {
            return NextResponse.json(
                { error: 'Missing required fields: title, slug, description, category' },
                { status: 400 }
            );
        }

        const project = await createProject({
            title: body.title,
            slug: body.slug,
            description: body.description,
            longDescription: body.longDescription || '',
            category: body.category,
            categoryLabel: body.categoryLabel || getCategoryLabel(body.category),
            technologies: body.technologies || [],
            imageUrl: body.imageUrl || null,
            liveUrl: body.liveUrl || null,
            githubUrl: body.githubUrl || null,
            metrics: body.metrics || {},
            featured: body.featured || false,
            published: body.published !== false,
            order: body.order || 0,
        });

        return NextResponse.json({ project }, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}

// PUT /api/projects - Update project (id in body)
export async function PUT(request: Request) {
    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const project = await updateProject(body.id, body);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ project });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

// DELETE /api/projects - Delete project (id in query)
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const success = await deleteProject(id);

        if (!success) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
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
