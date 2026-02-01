
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// GET single post by ID (not slug, though we could support both)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch post" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
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

        const post = await prisma.post.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                excerpt,
                coverImage,
                category,
                tags,
                featured,
                published,
                readingTime,
                publishedAt: published ? new Date() : undefined,
            },
        });

        revalidatePath('/blog');
        revalidatePath(`/blog/${post.slug}`);
        revalidatePath('/admin/posts');

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { error: "Failed to update post" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();

    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const post = await prisma.post.delete({
            where: { id },
        });

        revalidatePath('/blog');
        revalidatePath('/admin/posts');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { error: "Failed to delete post" },
            { status: 500 }
        );
    }
}
