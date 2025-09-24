import { useState, useEffect, useCallback } from 'react';
import { StoryService, ProductStory } from '../lib/stories';

export interface UseStoriesReturn {
  stories: ProductStory[];
  loading: boolean;
  error: string | null;
  refreshStories: () => Promise<void>;
  markStoryAsViewed: (storyId: string) => Promise<void>;
  createStoryInteraction: (storyId: string, type: 'like' | 'share' | 'product_click') => Promise<void>;
  deleteStory: (storyId: string) => Promise<void>;
}

export function useStories(): UseStoriesReturn {
  const [stories, setStories] = useState<ProductStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedStories = await StoryService.getAllStoriesForBar();
      
      // Filtrer les stories valides (non expirées)
      const validStories = fetchedStories.filter(story => 
        StoryService.isStoryValid(story)
      );
      
      setStories(validStories);
    } catch (err) {
      console.error('Erreur lors du chargement des stories:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStories = useCallback(async () => {
    await loadStories();
  }, [loadStories]);

  const markStoryAsViewed = useCallback(async (storyId: string) => {
    try {
      await StoryService.markStoryAsViewed(storyId);
      
      // Mettre à jour l'état local
      setStories(prevStories => 
        prevStories.map(story => 
          story.id === storyId 
            ? { ...story, is_viewed: true, views_count: story.views_count + 1 }
            : story
        )
      );
    } catch (err) {
      console.error('Erreur lors du marquage de la story comme vue:', err);
    }
  }, []);

  const createStoryInteraction = useCallback(async (
    storyId: string, 
    type: 'like' | 'share' | 'product_click'
  ) => {
    try {
      await StoryService.createStoryInteraction(storyId, type);
    } catch (err) {
      console.error('Erreur lors de la création de l\'interaction:', err);
      throw err;
    }
  }, []);

  const deleteStory = useCallback(async (storyId: string) => {
    try {
      await StoryService.deleteStory(storyId);
      
      // Retirer la story de l'état local
      setStories(prevStories => 
        prevStories.filter(story => story.id !== storyId)
      );
    } catch (err) {
      console.error('Erreur lors de la suppression de la story:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  // Nettoyer automatiquement les stories expirées toutes les minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setStories(prevStories => 
        prevStories.filter(story => StoryService.isStoryValid(story))
      );
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  return {
    stories,
    loading,
    error,
    refreshStories,
    markStoryAsViewed,
    createStoryInteraction,
    deleteStory
  };
}
