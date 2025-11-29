import { AlertTriangle, DollarSign } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'risk' | 'money';
  onTabChange: (tab: 'risk' | 'money') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto flex">
        <button
          onClick={() => onTabChange('risk')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'risk'
              ? 'text-red-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
          <span className="text-xs">리스크 관리</span>
        </button>
        
        <button
          onClick={() => onTabChange('money')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'money'
              ? 'text-blue-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <DollarSign className="w-6 h-6" />
          <span className="text-xs">비용 분석</span>
        </button>
      </div>
    </div>
  );
}
