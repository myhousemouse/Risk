import { Calendar, TrendingUp, FileText, AlertCircle } from 'lucide-react';
import { Project } from '../App';

interface HistoryProps {
  projects: Project[];
  onViewProject: (project: Project) => void;
}

export function History({ projects, onViewProject }: HistoryProps) {
  const getRiskLevel = (probability: number) => {
    if (probability >= 70) return { label: '매우 높음', color: 'bg-red-100 text-red-600', dotColor: 'bg-red-500' };
    if (probability >= 50) return { label: '높음', color: 'bg-orange-100 text-orange-600', dotColor: 'bg-orange-500' };
    if (probability >= 30) return { label: '보통', color: 'bg-yellow-100 text-yellow-600', dotColor: 'bg-yellow-500' };
    return { label: '낮음', color: 'bg-green-100 text-green-600', dotColor: 'bg-green-500' };
  };

  if (projects.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-gray-900 mb-2">분석 이력이 없습니다</h2>
          <p className="text-gray-600 mb-8">
            첫 프로젝트를 분석하고<br />
            리스크를 관리해보세요
          </p>
          <div className="inline-block px-6 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm">
            홈 화면에서 '새 프로젝트 분석하기'를 눌러 시작하세요
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">분석 이력</h2>
        <p className="text-gray-600">
          총 {projects.length}개의 프로젝트를 분석했습니다
        </p>
      </div>

      {/* 통계 요약 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">평균 실패 확률</div>
            <div className="text-blue-600 text-2xl">
              {(projects.reduce((sum, p) => sum + p.failureProbability, 0) / projects.length).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">총 분석 프로젝트</div>
            <div className="text-indigo-600 text-2xl">{projects.length}개</div>
          </div>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <div className="space-y-3">
        {projects.map((project) => {
          const riskLevel = getRiskLevel(project.failureProbability);
          
          return (
            <button
              key={project.id}
              onClick={() => onViewProject(project)}
              className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all text-left"
            >
              {/* 프로젝트 제목 & 상태 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <div className={`ml-3 flex-shrink-0 w-3 h-3 rounded-full ${riskLevel.dotColor} mt-1`} />
              </div>

              {/* 메트릭 */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-xs text-gray-500 mb-0.5">실패 확률</div>
                  <div className="text-sm text-gray-900">{project.failureProbability.toFixed(1)}%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-xs text-gray-500 mb-0.5">총 RPN</div>
                  <div className="text-sm text-gray-900">{project.totalRPN}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-xs text-gray-500 mb-0.5">예상 손실</div>
                  <div className="text-sm text-gray-900">{project.estimatedLoss.toFixed(0)}만</div>
                </div>
              </div>

              {/* 하단 정보 */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.date).toLocaleDateString('ko-KR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {project.risks.length}개 리스크
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${riskLevel.color}`}>
                  {riskLevel.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 하단 설명 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 프로젝트를 클릭하면 상세 보고서를 다시 확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
