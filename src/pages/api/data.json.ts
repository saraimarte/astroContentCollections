import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export const GET: APIRoute = async (): Promise<Response> => {
  const allBlogArticles: CollectionEntry<'blog'>[] = await getCollection('blog');

  // Map the collection to include both data and slug
  const blogData = allBlogArticles.map(article => ({
    ...article.data, // Spread the post data
    slug: article.slug // Add the slug
  }));

  return new Response(JSON.stringify(blogData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
