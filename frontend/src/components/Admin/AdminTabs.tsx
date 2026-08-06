import React from 'react';

export type AdminTabType = 'live' | 'all' | 'search' | 'history';

interface AdminTabsProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  totalBookingsCount: number;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({
  activeTab,
  setActiveTab,
  totalBookingsCount,
}) => {
  const tabs: { id: AdminTabType; label: string }[] = [
    { id: 'live', label: 'คิว & สถานะสด' },
    { id: 'all', label: `การจองทั้งหมด (${totalBookingsCount})` },
    { id: 'search', label: 'ค้นหาลูกค้า' },
    { id: 'history', label: 'ประวัติวันนี้' },
  ];

  return (
    <div className="p-1 rounded-2xl bg-[#13131A] border border-zinc-800 flex items-center justify-between text-xs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
            activeTab === tab.id
              ? 'bg-[#D4AF37] text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};