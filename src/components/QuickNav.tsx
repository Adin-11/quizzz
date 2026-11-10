import React from 'react';
import { Question } from '../types';

interface QuickNavProps {
  questions: Question[];
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  onJump: (questionId: string) => void;
}

export const QuickNav: React.FC<QuickNavProps> = ({ questions, userAnswers, onJump }) => {
  return (
    <div className="bg-[#14171d] border border-zinc-800/80 rounded-xl p-3 md:p-4 mb-6 shadow-md">
      <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-2.5">
        <span>Quick Question Jump</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Correct
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Wrong
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block"></span> Unanswered
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {questions.map((q) => {
          const answer = userAnswers[q.id];
          const isAnswered = answer !== undefined;
          const isCorrect = isAnswered && answer === q.correctAnswer;

          let btnColor = 'bg-[#1e232d] text-zinc-400 hover:bg-[#282f3d] border-zinc-800';
          if (isAnswered) {
            btnColor = isCorrect
              ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300 font-bold'
              : 'bg-rose-950/80 border-rose-600 text-rose-300 font-bold';
          }

          return (
            <button
              key={q.id}
              onClick={() => onJump(q.id)}
              title={`Jump to Q${q.questionNumber}`}
              type="button"
              className={`w-7 h-7 md:w-8 md:h-8 rounded-lg text-xs font-mono border transition-all flex items-center justify-center cursor-pointer ${btnColor}`}
            >
              {q.questionNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};
