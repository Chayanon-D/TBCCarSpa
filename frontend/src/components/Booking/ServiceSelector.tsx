import React from 'react';
import { Clock, Sparkles, Check } from 'lucide-react';
import { SpaService } from '../../types';

interface ServiceSelectorProps {
  services: SpaService[];
  selectedService: SpaService | null;
  onSelectService: (service: SpaService) => void;
  lang: 'th' | 'en';
  labels: {
    stepTitle: string;
    serviceSteps: string;
    minutes: string;
    points: string;
  };
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedService,
  onSelectService,
  lang,
  labels,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">
        {labels.stepTitle}
      </label>

      <div className="space-y-2.5">
        {services.map((s) => {
          const isSelected = selectedService?.id === s.id;
          const serviceName = lang === 'en' && s.name_en ? s.name_en : s.name;
          const serviceDesc = lang === 'en' && s.description_en ? s.description_en : s.description;
          const serviceSteps = lang === 'en' && s.steps_en ? s.steps_en : s.steps;

          return (
            <div
              key={s.id}
              onClick={() => onSelectService(s)}
              className={`p-4 rounded-[24px] border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#1A1C20] border-[#D4AF37]'
                  : 'bg-[#15161A] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-white">{serviceName}</h4>
                    {s.popular && (
                      <span className="text-[8px] bg-[#D4AF37]/10 text-[#D4AF37] font-bold px-1.5 py-0.5 rounded-full border border-[#D4AF37]/20">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-300 mt-1 leading-relaxed">{serviceDesc}</p>

                  {serviceSteps && serviceSteps.length > 0 && (
                    <div className="mt-3 p-3 rounded-[16px] bg-[#15161A] border border-white/5 space-y-1.5">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                        {labels.serviceSteps}
                      </span>
                      <ul className="space-y-1">
                        {serviceSteps.map((stepItem, idx) => (
                          <li key={idx} className="text-[10px] text-zinc-300 flex items-start gap-1.5">
                            <span className="text-[#D4AF37] font-bold shrink-0">•</span>
                            <span>{stepItem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-2.5 text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1 text-amber-300">
                      <Clock className="w-3 h-3" /> {s.durationMinutes} {labels.minutes}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" /> +{s.pointsEarned} {labels.points}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-1">
                  <span className="text-sm font-black text-amber-200 font-mono block">
                    ฿{s.priceTHB.toLocaleString()}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center ml-auto mt-2">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};