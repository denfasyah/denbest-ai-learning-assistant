import { useState, useEffect, useCallback } from 'react';
import summaryApi from '../services/summaryApi';
import Swal from 'sweetalert2';

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

/**
 * Hook to manage summary state and actions
 */
const useSummary = (workspaceId) => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load existing summary
   */
  const loadSummary = useCallback(async () => {
    if (!workspaceId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await summaryApi.getSummary(workspaceId);
      if (response.success) {
        setSummary(response.data);
      }
    } catch (err) {
      console.error('Failed to load summary:', err);
      setError('Gagal memuat ringkasan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  /**
   * Generate summary
   */
  const generateSummary = async () => {
    if (!workspaceId || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    try {
      const response = await summaryApi.generateSummary(workspaceId);
      if (response.success) {
        setSummary(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Ringkasan berhasil dibuat.',
          timer: 1500,
          showConfirmButton: false,
          background: '#1e293b',
          color: '#fff',
        });
      }
    } catch (err) {
      const status = err.response?.status;
      let msg = err.response?.data?.message || 'Gagal membuat ringkasan.';
      if (status === 429 || msg === 'RATE_LIMIT') {
        Swal.fire({
          ...swalConfig,
          icon: 'error',
          title: 'Oops! Rate Limit',
          text: 'Kuota harian aplikasi sedang habis. Silakan coba lagi nanti atau besok ya!',
        });
        setError('Kuota harian aplikasi sedang habis. Silakan coba lagi nanti atau besok ya!');
      } else {
        setError(msg);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: msg,
          background: '#1e293b',
          color: '#fff',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Regenerate summary
   */
  const regenerateSummary = async () => {
    if (!workspaceId || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    try {
      const response = await summaryApi.regenerateSummary(workspaceId);
      if (response.success) {
        setSummary(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Ringkasan berhasil diperbarui.',
          timer: 1500,
          showConfirmButton: false,
          background: '#1e293b',
          color: '#fff',
        });
      }
    } catch (err) {
      const status = err.response?.status;
      let msg = err.response?.data?.message || 'Gagal memperbarui ringkasan.';
      if (status === 429 || msg === 'RATE_LIMIT') {
        Swal.fire({
          ...swalConfig,
          icon: 'error',
          title: 'Oops! Rate Limit',
          text: 'Kuota harian aplikasi sedang habis. Silakan coba lagi nanti atau besok ya!',
        });
        setError('Kuota harian aplikasi sedang habis. Silakan coba lagi nanti atau besok ya!');
      } else {
        setError(msg);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: msg,
          background: '#1e293b',
          color: '#fff',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return {
    summary,
    isLoading,
    isGenerating,
    error,
    hasExisting: !!summary,
    loadSummary,
    generateSummary,
    regenerateSummary
  };
};

export default useSummary;
