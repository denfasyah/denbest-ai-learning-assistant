import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { quizApi } from '../services/quizApi';
import useWorkspace from './useWorkspace';

const swalConfig = {
  background: "#050816",
  color: "#fff",
  confirmButtonColor: "#3b82f6",
  backdrop: `rgba(0,0,0,0.45) blur(80px)`,
  customClass: {
    popup: "rounded-3xl border border-white/10 shadow-2xl",
    title: "text-white",
    htmlContainer: "text-slate-300",
  },
};

const SESSION_KEY = "quiz_session";

const saveSession = (data) => {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch (e) {}
};

const loadSession = (workspaceId) => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.workspaceId !== workspaceId) return null;
    return data;
  } catch (e) {
    return null;
  }
};

const clearSession = () => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {}
};

const useQuiz = () => {
  const { workspaceId } = useWorkspace();
  
  const [initialized, setInitialized] = useState(false);
  const [view, setView] = useState('idle');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    if (!initialized && workspaceId) {
      const session = loadSession(workspaceId);
      if (session) {
        setView(session.view || 'idle');
        setActiveQuiz(session.activeQuiz || null);
        setSelectedAnswers(session.selectedAnswers || {});
        setCurrentQuestionIndex(session.currentQuestionIndex || 0);
        setQuizResult(session.quizResult || null);
      }
      setInitialized(true);
    }
  }, [workspaceId, initialized]);

  useEffect(() => {
    if (!initialized || !workspaceId) return;
    if (view === 'idle') {
      clearSession();
      return;
    }
    saveSession({
      workspaceId,
      view,
      activeQuiz,
      selectedAnswers,
      currentQuestionIndex,
      quizResult
    });
  }, [view, activeQuiz, selectedAnswers, currentQuestionIndex, quizResult, initialized, workspaceId]);

  const handleRateLimitError = (err, defaultMsg) => {
    const status = err.response?.status;
    let msg = err.response?.data?.message || defaultMsg;
    if (status === 429 || msg === 'RATE_LIMIT') {
      Swal.fire({
        ...swalConfig,
        icon: 'error',
        title: 'Oops! Rate Limit',
        text: 'Kuota harian aplikasi sedang habis. Silakan coba lagi nanti atau besok ya!',
      });
    } else {
      Swal.fire({
        ...swalConfig,
        icon: 'error',
        title: 'Oops...',
        text: msg,
      });
    }
  };

  const handleGenerate = async (count = 5) => {
    if (!workspaceId) return;
    setIsGenerating(true);
    setError(null);
    try {
      const res = await quizApi.generateQuiz(workspaceId, count);
      if (res.data.success) {
        setActiveQuiz(res.data.data);
        setSelectedAnswers({});
        setCurrentQuestionIndex(0);
        setView('quiz');
      }
    } catch (err) {
      handleRateLimitError(err, 'Gagal membuat kuis. Coba lagi.');
      setError(err.response?.data?.message || 'Gagal membuat kuis.');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectAnswer = (index, option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [index]: option
    }));
  };

  const handleSubmit = async () => {
    if (!workspaceId || !activeQuiz) return;
    
    const totalQuestions = activeQuiz.questions.length;
    const answeredCount = Object.keys(selectedAnswers).length;
    
    if (answeredCount < totalQuestions) {
      return { valid: false, unansweredCount: totalQuestions - answeredCount };
    }
    
    setIsSubmitting(true);
    try {
      const answersArray = Object.keys(selectedAnswers).map(indexStr => {
        const idx = parseInt(indexStr, 10);
        return {
          questionId: activeQuiz.questions[idx]._id,
          selectedAnswer: selectedAnswers[indexStr]
        };
      });
      
      const res = await quizApi.submitQuiz(workspaceId, activeQuiz._id, answersArray);
      if (res.data.success) {
        setQuizResult(res.data.data);
        setView('result');
        setCurrentQuestionIndex(0); // Reset for pagination in result view
        return { valid: true };
      }
    } catch (err) {
      handleRateLimitError(err, 'Gagal mensubmit kuis.');
      return { valid: false, error: err.response?.data?.message };
    } finally {
      setIsSubmitting(false);
    }
    return { valid: false };
  };

  const handleReset = () => {
    clearSession();
    setView('idle');
    setActiveQuiz(null);
    setQuizResult(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setError(null);
    setInitialized(true);
  };

  const handleRetry = () => {
    setView('quiz');
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizResult(null);
    saveSession({
      workspaceId,
      view: 'quiz',
      activeQuiz,
      selectedAnswers: {},
      currentQuestionIndex: 0,
      quizResult: null
    });
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return {
    initialized,
    view,
    isGenerating,
    isSubmitting,
    error,
    activeQuiz,
    selectedAnswers,
    currentQuestionIndex,
    quizResult,
    answeredCount,
    setCurrentQuestionIndex,
    handleGenerate,
    selectAnswer,
    handleSubmit,
    handleReset,
    handleRetry
  };
};

export default useQuiz;
