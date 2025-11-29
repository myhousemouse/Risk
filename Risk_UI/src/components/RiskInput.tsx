import { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Risk } from '../App';

interface RiskInputProps {
  risk: Risk;
  riskNumber: number;
  totalRisks: number;
  onUpdate: (riskId: number, occurrence: number, severity: number, detection: number) => void;
  onNext: () => void;
  onPrevious?: () => void;
}

export function RiskInput({ risk, riskNumber, totalRisks, onUpdate, onNext, onPrevious }: RiskInputProps) {
  const [occurrence, setOccurrence] = useState(risk.occurrence);
  const [severity, setSeverity] = useState(risk.severity);
  const [detection, setDetection] = useState(risk.detection);

  const rpn = occurrence * severity * detection;

  useEffect(() => {
    setOccurrence(risk.occurrence);
    setSeverity(risk.severity);
    setDetection(risk.detection);
  }, [risk]);

  const handleNext = () => {
    onUpdate(risk.id, occurrence, severity, detection);
    onNext();
  };

  const getRPNColor = (value: number) => {
    if (value >= 400) return 'text-red-600';
    if (value >= 200) return 'text-orange-600';
    return 'text-yellow-600';
  };

  const getRPNBgColor = (value: number) => {
    if (value >= 400) return 'bg-red-100';
    if (value >= 200) return 'bg-orange-100';
    return 'bg-yellow-100';
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 pb-32">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">진행률</span>
          <span className="text-sm text-gray-600">{riskNumber}/{totalRisks}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-500 transition-all duration-300"
            style={{ width: `${(riskNumber / totalRisks) * 100}%` }}
          />
        </div>
      </div>

      {/* AI 제안 리스크 */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-red-600 mb-1">AI 제안 리스크 #{riskNumber}</div>
            <h3 className="text-gray-900 mb-1">{risk.name}</h3>
          </div>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">
          {risk.description}
        </p>
      </div>

      {/* FMEA 평가 */}
      <div className="space-y-8 mb-8">
        {/* Occurrence (발생도) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-gray-900">
              발생도 (Occurrence)
            </label>
            <span className="text-red-600 text-xl px-3 py-1 bg-red-100 rounded-lg">
              {occurrence}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={occurrence}
            onChange={(e) => setOccurrence(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-red"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>거의 없음 (1)</span>
            <span>매우 높음 (10)</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            이 리스크가 실제로 발생할 가능성은?
          </p>
        </div>

        {/* Severity (심각도) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-gray-900">
              심각도 (Severity)
            </label>
            <span className="text-red-600 text-xl px-3 py-1 bg-red-100 rounded-lg">
              {severity}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={severity}
            onChange={(e) => setSeverity(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-red"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>경미함 (1)</span>
            <span>치명적 (10)</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            발생 시 프로젝트에 미치는 영향은?
          </p>
        </div>

        {/* Detection (검출도) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-gray-900">
              검출도 (Detection)
            </label>
            <span className="text-red-600 text-xl px-3 py-1 bg-red-100 rounded-lg">
              {detection}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={detection}
            onChange={(e) => setDetection(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-red"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>쉽게 발견 (1)</span>
            <span>발견 불가 (10)</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            문제가 발생하기 전에 발견하기 어려운 정도는?
          </p>
        </div>
      </div>

      {/* RPN 계산 결과 */}
      <div className={`${getRPNBgColor(rpn)} border-2 border-current rounded-xl p-5 mb-6`}>
        <div className="text-center">
          <div className="text-sm text-gray-700 mb-2">현재 RPN (위험 우선 순위)</div>
          <div className={`text-5xl mb-2 ${getRPNColor(rpn)}`}>
            {rpn}
          </div>
          <div className="text-xs text-gray-600">
            = {occurrence} × {severity} × {detection}
          </div>
        </div>
      </div>

      {/* 고정 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto flex gap-3">
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors"
            >
              이전
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            {riskNumber < totalRisks ? '다음 리스크' : 'RPN 결과 보기'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
