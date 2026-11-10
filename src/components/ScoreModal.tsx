import React from 'react';
import { X, Award, CheckCircle2, XCircle, RotateCcw, AlertCircle } from 'lucide-react';
import { quizModules } from '../data/quizData';
import { Question } from '../types';

interface ScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  onResetAll: () => void;
  onJumpToQuestion: (moduleId: number, questionId: string) => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  isOpen,
  onClose,
  userAnswers,
  onResetAll,
  onJumpToQuestion,
}) => {
  if (!isOpen) return null;

  const allQuestions: Question[] = quizModules.flatMap((m) => m.questions);
  const totalQuestions = allQuestions.length;

  let totalAnswered = 0;
  let totalCorrect = 0;
  const incorrectQuestions: Question[] = [];

  allQuestions.forEach((q) => {
    const ans = userAnswers[q.id];
    if (ans) {
      totalAnswered++;
      if (ans === q.correctAnswer) {
        totalCorrect++;
      } else {
        incorrectQuestions.push(q);
      }
    }
  });

  const percentage = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#14171d] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Quiz Score & Performance</h2>
              <p className="text-xs text-zinc-400">Cloud Security in Microsoft Azure Environment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Scorecard */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[#191d24] border border-zinc-800/80 rounded-xl text-center">
            <div>
              <div className="text-xs font-semibold text-zinc-400 mb-1">SCORE</div>
              <div className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">
                {totalCorrect} <span className="text-sm font-normal text-zinc-500">/ {totalQuestions}</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-400 mb-1">ACCURACY</div>
              <div
                className={`text-2xl md:text-3xl font-extrabold tabular-nums ${
                  percentage >= 80
                    ? 'text-emerald-400'
                    : percentage >= 50
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {percentage}%
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-400 mb-1">ATTEMPTED</div>
              <div className="text-2xl md:text-3xl font-extrabold text-blue-400 tabular-nums">
                {totalAnswered} <span className="text-sm font-normal text-zinc-500">/ {totalQuestions}</span>
              </div>
            </div>
          </div>

          {/* Module Breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              Module Performance
            </h3>
            <div className="space-y-2.5">
              {quizModules.map((module) => {
                const modTotal = module.questions.length;
                let modAnswered = 0;
                let modCorrect = 0;

                module.questions.forEach((q) => {
                  const ans = userAnswers[q.id];
                  if (ans) {
                    modAnswered++;
                    if (ans === q.correctAnswer) modCorrect++;
                  }
                });

                const modPercent = modAnswered > 0 ? Math.round((modCorrect / modAnswered) * 100) : 0;

                return (
                  <div
                    key={module.id}
                    className="p-3 bg-[#181c24] border border-zinc-800/80 rounded-lg flex items-center justify-between text-sm"
                  >
                    <div>
                      <div className="font-semibold text-white">{module.title}</div>
                      <div className="text-xs text-zinc-400 truncate max-w-[260px] md:max-w-md">
                        {module.subtitle}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-semibold text-white">
                        {modCorrect} / {modTotal} correct
                      </div>
                      <div className="text-xs text-zinc-400">
                        {modAnswered} attempted ({modPercent}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incorrect Questions Review */}
          {incorrectQuestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                  Questions to Review ({incorrectQuestions.length})
                </h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {incorrectQuestions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      onJumpToQuestion(q.moduleNumber, q.id);
                      onClose();
                    }}
                    type="button"
                    className="w-full text-left p-3 bg-rose-950/20 border border-rose-900/40 rounded-lg hover:border-rose-700/60 transition-colors flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="text-zinc-200 font-medium">
                        M{q.moduleNumber} Q{q.questionNumber}: {q.question}
                      </div>
                      <div className="text-rose-400 mt-1">
                        Your answer: <span className="font-bold">{userAnswers[q.id]}</span> · Correct: <span className="font-bold text-emerald-400">{q.correctAnswer}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-400 shrink-0 underline">
                      Review →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {totalAnswered === 0 && (
            <div className="text-center py-6 text-zinc-400 text-sm">
              You haven't answered any questions yet. Select options in any module to start!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-[#12151b] flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all answers across all modules?')) {
                onResetAll();
                onClose();
              }
            }}
            type="button"
            className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Answers
          </button>
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
          >
            Continue Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
