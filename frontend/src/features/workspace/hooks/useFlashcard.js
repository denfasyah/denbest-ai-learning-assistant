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

  // Track reviewed card IDs and their ratings
  const [reviewedMap, setReviewedMap] = useState(new Map());

  // Track which cards have been flipped in the current session
  const [flippedInSession, setFlippedInSession] = useState(new Set());

  // Queue system for unreviewed cards
  const [unreviewedQueue, setUnreviewedQueue] = useState([]);
  const [isInQueueMode, setIsInQueueMode] = useState(false);

  const [progress, setProgress] = useState({
    reviewed: 0,
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0
  });

  // --- Persistence Helpers ---
  const STORAGE_KEY = `flashcard_session_${workspaceId}`;

  const saveSession = useCallback((data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { }
  }, [STORAGE_KEY]);

  const loadSession = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }, [STORAGE_KEY]);

  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) { }
  }, [STORAGE_KEY]);

  const loadFlashcards = useCallback(async () => {
    if (!workspaceId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await flashcardApi.getFlashcards(workspaceId);
      if (response.data.success) {
        const data = response.data.data;
        setFlashcards(data);

        if (data.length > 0) {
          const saved = loadSession();
          if (saved && saved.progress?.total === data.length) {
            setReviewedMap(new Map(saved.reviewedMap || []));
            setCurrentIndex(saved.currentIndex ?? 0);
            setFlippedInSession(new Set(saved.flippedInSession || []));
            setProgress(saved.progress);
            setIsInQueueMode(saved.isInQueueMode ?? false);
            setUnreviewedQueue(saved.unreviewedQueue ?? []);
            setSessionDone(saved.sessionDone ?? false);
          } else {
            if (saved) clearSession();
            setProgress(prev => ({ ...prev, total: data.length }));
          }
        }
      }
    } catch (err) {
      console.error('Error loading flashcards:', err);
      setError(err.response?.data?.message || 'Gagal memuat flashcards');
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, loadSession, clearSession]);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  // Auto-save session
  useEffect(() => {
    if (flashcards.length === 0 || isLoading) return;

    saveSession({
      reviewedMap: [...reviewedMap.entries()],
      currentIndex,
      flippedInSession: [...flippedInSession],
      progress,
      isInQueueMode,
      unreviewedQueue,
      sessionDone,
    });
  }, [reviewedMap, currentIndex, flippedInSession, progress, isInQueueMode, unreviewedQueue, sessionDone, flashcards.length, isLoading, saveSession]);

  const generateFlashcards = async (count = 10) => {
    if (!workspaceId) return;
    setIsGenerating(true);
    setError(null);
    try {
      const response = await flashcardApi.generateFlashcards(workspaceId, count);
      if (response.data.success) {
        const data = response.data.data;
        clearSession();
        setFlashcards(data);
        setCurrentIndex(0);
        setIsFlipped(false);
        setSessionDone(false);
        setReviewedMap(new Map());
        setFlippedInSession(new Set());
        setUnreviewedQueue([]);
        setIsInQueueMode(false);
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
    setError(null);
    try {
      const response = await flashcardApi.regenerateFlashcards(workspaceId, count);
      if (response.data.success) {
        const data = response.data.data;
        clearSession();
        setFlashcards(data);
        setCurrentIndex(0);
        setIsFlipped(false);
        setSessionDone(false);
        setReviewedMap(new Map());
        setFlippedInSession(new Set());
        setUnreviewedQueue([]);
        setIsInQueueMode(false);
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

  const flipCard = () => {
    const currentCard = flashcards[currentIndex];
    if (currentCard && !isFlipped) {
      setFlippedInSession(prev => new Set([...prev, String(currentCard._id)]));
    }
    setIsFlipped(prev => !prev);
  };

  const nextCard = useCallback((force = false) => {
    const currentCard = flashcards[currentIndex];
    const cardId = currentCard ? String(currentCard._id) : null;
    const alreadyReviewed = cardId ? reviewedMap.has(cardId) : false;
    const alreadyFlipped = cardId ? flippedInSession.has(cardId) : false;

    // Block SEMUA kondisi belum review jika tidak di-force
    if (!force && !alreadyReviewed) {
      return { blocked: true, wasFlipped: alreadyFlipped };
    }

    setIsFlipped(false);

    // Jika sedang dalam queue mode — navigasi ke queue berikutnya
    if (isInQueueMode) {
      const remainingQueue = unreviewedQueue.filter(idx => idx !== currentIndex);
      if (remainingQueue.length === 0) {
        setIsInQueueMode(false);
        setUnreviewedQueue([]);
        setSessionDone(true);
        return { blocked: false, sessionDone: true };
      }
      setUnreviewedQueue(remainingQueue);
      setCurrentIndex(remainingQueue[0]);
      return {
        blocked: false,
        queueMode: true,
        remaining: remainingQueue.length,
      };
    }

    // Normal mode: cek apakah ini kartu terakhir
    if (currentIndex + 1 >= flashcards.length) {
      const allUnreviewed = flashcards
        .map((card, idx) => ({ card, idx }))
        .filter(({ card }) => !reviewedMap.has(String(card._id)))
        .map(({ idx }) => idx)
        .sort((a, b) => a - b);

      if (allUnreviewed.length === 0) {
        setSessionDone(true);
        return { blocked: false, sessionDone: true };
      }

      setIsInQueueMode(true);
      setUnreviewedQueue(allUnreviewed);
      setCurrentIndex(allUnreviewed[0]);
      return {
        blocked: false,
        queueMode: true,
        remaining: allUnreviewed.length,
        navigatedTo: allUnreviewed[0] + 1,
      };
    }

    setCurrentIndex(prev => prev + 1);
    return { blocked: false };
  }, [currentIndex, flashcards, reviewedMap, flippedInSession, isInQueueMode, unreviewedQueue]);

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const rateCard = async (rating) => {
    const currentCard = flashcards[currentIndex];
    if (!currentCard) return;

    const cardId = String(currentCard._id);
    const previousRating = reviewedMap.get(cardId);

    setReviewedMap(prev => new Map([...prev, [cardId, rating]]));

    setProgress(prev => {
      if (!previousRating) {
        return {
          ...prev,
          reviewed: prev.reviewed + 1,
          [rating]: prev[rating] + 1,
        };
      } else {
        return {
          ...prev,
          [previousRating]: Math.max(0, prev[previousRating] - 1),
          [rating]: prev[rating] + 1,
        };
      }
    });

    flashcardApi.reviewFlashcard(workspaceId, cardId, rating).catch(() => { });
    nextCard(true);
  };

  const shuffleCards = () => {
    if (reviewedMap.size > 0) {
      return { locked: true };
    }

    const shuffled = [...flashcards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setFlippedInSession(new Set());
    clearSession();
    return { locked: false };
  };

  const resetSession = () => {
    clearSession();
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionDone(false);
    setReviewedMap(new Map());
    setFlippedInSession(new Set());
    setUnreviewedQueue([]);
    setIsInQueueMode(false);
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
    isInQueueMode,
    unreviewedQueue,
    isShuffleLocked: reviewedMap.size > 0,
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
