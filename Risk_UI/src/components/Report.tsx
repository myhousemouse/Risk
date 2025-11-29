import { FileText, Download, Save, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { Project } from '../App';

interface ReportProps {
  project: Project;
  onSave: () => void;
  onBack: () => void;
}

export function Report({ project, onSave, onBack }: ReportProps) {
  const { title, description, budget, date, risks, totalRPN, failureProbability, estimatedLoss } = project;

  const handleDownloadPDF = () => {
    // PDF 다운로드 로직 (실제로는 PDF 생성 라이브러리 필요)
    alert('PDF 다운로드 기능은 실제 구현 시 jsPDF 또는 html2pdf 라이브러리를 사용합니다.');
  };

  const getRiskLevel = (probability: number) => {
    if (probability >= 70) return { label: '매우 높음', color: 'text-red-600' };
    if (probability >= 50) return { label: '높음', color: 'text-orange-600' };
    if (probability >= 30) return { label: '보통', color: 'text-yellow-600' };
    return { label: '낮음', color: 'text-green-600' };
  };

  const riskLevel = getRiskLevel(failureProbability);

  return (
    <div className="max-w-md mx-auto px-6 py-8 pb-32">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-gray-900 mb-2">최종 분석 보고서</h2>
        <p className="text-gray-600">
          프로젝트 리스크 분석 결과를<br />
          종합한 보고서입니다
        </p>
      </div>

      {/* 보고서 컨테이너 */}
      <div id="report-content" className="bg-white border-2 border-gray-300 rounded-2xl p-6 mb-6 shadow-sm">
        {/* 프로젝트 정보 */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-gray-900 mb-4">프로젝트 정보</h3>
          
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500 mb-1">제목</div>
              <div className="text-gray-900">{title}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">설명</div>
              <div className="text-gray-700 text-sm leading-relaxed">{description}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <div className="text-xs text-gray-500">투입 예산</div>
                </div>
                <div className="text-gray-900">{budget.toLocaleString()} 만원</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div className="text-xs text-gray-500">분석 일시</div>
                </div>
                <div className="text-gray-900 text-sm">
                  {new Date(date).toLocaleDateString('ko-KR')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 종합 분석 결과 */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-gray-900 mb-4">종합 분석 결과</h3>
          
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-700 mb-2">예상 실패 확률</div>
              <div className={`text-5xl mb-2 ${riskLevel.color}`}>
                {failureProbability.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">{riskLevel.label}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">총 RPN</div>
              <div className="text-red-600 text-2xl">{totalRPN}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">예상 손실</div>
              <div className="text-orange-600 text-2xl">
                {estimatedLoss.toFixed(0)}
                <span className="text-sm ml-1">만원</span>
              </div>
            </div>
          </div>
        </div>

        {/* 리스크 상세 */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-gray-900 mb-4">주요 리스크 (Top 3)</h3>
          
          <div className="space-y-3">
            {risks.sort((a, b) => b.rpn - a.rpn).map((risk, index) => (
              <div key={risk.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 ${
                    index === 0 ? 'bg-red-500' :
                    index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">{risk.name}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {risk.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                  <div className="flex gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">발생도:</span>
                      <span className="ml-1 text-gray-900">{risk.occurrence}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">심각도:</span>
                      <span className="ml-1 text-gray-900">{risk.severity}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">검출도:</span>
                      <span className="ml-1 text-gray-900">{risk.detection}</span>
                    </div>
                  </div>
                  <div className="text-red-600 text-sm">
                    RPN {risk.rpn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 권장 사항 */}
        <div>
          <h3 className="text-gray-900 mb-4">핵심 권장 사항</h3>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                AI가 제안한 실행 조치를 즉시 실행하여 RPN을 낮추세요
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                '효과 높음' 태그가 붙은 조치를 우선적으로 실행하세요
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                매주 리스크 상태를 재평가하고 필요시 조치를 수정하세요
              </p>
            </div>
          </div>
        </div>

        {/* 워터마크 */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <div className="text-xs text-gray-400">
            Generated by Risk Manager • {new Date(date).toLocaleString('ko-KR')}
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="space-y-3 mb-6">
        <button
          onClick={handleDownloadPDF}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border-2 border-gray-300"
        >
          <Download className="w-5 h-5" />
          PDF로 내보내기
        </button>
      </div>

      {/* 고정 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={onSave}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-5 h-5" />
            저장하고 완료
          </button>
        </div>
      </div>
    </div>
  );
}
