'use client';

import React from 'react';
import { 
  GlobeAltIcon,
  NewspaperIcon,
  CheckBadgeIcon,
  ChatBubbleLeftRightIcon, // For Twitter/Social
  CircleStackIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export type SourceType = 'news' | 'factChecks' | 'tweets' | 'datasets' | 'statistics';

interface DataSourceTabsProps {
  activeTab: 'all' | SourceType;
  onTabChange: (tab: 'all' | SourceType) => void;
  counts?: Record<string, number>;
  loading?: boolean;
}

const TABS: { id: 'all' | SourceType; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Sources', icon: GlobeAltIcon },
  { id: 'news', label: 'News', icon: NewspaperIcon },
  { id: 'factChecks', label: 'Fact Checks', icon: CheckBadgeIcon },
  { id: 'tweets', label: 'Tweets', icon: ChatBubbleLeftRightIcon },
  { id: 'datasets', label: 'Datasets', icon: CircleStackIcon },
  { id: 'statistics', label: 'Statistics', icon: ChartBarIcon },
];

const DataSourceTabs: React.FC<DataSourceTabsProps> = ({
  activeTab,
  onTabChange,
  counts = { all: 0, news: 0, factChecks: 0, tweets: 0, datasets: 0, statistics: 0 },
  loading = false
}) => {

  const getCount = (id: 'all' | SourceType): number => {
    // Handle potential variations in keys (e.g., factChecks vs fact-check)
    if (id === 'factChecks') return counts['factChecks'] || counts['fact-check'] || 0;
    if (id === 'statistics') return counts['statistics'] || counts['government-data'] || 0;
    return counts[id] || 0;
  };

  return (
    <div className="w-full mb-2 overflow-x-auto">
      {/* DaisyUI Tabs */}
      <div className="tabs tabs-bordered tabs-lg"> 
        {TABS.map((tab) => {
          const count = getCount(tab.id);
          const isDisabled = loading || (tab.id !== 'all' && count === 0);
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button // Use button for better accessibility with tabs role
              key={tab.id}
              role="tab"
              className={`tab gap-2 ${isActive ? 'tab-active font-semibold' : ''} ${isDisabled ? 'tab-disabled opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              disabled={isDisabled}
              aria-selected={isActive}
            >
              <IconComponent className="h-5 w-5" /> 
              {tab.label}
              {count > 0 && <span className="text-xs opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DataSourceTabs;