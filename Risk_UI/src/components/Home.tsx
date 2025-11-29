import { Plus, History, AlertTriangle, TrendingDown } from 'lucide-react';

interface HomeProps {
  onNewProject: () => void;
  onViewHistory: () => void;
  projectCount: number;
}

export function Home({ onNewProject, onViewHistory, projectCount }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-md mx-auto px-6 py-12">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-2xl mb-4 shadow-lg">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Risk Manager</h1>
          <p className="text-gray-600">
            실패를 전제로 분석하여<br />
            비용 낭비를 줄이세요
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">FMEA 방식 분석</h3>
                <p className="text-gray-600 text-sm">
                  O/S/D 값을 기반으로 RPN 위험도를 정밀 계산
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">AI 실행 조언</h3>
                <p className="text-gray-600 text-sm">
                  리스크를 낮추기 위한 구체적인 실행 방안 제공
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">보고서 & 이력</h3>
                <p className="text-gray-600 text-sm">
                  분석 결과를 PDF로 저장하고 언제든 다시 확인
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onNewProject}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-500/30"
          >
            <Plus className="w-5 h-5" />
            새 프로젝트 분석하기
          </button>

          <button
            onClick={onViewHistory}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-200"
          >
            <History className="w-5 h-5" />
            분석 이력 보기
            {projectCount > 0 && (
              <span className="ml-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-sm">
                {projectCount}
              </span>
            )}
          </button>
        </div>

        {/* Warning Note */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 낙관 편향을 극복하세요<br />
            통계적으로 70%의 프로젝트가 예상보다 높은 비용과 시간이 소요됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
