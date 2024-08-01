
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

function formatDate(date:Date): string{
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    return new Date(date).toLocaleDateString(undefined, options)
}


// Define types for our blog post data
export type BlogPost = CollectionEntry<'blog'>;
export type Phase = 'thought' | 'rabbit hole' | 'article';  // Adjust these as needed

// Helper type to create all possible phase-tag combinations
export type PhaseTags<P extends Phase, T extends string> = `${P}_${T}`;

// Define a more specific type for our filtered collections
export type FilteredCollections<Tags extends string> = {
  [K in Phase | PhaseTags<Phase, Tags>]: BlogPost[];
};

async function generateFilteredCollections<Tags extends string>(): Promise<FilteredCollections<Tags>> {
  const allPosts = await getCollection('blog');
  
  // Get unique phases and tags
  const phases = [...new Set(allPosts.map(post => post.data.phase))] as Phase[];
  const allTags = [...new Set(allPosts.flatMap(post => post.data.tags))] as Tags[];

  // Create an object to store all filtered collections
  const filteredCollections = {} as FilteredCollections<Tags>;

  // Generate filtered collections for each phase
  for (const phase of phases) {
    filteredCollections[phase] = allPosts.filter(post => post.data.phase === phase);
  }

  // Generate filtered collections for each phase and tag combination
  for (const phase of phases) {
    for (const tag of allTags) {
      const key = `${phase}_${tag}` as PhaseTags<Phase, Tags>;
      filteredCollections[key] = allPosts.filter(post => 
        post.data.phase === phase && post.data.tags.includes(tag)
      );
    }
  }

  return filteredCollections;
}

// Helper function to safely access filtered collections
function getFilteredCollection<Tags extends string>(
  collections: FilteredCollections<Tags>,
  phase: Phase,
  tag?: Tags
): BlogPost[] {
  if (tag) {
    const key = `${phase}_${tag}` as PhaseTags<Phase, Tags>;
    return collections[key] || [];
  }
  return collections[phase] || [];
}

export {formatDate, generateFilteredCollections, getFilteredCollection};