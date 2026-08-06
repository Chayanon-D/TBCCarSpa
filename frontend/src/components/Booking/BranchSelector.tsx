import React from 'react';
import { MapPin } from 'lucide-react';
import { SpaBranch } from '../../types';

interface BranchSelectorProps {
  branches: SpaBranch[];
  selectedBranch: SpaBranch | null;
  onSelectBranch: (branch: SpaBranch) => void;
  lang: 'th' | 'en';
  stepTitle: string;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  branches,
  selectedBranch,
  onSelectBranch,
  lang,
  stepTitle,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">
        {stepTitle}
      </label>

      <div className="space-y-2">
        {branches.map((b) => {
          const isSelected = selectedBranch?.id === b.id;
          const branchName = lang === 'en' && b.name_en ? b.name_en : b.name;
          const branchHours = lang === 'en' && b.openHours_en ? b.openHours_en : b.openHours;

          return (
            <div
              key={b.id}
              onClick={() => onSelectBranch(b)}
              className={`p-4 rounded-[24px] border cursor-pointer transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-[#1A1C20] border-[#D4AF37]'
                  : 'bg-[#15161A] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#D4AF37]' : 'text-zinc-500'}`} />
                <div>
                  <h4 className="text-xs font-bold text-white">{branchName}</h4>
                  <p className="text-[10px] text-amber-300 mt-0.5">{b.address}</p>
                  <p className="text-[9px] text-zinc-400 mt-0.5">{branchHours}</p>
                </div>
              </div>

              <span className="text-[10px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded font-mono">
                {b.distance}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};