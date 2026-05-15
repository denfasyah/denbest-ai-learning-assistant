import { useState } from 'react';
import {
  Layers3,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Frown,
  Smile,
  Zap,
  Shuffle,
  RotateCcw,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';

import useFlashcard from '../hooks/useFlashcard';

const FlashcardTab = () => {
  const {
    flashcards,
    currentIndex,
    isFlipped,
    isLoading,
    isGenerating,
    error,
    sessionDone,
    progress,
    currentCard,
    isInQueueMode,
    isShuffleLocked,
    generateFlashcards,
    regenerateFlashcards,
    flipCard,
    nextCard,
    prevCard,
    rateCard,
    shuffleCards,
    resetSession
  } = useFlashcard();

  const [countSelect, setCountSelect] = useState("10");
  const [toastMsg, setToastMsg] = useState('');

  const handleNext = async () => {
    setToastMsg('');
    const result = nextCard();

    if (result?.blocked) {
      if (!result.wasFlipped) {
        // Belum flip sama sekali
        await Swal.fire({
          title: 'Lihat jawabannya dulu dong 👀',
          text: 'Flip kartu ini dulu sebelum lanjut — klik kartunya atau tombol "Lihat Jawaban" ya.',
          icon: 'info',
          confirmButtonText: 'Oke siap',
          confirmButtonColor: '#7c3aed',
          background: '#1e1e2e',
          color: '#fff',
        });
      } else {
        // Sudah flip tapi belum rate
        await Swal.fire({
          title: 'Eh, belum kasih reaksi nih 👆',
          text: 'Lu udah liat jawabannya — kasih Hard, Lumayan, atau Gampang biar progress ke-track. Atau klik Skip kalau mau lewatin kartu ini dulu.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oke, gue rate dulu',
          cancelButtonText: 'Skip kartu ini',
          confirmButtonColor: '#7c3aed',
          cancelButtonColor: '#475569',
          background: '#1e1e2e',
          color: '#fff',
        }).then((res) => {
          if (res.isDismissed && res.dismiss === Swal.DismissReason.cancel) {
            // User pilih skip — force next
            nextCard(true);
          }
        });
      }
      return;
    }

    if (result?.queueMode) {
      if (result?.navigatedTo) {
        setToastMsg(
          `Ada ${result.remaining} kartu yang belum di-review. Otomatis lompat ke kartu ${result.navigatedTo} dulu ya 👀`
        );
      } else {
        setToastMsg(
          `Sisa ${result.remaining} kartu lagi yang belum di-review 💪`
        );
      }
    }
  };

  const handleShuffle = async () => {
    const result = shuffleCards();
    if (result?.locked) {
      await Swal.fire({
        title: 'Shuffle tidak bisa dilakukan 🔒',
        text: 'Lu sudah mulai review. Shuffle hanya bisa dilakukan sebelum review dimulai. Selesaikan dulu sesi ini ya.',
        icon: 'info',
        confirmButtonText: 'Oke, lanjut review',
        confirmButtonColor: '#7c3aed',
        background: '#1e1e2e',
        color: '#fff',
      });
    }
  };

  const handleRate = (rating) => {
    setToastMsg('');
    rateCard(rating);
  };

  const handleRegenerate = async () => {
    const confirmed = window.confirm(
      'Generate ulang akan menghapus semua flashcard saat ini. Lanjutkan?'
    );
    if (!confirmed) return;
    await regenerateFlashcards(parseInt(countSelect));
  };

  // State A — Loading
  if (isLoading) {
    return (
      <div className="w-full space-y-8 animate-pulse">
        <Card className="p-12 border-white/5 bg-white/2 rounded-3xl flex flex-col items-center justify-center">
          <div className="h-40 w-full max-w-md bg-white/5 rounded-2xl mb-8"></div>
          <div className="h-4 w-48 bg-white/5 rounded-full mb-4"></div>
          <div className="h-3 w-32 bg-white/5 rounded-full"></div>
        </Card>
      </div>
    );
  }

  // State C — Generating
  if (isGenerating) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full animate-pulse"></div>
          <div className="h-24 w-24 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center relative z-10">
            <Sparkles className="h-10 w-10 text-indigo-400 animate-bounce" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-3">AI sedang meracik materi...</h2>
        <p className="text-slate-500 font-medium mb-1">Aiden sedang membaca dokumen dan membuat flashcard terbaik buat kamu</p>
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-8">Estimasi: 15–30 detik</p>

        <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 w-full -translate-x-full animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes progress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0); }
            100% { transform: translateX(100%); }
          }
        `}} />
      </div>
    );
  }

  // State B — Empty
  if (flashcards.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
        <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <Layers3 className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-base font-black text-white tracking-tight leading-none">Flashcard</h2>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">Validate Knowledge</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Select
                value={countSelect}
                onChange={(e) => setCountSelect(e.target.value)}
                className="w-full md:w-40 bg-black/20 border-white/10 rounded-2xl h-12"
                options={[
                  { label: "5 Kartu", value: "5" },
                  { label: "10 Kartu (Best)", value: "10" },
                  { label: "15 Kartu", value: "15" },
                  { label: "20 Kartu", value: "20" },
                ]}
              />
              <Button variant="primary" icon={Sparkles} onClick={() => generateFlashcards(parseInt(countSelect))} className="rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-[10px]">
                Generate Flashcard
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <div className="p-8 flex flex-col items-center justify-center min-h-[280px] text-center">
            <Layers3 className="h-12 w-12 text-indigo-400/30 mb-6" />
            <h3 className="text-lg font-black text-white/60 tracking-tight mb-3">
              Belum ada flashcard
            </h3>
            <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed">
              Klik <span className="text-indigo-400 font-bold">Generate Flashcard</span> di
              atas untuk membuat ringkasan otomatis dari dokumen ini menggunakan AI.
            </p>
          </div>


        </div>
      </div>
    );
  }

  // State D — Session Done
  if (sessionDone) {
    return (
      <div className="w-full max-w-3xl mx-auto py-8">
        <Card className="p-10 border-white/10 bg-white/5 backdrop-blur-2xl rounded-[3rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <CheckCircle2 className="h-64 w-64 text-emerald-400" />
          </div>

          <div className="relative z-10 text-center space-y-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter mb-3">Sesi Selesai! 🎉</h2>
              <p className="text-slate-400 font-medium">GG! Lu udah review semua kartu materi ini.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
              <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total</p>
                <p className="text-xl font-black text-white">{progress.total}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Easy</p>
                <p className="text-xl font-black text-emerald-400">{progress.easy}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Medium</p>
                <p className="text-xl font-black text-amber-400">{progress.medium}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Hard</p>
                <p className="text-xl font-black text-rose-400">{progress.hard}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="secondary"
                icon={RotateCcw}
                onClick={resetSession}
                className="flex-1 h-14 rounded-2xl font-black tracking-tight"
              >
                Ulangi Sesi
              </Button>
              <Button
                variant="primary"
                icon={RefreshCw}
                onClick={handleRegenerate}
                className="flex-1 h-14 rounded-2xl font-black tracking-tight bg-indigo-500 shadow-lg shadow-indigo-500/20"
              >
                Generate Ulang
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // State E — Card Active
  const cardContainerStyle = { perspective: '1000px', width: '100%', height: '320px' };
  const cardStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    cursor: 'pointer'
  };
  const faceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    borderRadius: '2.5rem',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  };
  const backFaceStyle = { ...faceStyle, transform: 'rotateY(180deg)', backgroundColor: 'rgba(15, 23, 42, 0.8)' };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      {/* HEADER CONTROLS */}
      <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <Layers3 className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight leading-none">Flashcard {currentIndex + 1} <span className="text-slate-600">/ {flashcards.length}</span></h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${(progress.reviewed / progress.total) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {Math.round((progress.reviewed / progress.total) * 100)}% Done
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              icon={Shuffle}
              onClick={handleShuffle}
              className={`rounded-xl h-10 px-4 font-bold text-[10px] uppercase tracking-widest border-white/5 transition-all ${isShuffleLocked
                ? 'opacity-40 cursor-not-allowed grayscale'
                : 'hover:bg-white/10'
                }`}
              title={isShuffleLocked ? 'Tidak bisa shuffle saat review sedang berjalan' : 'Acak urutan kartu'}
            >
              Shuffle
            </Button>
            <Button variant="primary" icon={RefreshCw} onClick={handleRegenerate} disabled={isGenerating} className="rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-[10px]">
              Regenerate
            </Button>
          </div>
        </div>
      </Card>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 animate-in fade-in">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {/* CARD COMPONENT */}
      <div className="relative group max-w-2xl mx-auto py-4">
        <div style={cardContainerStyle}>
          <div style={cardStyle} onClick={() => { setToastMsg(''); flipCard(); }}>
            {/* FRONT FACE */}
            <div style={faceStyle} className="group-hover:border-indigo-500/30 transition-colors">
              <div className="absolute top-8 left-8">
                <Badge variant="indigo" className="px-3 py-1 text-[10px] font-black uppercase tracking-widest">Question</Badge>
              </div>

              <h3 className="text-xl md:text-2xl font-black text-white text-center leading-tight tracking-tight max-w-md">
                {currentCard?.frontText}
              </h3>

              <div className="absolute bottom-10 flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-bounce">
                  <RotateCcw className="h-4 w-4 text-slate-500" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Klik untuk lihat jawaban</span>
              </div>
            </div>

            {/* BACK FACE */}
            <div style={backFaceStyle}>
              <div className="absolute top-8 left-8">
                <Badge variant="emerald" className="px-3 py-1 text-[10px] font-black uppercase tracking-widest">Answer</Badge>
              </div>

              <div className="w-full flex-1 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar mt-12 mb-20 px-4">
                <p className="text-base md:text-lg font-medium text-slate-200 text-center leading-relaxed italic">
                  "{currentCard?.backText}"
                </p>
              </div>

              {/* RATING BUTTONS (Inside Back Face) */}
              <div className="absolute bottom-8 left-0 w-full px-8 flex justify-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleRate('hard')}
                  className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all group/btn active:scale-95"
                >
                  <Frown className="h-5 w-5 text-rose-400" />
                  <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">😰 Susah</span>
                </button>
                <button
                  onClick={() => handleRate('medium')}
                  className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all group/btn active:scale-95"
                >
                  <Smile className="h-5 w-5 text-amber-400" />
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">😊 Lumayan</span>
                </button>
                <button
                  onClick={() => handleRate('easy')}
                  className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all group/btn active:scale-95"
                >
                  <Zap className="h-5 w-5 text-emerald-400" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">😎 Gampang</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION OVERLAYS */}
        <div className="absolute top-1/2 -left-4 md:-left-20 -translate-y-1/2">
          <button
            disabled={currentIndex === 0}
            onClick={() => { setToastMsg(''); prevCard(); }}
            className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${currentIndex === 0
                ? 'opacity-20 cursor-not-allowed bg-white/5 text-slate-500'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-90 shadow-xl'
              }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute top-1/2 -right-4 md:-right-20 -translate-y-1/2">
          <button
            onClick={handleNext}
            className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 active:scale-90 shadow-xl"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* QUEUE TOAST */}
      {toastMsg && (
        <div style={{
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: '12px',
          margin: '8px 0',
          padding: '8px 16px',
          background: 'rgba(124, 58, 237, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          maxWidth: 'fit-content',
          marginInline: 'auto'
        }}>
          {toastMsg}
        </div>
      )}

      <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">
        Tip: Review kartu tiap hari buat hasil belajar yang GG parah 🚀
      </p>
    </div>
  );
};

export default FlashcardTab;
