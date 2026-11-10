import { useState, useEffect } from 'react';
import { quizModules } from './data/quizData';
import { QuestionCard } from './components/QuestionCard';
import { ModuleTabs } from './components/ModuleTabs';
import { ScoreModal } from './components/ScoreModal';
import { QuickNav } from './components/QuickNav';
import { Award, RotateCcw, ArrowUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<number>(1); // 1-5, or 0 for All
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>(() => {
    try {
      const saved = localStorage.getItem('azure_quiz_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('azure_quiz_answers', JSON.stringify(userAnswers));
    } catch (e) {
      console.error('Failed to save answers to localStorage', e);
    }
  }, [userAnswers]);

  // Monitor scroll for back-to-top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectOption = (questionId: string, optionKey: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleResetQuestion = (questionId: string) => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleResetCurrentModule = () => {
    if (activeTab === 0) {
      if (window.confirm('Reset all answers across all modules?')) {
        setUserAnswers({});
      }
      return;
    }
    const currentMod = quizModules.find((m) => m.id === activeTab);
    if (!currentMod) return;

    if (window.confirm(`Reset answers for ${currentMod.title}?`)) {
      setUserAnswers((prev) => {
        const next = { ...prev };
        currentMod.questions.forEach((q) => {
          delete next[q.id];
        });
        return next;
      });
    }
  };

  const handleResetAll = () => {
    setUserAnswers({});
  };

  const handleJumpToQuestion = (moduleId: number, questionId: string) => {
    setActiveTab(moduleId);
    setTimeout(() => {
      const element = document.getElementById(`question-${questionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine which questions to display
  const currentModule = quizModules.find((m) => m.id === activeTab);
  const displayedQuestions = activeTab === 0
    ? quizModules.flatMap((m) => m.questions)
    : (currentModule?.questions || []);

  // Stats calculation
  const totalInCurrentView = displayedQuestions.length;
  let answeredInCurrentView = 0;
  let correctInCurrentView = 0;

  displayedQuestions.forEach((q) => {
    const ans = userAnswers[q.id];
    if (ans) {
      answeredInCurrentView++;
      if (ans === q.correctAnswer) correctInCurrentView++;
    }
  });

  const allQuestions = quizModules.flatMap((m) => m.questions);
  const totalAllAnswered = allQuestions.filter((q) => userAnswers[q.id] !== undefined).length;
  const totalAllCorrect = allQuestions.filter((q) => userAnswers[q.id] === q.correctAnswer).length;

  return (
    <div className="min-h-screen bg-[#0c0e12] text-zinc-100 flex flex-col selection:bg-blue-600/30">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-[#101318]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm md:text-base text-white tracking-tight">
                Azure Cloud Security
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-zinc-400">
                Question Bank
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#181c24] border border-zinc-800 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">Score:</span>
              <span className="text-emerald-400 font-bold">{totalAllCorrect}</span>
              <span className="text-zinc-500">/</span>
              <span className="text-zinc-300">{allQuestions.length}</span>
            </div>

            <button
              onClick={() => setIsScoreModalOpen(true)}
              type="button"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Show Score</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto px-4 py-6 md:py-8 flex-1">
        {/* Title and Subtitle matching the user's reference screenshot */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            All Modules – Interactive Quiz
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-1.5">
            Click a module tab, select answers, get instant feedback, then show your score.
          </p>
        </div>

        {/* Module Tabs */}
        <div className="mb-6">
          <ModuleTabs
            activeTab={activeTab}
            onSelectTab={(tabId) => setActiveTab(tabId)}
            userAnswers={userAnswers}
          />
        </div>

        {/* Module Header & Quick Action Row */}
        <div className="bg-[#12151b] border border-zinc-800/80 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              {activeTab === 0 ? 'All 5 Modules' : `Module ${activeTab}`}
            </div>
            <h2 className="text-base md:text-lg font-bold text-white mt-0.5">
              {activeTab === 0
                ? 'Full Cloud Security in Azure Question Bank'
                : currentModule?.subtitle}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-xs text-zinc-400 font-mono">
              <span className="text-white font-semibold">{answeredInCurrentView}</span>/{totalInCurrentView} answered
              {answeredInCurrentView > 0 && (
                <span className="ml-1 text-emerald-400">
                  ({correctInCurrentView} correct)
                </span>
              )}
            </div>

            {answeredInCurrentView > 0 && (
              <button
                onClick={handleResetCurrentModule}
                type="button"
                className="text-xs text-zinc-400 hover:text-rose-400 p-1.5 rounded hover:bg-zinc-800 transition-colors flex items-center gap-1"
                title="Reset answers in this view"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Question Jump Grid */}
        <QuickNav
          questions={displayedQuestions}
          userAnswers={userAnswers}
          onJump={(qId) => {
            const el = document.getElementById(`question-${qId}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        />

        {/* Scrollable List of Questions (No Next Button) */}
        <div className="space-y-6">
          {displayedQuestions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              displayNumber={activeTab === 0 ? idx + 1 : q.questionNumber}
              selectedOption={userAnswers[q.id] ?? null}
              onSelectOption={handleSelectOption}
              onResetQuestion={handleResetQuestion}
            />
          ))}
        </div>

        {/* Bottom completion banner if all questions in module answered */}
        {answeredInCurrentView === totalInCurrentView && totalInCurrentView > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-950/40 via-zinc-900 to-emerald-950/40 border border-zinc-800 rounded-2xl text-center">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {activeTab === 0
                ? 'All 100 Questions Completed!'
                : `Module ${activeTab} Completed!`}
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              You scored <span className="text-white font-bold">{correctInCurrentView}</span> out of{' '}
              <span className="text-white font-bold">{totalInCurrentView}</span> questions correctly.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsScoreModalOpen(true)}
                type="button"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-blue-900/30"
              >
                View Full Scorecard
              </button>
              {activeTab > 0 && activeTab < 5 && (
                <button
                  onClick={() => {
                    setActiveTab(activeTab + 1);
                    scrollToTop();
                  }}
                  type="button"
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm rounded-lg transition-colors border border-zinc-700"
                >
                  Go to Module {activeTab + 1}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-500 active:scale-95 transition-all"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-800/60 bg-[#0a0c10] py-6 text-center text-xs text-zinc-500">
        <p>Srinivas University · Institute of Computer Science & Information Sciences</p>
        <p className="mt-1">Cloud Security in Microsoft Azure Environment — Interactive Question Bank</p>
      </footer>

      {/* Score Modal */}
      <ScoreModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        userAnswers={userAnswers}
        onResetAll={handleResetAll}
        onJumpToQuestion={handleJumpToQuestion}
      />
    </div>
  );
}
