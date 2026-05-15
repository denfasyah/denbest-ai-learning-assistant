import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { flashcardApi } from '../services/flashcardApi';
import useWorkspace from './useWorkspace';

const useFlashcard = () => {
  const { workspaceId } = useWorkspace();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [sessionDone, setSessionDone] = useState(false);
  
  // Bug 1 & 3: Use Map to track reviewed card IDs and their ratings
  const [reviewedMap, setReviewedMap] = useState(new Map()); 
  
  const [progress, setProgress] = useState({ 
    reviewed: 0, 
    total: 0, 
    easy: 0, 
    medium: 0, // Bug 2: Ensure medium is present
    hard: 0 
  });

  const loadFlashcards = useCallback(async () => {
    if (!workspaceId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await flashcardApi.getFlashcards(workspaceId);
      if (response.data.success) {
        const data = response.data.data;
        setFlashcards(data);
        setProgress(prev => ({ ...prev, total: data.length }));
      }
    } catch (err) {
      console.error('Error loading flashcards:', err);
      setError(err.response?.data?.message || 'Gagal memuat flashcards');
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  const generateFlashcards = async (count = 10) => {
    if (!workspaceId) return;
    setIsGenerating(true);
    setError(null);
    try {
      const response = await flashcardApi.generateFlashcards(workspaceId, count);
      if (response.data.success) {
        const data = response.data.data;
        setFlashcards(data);
        setCurrentIndex(0);
        setIsFlipped(false);
        setSessionDone(false);
        setReviewedMap(new Map()); // Reset reviewed tracking
        setProgress({ 
          reviewed: 0, 
          total: data.length, 
          easy: 0, 
          medium: 0, 
          hard: 0 
        });
        toast.success('Flashcards berhasil di-generate!');
      }
    } catch (err) {
      console.error('Error generating flashcards:', err);
      const msg = err.response?.data?.message || 'Gagal generate flashcards';
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateFlashcards = async (count = 10) => {
    if (!workspaceId) return;
    setIsGenerating(true);
    setError(null); // Bug 4: Clear error before starting
    try {
      const response = await flashcardApi.regenerateFlashcards(workspaceId, count);
      if (response.data.success) {
        const data = response.data.data;
        setFlashcards(data);
        setCurrentIndex(0);
        setIsFlipped(false);
        setSessionDone(false);
        setReviewedMap(new Map()); // Reset reviewed tracking
        setProgress({ 
          reviewed: 0, 
          total: data.length, 
          easy: 0, 
          medium: 0, 
          hard: 0 
        });
        toast.success('Flashcards berhasil di-generate ulang!');
      }
    } catch (err) {
      console.error('Error regenerating flashcards:', err);
      const msg = err.response?.data?.message || 'Gagal generate ulang flashcards';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const flipCard = () => setIsFlipped(prev => !prev);

  const nextCard = useCallback(() => {
    setIsFlipped(false);
    if (currentIndex + 1 >= flashcards.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, flashcards.length]);

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const rateCard = async (rating) => {
    const currentCard = flashcards[currentIndex];
    if (!currentCard) return;

    const cardId = String(currentCard._id);
    const previousRating = reviewedMap.get(cardId);

    // Bug 1 & 3: Update reviewedMap and progress correctly
    setReviewedMap(prev => new Map([...prev, [cardId, rating]]));

    setProgress(prev => {
      if (!previousRating) {
        // First time rating this card
        return {
          ...prev,
          reviewed: prev.reviewed + 1,
          [rating]: prev[rating] + 1,
        };
      } else {
        // Already rated this card, update the counts
        return {
          ...prev,
          [previousRating]: Math.max(0, prev[previousRating] - 1),
          [rating]: prev[rating] + 1,
        };
      }
    });

    // Non-blocking update
    flashcardApi.reviewFlashcard(workspaceId, cardId, rating)
      .catch(err => {
        console.error('Error reviewing flashcard:', err);
        // non-blocking toast
      });

    nextCard();
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    // Note: reviewedMap is NOT reset on shuffle
    toast.success('Kartu diacak!');
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionDone(false);
    setReviewedMap(new Map()); // Reset reviewed tracking
    setProgress({ 
      reviewed: 0, 
      total: flashcards.length, 
      easy: 0, 
      medium: 0, 
      hard: 0 
    });
  };

  return {
    flashcards,
    currentIndex,
    isFlipped,
    isLoading,
    isGenerating,
    error,
    sessionDone,
    progress,
    currentCard: flashcards[currentIndex] || null,
    loadFlashcards,
    generateFlashcards,
    regenerateFlashcards,
    flipCard,
    nextCard,
    prevCard,
    rateCard,
    shuffleCards,
    resetSession
  };
};

export default useFlashcard;
