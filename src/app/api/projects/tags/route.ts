import { NextResponse } from "next/server";
import { getProjects } from "@/lib/data-service";

/**
 * GET /api/projects/tags
 * Returns all unique technologies/tags from published projects.
 */
export async function GET() {
    try {
        const projects = await getProjects(true);

        // Collect all unique technologies across published projects
        const tagSet = new Set<string>();
        for (const project of projects) {
            if (Array.isArray(project.technologies)) {
                project.technologies.forEach((tag) => tagSet.add(tag));
            }
        }

        const tags = Array.from(tagSet).sort();

        return NextResponse.json({
            success: true,
            data: tags,
        });
    } catch (error) {
        console.error("Error fetching tags:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch tags" },
            { status: 500 }
        );
    }
}
