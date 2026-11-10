import React from 'react';
import { quizModules } from '../data/quizData';

interface ModuleTabsProps {
  activeTab: number; // 1, 2, 3, 4, 5, or 0 for All
  onSelectTab: (tabId: number) => void;
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
}

export const ModuleTabs: React.FC<ModuleTabsProps> = ({
  activeTab,
  onSelectTab,
  userAnswers,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {quizModules.map((module) => {
        const isActive = activeTab === module.id;
        const total = module.questions.length;
        const answered = module.questions.filter((q) => userAnswers[q.id] !== undefined).length;

        return (
          <button
            key={module.id}
            onClick={() => onSelectTab(module.id)}
            type="button"
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'bg-[#181c24] text-zinc-300 hover:bg-[#222733] border border-zinc-800'
            }`}
          >
            <span>{module.title}</span>
            {answered > 0 && (
              <span
                className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                  isActive
                    ? 'bg-blue-700/80 text-blue-100'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {answered}/{total}
              </span>
            )}
          </button>
        );
      })}

      {/* Optional All Modules tab */}
      <button
        onClick={() => onSelectTab(0)}
        type="button"
        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
          activeTab === 0
            ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
            : 'bg-[#181c24] text-zinc-300 hover:bg-[#222733] border border-zinc-800'
        }`}
      >
        <span>All Modules (100 Qs)</span>
      </button>
    </div>
  );
};
