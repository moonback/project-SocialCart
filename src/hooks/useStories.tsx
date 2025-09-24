import { useState, useEffect, useCallback } from 'react';
import { ProductStory, StoryService } from '../lib/stories';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useStories() {
  const { user } = useAuth();
  const [stories, setStories] = useState<ProductStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await StoryService.getAllActiveStories();
      setStories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des stories');
      toast.error('Erreur lors du chargement des stories');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProductStories = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await StoryService.getProductStories(productId);
      setStories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des stories');
      toast.error('Erreur lors du chargement des stories');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsViewed = useCallback(async (storyId: string) => {
    if (!user) return;
    
    try {
      await StoryService.markStoryAsViewed(storyId, user.id);
    } catch (err) {
      console.error('Erreur lors du marquage de la story:', err);
    }
  }, [user]);

  const voteInPoll = useCallback(async (storyId: string, option: string) => {
    if (!user) return;
    
    try {
      await StoryService.voteInPoll(storyId, user.id, option);
      toast.success('Vote enregistré !');
    } catch (err) {
      toast.error('Erreur lors du vote');
    }
  }, [user]);

  const answerQuiz = useCallback(async (storyId: string, answer: string) => {
    if (!user) return;
    
    try {
      await StoryService.answerQuiz(storyId, user.id, answer);
      toast.success('Réponse enregistrée !');
    } catch (err) {
      toast.error('Erreur lors de la réponse');
    }
  }, [user]);

  const swipeUp = useCallback(async (storyId: string) => {
    if (!user) return;
    
    try {
      await StoryService.swipeUp(storyId, user.id);
    } catch (err) {
      console.error('Erreur lors du swipe up:', err);
    }
  }, [user]);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  return {
    stories,
    loading,
    error,
    loadStories,
    loadProductStories,
    markAsViewed,
    voteInPoll,
    answerQuiz,
    swipeUp
  };
}

export function useStoryCreation() {
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);

  const createStory = useCallback(async (storyData: Omit<ProductStory, 'id' | 'created_at' | 'expires_at' | 'views_count' | 'interactions_count' | 'is_active'>) => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer une story');
      return null;
    }

    try {
      setCreating(true);
      const story = await StoryService.createStory(storyData);
      toast.success('Story créée avec succès !');
      return story;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la story';
      toast.error(errorMessage);
      return null;
    } finally {
      setCreating(false);
    }
  }, [user]);

  const deleteStory = useCallback(async (storyId: string) => {
    try {
      await StoryService.deleteStory(storyId);
      toast.success('Story supprimée');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  }, []);

  return {
    createStory,
    deleteStory,
    creating
  };
}
