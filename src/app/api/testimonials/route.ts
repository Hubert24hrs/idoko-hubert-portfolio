
import { NextRequest, NextResponse } from 'next/server';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/data-service';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') === 'true';
    const testimonials = await getTestimonials(publishedOnly);
    return NextResponse.json({ testimonials });
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.content || !data.author) {
            return NextResponse.json(
                { error: 'Content and Author are required' },
                { status: 400 }
            );
        }

        const newTestimonial = await createTestimonial({
            content: data.content,
            author: data.author,
            role: data.role || '',
            company: data.company || '',
            imageUrl: data.imageUrl || '',
            link: data.link || '',
            contact: data.contact || '',
            published: data.published !== false,
            order: data.order || 0,
        });

        return NextResponse.json({ testimonial: newTestimonial }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create testimonial' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();

        if (!data.id) {
            return NextResponse.json(
                { error: 'Testimonial ID is required' },
                { status: 400 }
            );
        }

        const updatedTestimonial = await updateTestimonial(data.id, data);

        if (!updatedTestimonial) {
            return NextResponse.json(
                { error: 'Testimonial not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ testimonial: updatedTestimonial });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update testimonial' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json(
            { error: 'Testimonial ID is required' },
            { status: 400 }
        );
    }

    const success = await deleteTestimonial(id);

    if (!success) {
        return NextResponse.json(
            { error: 'Testimonial not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({ success: true });
}
