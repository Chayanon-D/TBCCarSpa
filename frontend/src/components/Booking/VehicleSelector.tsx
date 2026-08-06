import React from 'react';
import { Car } from 'lucide-react';
import { Vehicle, UserProfile, ScreenId } from '../../types';

interface VehicleSelectorProps {
  user: UserProfile;
  selectedVehicle: Vehicle;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onNavigate: (screen: ScreenId) => void;
  labels: {
    stepTitle: string;
    addCarBtn: string;
    carColor: string;
    carYear: string;
  };
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  user,
  selectedVehicle,
  onSelectVehicle,
  onNavigate,
  labels,
}) => {
  const vehiclesList = user.vehicles && user.vehicles.length > 0 ? user.vehicles : [selectedVehicle];

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center justify-between">
        <span>{labels.stepTitle}</span>
        <button
          onClick={() => onNavigate('vehicles')}
          className="text-[10px] text-[#D4AF37] font-normal hover:underline cursor-pointer"
        >
          {labels.addCarBtn}
        </button>
      </label>

      <div className="space-y-2">
        {vehiclesList.map((v) => {
          const isSelected = selectedVehicle.id === v.id;
          return (
            <div
              key={v.id}
              onClick={() => onSelectVehicle(v)}
              className={`p-4 rounded-[24px] border cursor-pointer transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-[#1A1C20] border-[#D4AF37]'
                  : 'bg-[#15161A] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-[#D4AF37] text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {v.brand} {v.model}
                  </h4>
                  <p className="text-[10px] text-zinc-400">
                    {labels.carColor}: {v.color} • {labels.carYear}: {v.year}
                  </p>
                </div>
              </div>

              <span className="font-mono font-bold text-xs text-amber-300 bg-black/40 px-2.5 py-1 rounded-lg border border-zinc-800">
                {v.licensePlate}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};