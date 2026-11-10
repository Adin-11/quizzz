import React from 'react';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  onSelectOption: (questionId: string, optionKey: 'A' | 'B' | 'C' | 'D') => void;
  onResetQuestion: (questionId: string) => void;
  displayNumber?: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelectOption,
  onResetQuestion,
  displayNumber,
}) => {
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === question.correctAnswer;
  const qNum = displayNumber ?? question.questionNumber;

  const correctOptionObj = question.options.find(
    (opt) => opt.key === question.correctAnswer
  );

  return (
    <div
      id={`question-${question.id}`}
      className="bg-[#14171d] border border-zinc-800/80 rounded-xl p-5 md:p-6 transition-all duration-200 shadow-lg shadow-black/20"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-base md:text-lg font-bold text-white tracking-tight leading-snug">
          Q{qNum}. {question.question}
        </h3>
        {isAnswered && (
          <button
            onClick={() => onResetQuestion(question.id)}
            title="Reset this question"
            className="text-xs text-zinc-400 hover:text-zinc-200 p-1 rounded hover:bg-zinc-800/60 transition-colors shrink-0 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Retry</span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {question.options.map((opt) => {
          const isThisSelected = selectedOption === opt.key;
          const isThisCorrect = question.correctAnswer === opt.key;

          let buttonStyle =
            'border-zinc-800 bg-[#191d24] text-zinc-200 hover:bg-[#202530] hover:border-zinc-700';
          let badge = null;

          if (isAnswered) {
            if (isThisSelected) {
              if (isCorrect) {
                // User picked correct
                buttonStyle =
                  'border-emerald-500 bg-emerald-950/50 text-emerald-100 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50';
                badge = (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 shrink-0 ml-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Correct
                  </span>
                );
              } else {
                // User picked wrong
                buttonStyle =
                  'border-rose-500 bg-rose-950/50 text-rose-100 font-semibold shadow-[0_0_15px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/50';
                badge = (
                  <span className="flex items-center gap-1 text-xs font-semibold text-rose-400 shrink-0 ml-auto">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Wrong
                  </span>
                );
              }
            } else if (isThisCorrect && !isCorrect) {
              // This is the correct answer that the user missed
              buttonStyle =
                'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-medium ring-1 ring-emerald-500/40';
              badge = (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 shrink-0 ml-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Correct Answer
                </span>
              );
            } else {
              // Other unselected options
              buttonStyle = 'border-zinc-800/60 bg-[#16191f]/60 text-zinc-400 opacity-60';
            }
          }

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onSelectOption(question.id, opt.key)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 flex items-center justify-between text-sm md:text-base leading-relaxed cursor-pointer active:scale-[0.99] ${buttonStyle}`}
            >
              <div className="flex items-center gap-3 pr-2">
                <span
                  className={`font-semibold shrink-0 w-6 text-center text-sm ${
                    isAnswered && isThisCorrect
                      ? 'text-emerald-400'
                      : isAnswered && isThisSelected && !isCorrect
                      ? 'text-rose-400'
                      : 'text-zinc-400'
                  }`}
                >
                  {opt.key}.
                </span>
                <span className="break-words">{opt.text}</span>
              </div>
              {badge}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div
          className={`mt-4 px-3.5 py-2.5 rounded-lg text-xs md:text-sm flex items-center justify-between gap-2 border ${
            isCorrect
              ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-300'
              : 'bg-rose-950/30 border-rose-900/60 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>
              {isCorrect
                ? 'Correct! Excellent job.'
                : `Incorrect. Correct answer is ${question.correctAnswer}: ${
                    correctOptionObj ? correctOptionObj.text : ''
                  }`}
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 tabular-nums shrink-0">
            {question.fullAnswerText}
          </span>
        </div>
      )}
    </div>
  );
};
