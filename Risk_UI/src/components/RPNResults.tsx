import { AlertTriangle, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { Project } from '../App';

interface RPNResultsProps {
  project: Project;
  onNext: () => void;
}

export function RPNResults({ project, onNext }: RPNResultsProps) {
  const { risks, totalRPN, failureProbability, estimatedLoss } = project;

  const getRiskLevel = (probability: number) => {
    if (probability >= 70) return { label: '매우 높음', color: 'text-red-600', bg: 'bg-red-500' };
    if (probability >= 50) return { label: '높음', color: 'text-orange-600', bg: 'bg-orange-500' };
    if (probability >= 30) return { label: '보통', color: 'text-yellow-600', bg: 'bg-yellow-500' };
    return { label: '낮음', color: 'text-green-600', bg: 'bg-green-500' };
  };

  const riskLevel = getRiskLevel(failureProbability);

  return (
    <div className="max-w-md mx-auto px-6 py-8 pb-32">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-gray-900 mb-2">RPN 분석 완료</h2>
        <p className="text-gray-600">
          3개 리스크의 종합 분석 결과입니다
        </p>
      </div>

      {/* 실패 확률 게이지 */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-700 mb-2">예상 실패 확률</div>
          <div className={`text-6xl mb-2 ${riskLevel.color}`}>
            {failureProbability.toFixed(1)}%
          </div>
          <div className={`inline-block px-4 py-1 ${riskLevel.bg} text-white rounded-full text-sm`}>
            {riskLevel.label}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${riskLevel.bg} transition-all duration-1000`}
            style={{ width: `${failureProbability}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-red-600" />
            <span className="text-sm text-gray-600">총 RPN</span>
          </div>
          <div className="text-red-600 text-2xl">{totalRPN}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-gray-600">예상 손실</span>
          </div>
          <div className="text-orange-600 text-2xl">
            {estimatedLoss.toFixed(0)}
            <span className="text-sm ml-1">만원</span>
          </div>
        </div>
      </div>

      {/* 리스크 상세 목록 */}
      <div className="mb-6">
        <h3 className="text-gray-900 mb-4">리스크 상세 분석</h3>
        <div className="space-y-3">
          {risks.sort((a, b) => b.rpn - a.rpn).map((risk, index) => (
            <div 
              key={risk.id}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}>
                      {index + 1}
                    </span>
                    <h4 className="text-gray-900">{risk.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {risk.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">O:</span>
                    <span className="ml-1 text-gray-900">{risk.occurrence}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">S:</span>
                    <span className="ml-1 text-gray-900">{risk.severity}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">D:</span>
                    <span className="ml-1 text-gray-900">{risk.detection}</span>
                  </div>
                </div>
                <div className="text-red-600">
                  RPN: {risk.rpn}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 경고 메시지 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          ⚠️ <span className="font-semibold">주의:</span> 현재 실패 확률이 {failureProbability.toFixed(1)}%로 
          {failureProbability >= 50 ? ' 매우 높습니다. ' : ' 높습니다. '}
          다음 단계에서 AI가 제안하는 리스크 감소 조치를 반드시 검토하세요.
        </p>
      </div>

      {/* 고정 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={onNext}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            AI 실행 조언 보기
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
