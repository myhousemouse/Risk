import { Lightbulb, CheckCircle2, ArrowRight, Target } from 'lucide-react';
import { Project } from '../App';

interface AIActionsProps {
  project: Project;
  onNext: () => void;
}

interface Action {
  riskId: number;
  riskName: string;
  actions: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
  }[];
}

export function AIActions({ project, onNext }: AIActionsProps) {
  // AI가 제안한 실행 조치들 (실제로는 AI API 호출)
  const aiActions: Action[] = [
    {
      riskId: 1,
      riskName: '시장 수요 부족',
      actions: [
        {
          title: '최소 기능 제품(MVP) 사전 테스트',
          description: '정식 출시 전 타겟 고객 100명 대상으로 베타 테스트를 진행하여 실제 수요를 검증하세요. 사전 예약 또는 얼리버드 프로그램을 통해 구매 의사를 확인할 수 있습니다.',
          impact: 'high',
          effort: 'medium'
        },
        {
          title: '경쟁사 및 시장 분석 강화',
          description: '최소 5개 이상의 경쟁 제품/서비스를 분석하고, 목표 시장의 규모와 성장률을 정량적으로 파악하세요. 기존 고객 인터뷰를 통해 실제 pain point를 확인하세요.',
          impact: 'high',
          effort: 'low'
        },
        {
          title: '피봇 전략 수립',
          description: '초기 가정이 틀렸을 경우를 대비한 대안 시나리오를 2-3개 준비하세요. 각 시나리오별 전환 기준점(예: 3개월 내 매출 목표 미달성)을 명확히 설정하세요.',
          impact: 'medium',
          effort: 'medium'
        }
      ]
    },
    {
      riskId: 2,
      riskName: '자금 고갈',
      actions: [
        {
          title: '주간 현금 흐름 모니터링',
          description: '매주 실제 지출과 예산을 비교하는 대시보드를 구축하세요. 예산 대비 10% 초과 시 즉시 경고 알람을 받을 수 있도록 설정하세요.',
          impact: 'high',
          effort: 'low'
        },
        {
          title: '긴급 자금 확보 계획',
          description: '런웨이(Runway) 3개월 전에 추가 투자 유치 또는 대출 신청을 시작하세요. 예비 투자자 리스트를 미리 확보하고, 정기적으로 관계를 유지하세요.',
          impact: 'high',
          effort: 'high'
        },
        {
          title: '고정비 최적화',
          description: '인건비, 임대료 등 고정비를 변동비로 전환할 수 있는 방법을 모색하세요. 외주, 리모트 근무, 공유 오피스 등을 고려하세요.',
          impact: 'medium',
          effort: 'medium'
        }
      ]
    },
    {
      riskId: 3,
      riskName: '핵심 인력 이탈',
      actions: [
        {
          title: '핵심 인력 유지 계획',
          description: '핵심 멤버에게 스톡옵션, 성과급 등 장기 인센티브를 제공하세요. 분기별 1:1 미팅을 통해 불만 사항을 사전에 파악하고 해결하세요.',
          impact: 'high',
          effort: 'medium'
        },
        {
          title: '지식 문서화 및 백업 인력',
          description: '핵심 업무 프로세스를 문서화하고, 각 역할에 대한 백업 인력을 지정하세요. 정기적인 크로스 트레이닝을 통해 업무 연속성을 확보하세요.',
          impact: 'high',
          effort: 'high'
        },
        {
          title: '조기 경고 시스템',
          description: '팀원의 근무 만족도를 월 1회 익명 설문으로 측정하세요. 만족도 급락 시 즉시 원인을 파악하고 대응하세요.',
          impact: 'medium',
          effort: 'low'
        }
      ]
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'bg-purple-100 text-purple-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      case 'low': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'high': return '효과 높음';
      case 'medium': return '효과 보통';
      case 'low': return '효과 낮음';
      default: return '';
    }
  };

  const getEffortLabel = (effort: string) => {
    switch (effort) {
      case 'high': return '노력 많음';
      case 'medium': return '노력 보통';
      case 'low': return '노력 적음';
      default: return '';
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 pb-32">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <Lightbulb className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-gray-900 mb-2">AI 실행 조언</h2>
        <p className="text-gray-600">
          각 리스크를 낮추기 위한<br />
          구체적인 실행 방안입니다
        </p>
      </div>

      {/* 조언 요약 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-gray-900 mb-1">RPN 감소 목표</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              아래 조치들을 실행하면 평균 RPN을 <span className="text-blue-600">30-50% 감소</span>시킬 수 있습니다. 
              특히 '효과 높음' 태그가 붙은 조치를 우선적으로 실행하세요.
            </p>
          </div>
        </div>
      </div>

      {/* 리스크별 조치 */}
      <div className="space-y-6">
        {aiActions.map((riskAction, riskIndex) => (
          <div key={riskAction.riskId}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                riskIndex === 0 ? 'bg-red-500' :
                riskIndex === 1 ? 'bg-orange-500' : 'bg-yellow-500'
              }`}>
                {riskIndex + 1}
              </div>
              <h3 className="text-gray-900">{riskAction.riskName}</h3>
            </div>

            <div className="space-y-3 ml-8">
              {riskAction.actions.map((action, actionIndex) => (
                <div 
                  key={actionIndex}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-gray-900 mb-2">
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs ${getImpactColor(action.impact)}`}>
                      {getImpactLabel(action.impact)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs ${getEffortColor(action.effort)}`}>
                      {getEffortLabel(action.effort)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 우선순위 팁 */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          💡 <span className="font-semibold">추천 실행 순서:</span><br />
          1. '효과 높음 + 노력 적음' 조치부터 시작<br />
          2. '효과 높음 + 노력 많음' 조치를 계획<br />
          3. 나머지 조치는 여유가 있을 때 실행
        </p>
      </div>

      {/* 고정 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={onNext}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            최종 보고서 보기
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
