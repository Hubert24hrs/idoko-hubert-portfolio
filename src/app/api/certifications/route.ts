
import { NextResponse } from 'next/server';
import { getCertifications, createCertification, updateCertification, deleteCertification } from '@/lib/data-service';

// GET /api/certifications - List all certifications
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const publishedOnly = searchParams.get('published') !== 'false';

        const certifications = await getCertifications(publishedOnly);
        return NextResponse.json({ certifications });
    } catch (error) {
        console.error('Error fetching certifications:', error);
        return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
    }
}

// POST /api/certifications - Create new certification
export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.title || !body.issuer || !body.issueDate) {
            return NextResponse.json(
                { error: 'Missing required fields: title, issuer, issueDate' },
                { status: 400 }
            );
        }

        const certification = await createCertification({
            title: body.title,
            issuer: body.issuer,
            issueDate: body.issueDate,
            expiryDate: body.expiryDate || null,
            credentialId: body.credentialId || '',
            credentialUrl: body.credentialUrl || '',
            logoUrl: body.logoUrl || '',
            category: body.category || 'ai',
            published: body.published !== false,
            order: body.order || 0,
        });

        return NextResponse.json({ certification }, { status: 201 });
    } catch (error) {
        console.error('Error creating certification:', error);
        return NextResponse.json({ error: 'Failed to create certification' }, { status: 500 });
    }
}

// PUT /api/certifications - Update certification
export async function PUT(request: Request) {
    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: 'Certification ID is required' }, { status: 400 });
        }

        const certification = await updateCertification(body.id, body);

        if (!certification) {
            return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
        }

        return NextResponse.json({ certification });
    } catch (error) {
        console.error('Error updating certification:', error);
        return NextResponse.json({ error: 'Failed to update certification' }, { status: 500 });
    }
}

// DELETE /api/certifications - Delete certification
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Certification ID is required' }, { status: 400 });
        }

        const success = await deleteCertification(id);

        if (!success) {
            return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting certification:', error);
        return NextResponse.json({ error: 'Failed to delete certification' }, { status: 500 });
    }
}
