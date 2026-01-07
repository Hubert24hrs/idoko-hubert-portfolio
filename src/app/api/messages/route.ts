
import { NextRequest, NextResponse } from 'next/server';
import { getMessages, createMessage, markMessageRead, deleteMessage } from '@/lib/data-service';
import { auth } from '@/lib/auth';

// GET: Admin only
export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await getMessages();
    return NextResponse.json({ messages });
}

// POST: Public (Contact Form)
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            return NextResponse.json(
                { error: 'Name, Email, and Message are required' },
                { status: 400 }
            );
        }

        const newMessage = await createMessage({
            name: data.name,
            email: data.email,
            subject: data.subject || 'No Subject',
            message: data.message,
        });

        return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}

// PUT: Admin only (Mark as read)
export async function PUT(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();
        if (!data.id) {
            return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
        }

        const updated = await markMessageRead(data.id);
        return NextResponse.json({ message: updated });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
}

// DELETE: Admin only
export async function DELETE(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const success = await deleteMessage(id);
    return NextResponse.json({ success });
}
