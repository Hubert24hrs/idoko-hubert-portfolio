
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const publishedOnly = searchParams.get('published') === 'true';

    try {
        const posts = await prisma.post.findMany({
            where: publishedOnly ? { published: true } : {},
            orderBy: { date: 'desc' },
        });

        return NextResponse.json({ posts });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const session = await auth();

    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { title, slug, content, excerpt, coverImage, category, tags, featured, published, readingTime } = body;

        // Basic validation
        if (!title || !slug || !content) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                coverImage,
                category,
                tags,
                featured: featured || false,
                published: published || false,
                author: session.user.name || "Idoko Hubert",
                readingTime: readingTime || 5,
                publishedAt: published ? new Date() : null,
            },
        });

        revalidatePath('/blog');
        revalidatePath('/admin/posts');

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        console.error("Error creating post:", error);
        if (error.code === 'P2002') { // Prisma unique constraint error
            return NextResponse.json(
                { error: "Slug already exists" },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}
