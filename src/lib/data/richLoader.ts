import { RichProblemContent } from './richContentTypes';

// Cache for rich content
const contentCache = new Map<string, RichProblemContent>();

/**
 * Load rich content for a problem
 * This function tries to load from data/rich/{id}.json first,
 * falls back to basic content if rich content doesn't exist
 */
export async function loadRichContent(id: string): Promise<RichProblemContent | null> {
  // Check cache first
  if (contentCache.has(id)) {
    return contentCache.get(id)!;
  }

  try {
    // Try to import the rich content JSON
    const content = await import(`@/../data/rich/${id}.json`);
    const richContent = content.default || content;
    contentCache.set(id, richContent);
    return richContent;
  } catch {
    // Rich content doesn't exist for this problem
    return null;
  }
}

/**
 * Check if rich content exists for a problem
 */
export function hasRichContent(id: string): boolean {
  // For now, we only have 0001
  // TODO: Scan the data/rich directory to get all available IDs
  return id === '0001';
}
