export interface DevtoArticle {
    id: number;
    title: string;
    description: string;
    url: string;
    cover_image: string | null;
    social_image: string | null;
    published_timestamp: string;
    tag_list: string[];
    user: {
        name: string;
        profile_image: string;
    };
}

export async function fetchTechNews(limit = 12): Promise<DevtoArticle[]> {
    try {
        // Fetching articles focusing on your specific stacks
        const response = await fetch(`https://dev.to/api/articles?tag=machinelearning,data,webdev,devops&per_page=${limit}`, {
            next: { revalidate: 3600 } // Cache results for 1 hour to prevent rate limiting and ensure performance
        });
        
        if (!response.ok) {
            console.error('Failed to fetch from Dev.to API');
            return [];
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching tech news:', error);
        return [];
    }
}
