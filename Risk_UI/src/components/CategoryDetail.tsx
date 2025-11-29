import { useState } from 'react';
import { ChevronLeft, DollarSign, TrendingUp, AlertTriangle, Target, Award, Shield } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryDetailProps {
  riskId: number;
  onBack: () => void;
}

interface RiskCostDetail {
  riskId: number;
  riskName: string;
  description: string;
  preventionCost: number;
  occurrenceCost: number;
  lossCost: number;
  probability: number;
  impact: number;
  rpn: number;
  expectedCost: number;
  priority: 'high' | 'medium' | 'low';
  costEffectiveness: 'A' | 'B' | 'C' | 'D';
  preventionActions: string[];
  costBreakdown: {
    category: string;
    amount: number;
    description: string;
  }[];
}

export function CategoryDetail({ riskId, onBack }: CategoryDetailProps) {
  // 리스크별 상세 데이터 (실제로는 props나 API에서 받아옴)
  const riskDetails: Record<number, RiskCostDetail> = {
    1: {
      riskId: 1,
      riskName: '시장 수요 부족',
      description: '목표 고객층의 실제 수요가 예상보다 현저히 낮을 수 있음',
      preventionCost: 1500000,
      occurrenceCost: 3000000,
      lossCost: 15000000,
      probability: 0.6,
      impact: 9,
      rpn: 270,
      expectedCost: 0,
      priority: 'high',
      costEffectiveness: 'A',
      preventionActions: [
        '시장 조사 및 고객 인터뷰 (80만원)',
        'MVP 베타 테스트 (50만원)',
        '경쟁사 분석 보고서 (20만원)'
      ],
      costBreakdown: [
        { category: '예방 비용', amount: 1500000, description: '시장 검증 및 사전 테스트' },
        { category: '발생 비용', amount: 3000000, description: '피봇 및 재마케팅 비용' },
        { category: '손실 비용', amount: 15000000, description: '매출 미달 및 투자금 손실' }
      ]
    },
    2: {
      riskId: 2,
      riskName: '자금 고갈',
      description: '예상치 못한 비용 증가로 인한 운영 자금 부족',
      preventionCost: 800000,
      occurrenceCost: 5000000,
      lossCost: 20000000,
      probability: 0.4,
      impact: 10,
      rpn: 320,
      expectedCost: 0,
      priority: 'high',
      costEffectiveness: 'A',
      preventionActions: [
        '재무 관리 시스템 구축 (50만원)',
        '예비 자금 확보 계획 (20만원)',
        '주간 현금 흐름 모니터링 (10만원)'
      ],
      costBreakdown: [
        { category: '예방 비용', amount: 800000, description: '재무 관리 시스템 구축' },
        { category: '발생 비용', amount: 5000000, description: '긴급 자금 조달 비용' },
        { category: '손실 비용', amount: 20000000, description: '프로젝트 중단 손실' }
      ]
    },
    3: {
      riskId: 3,
      riskName: '핵심 인력 이탈',
      description: '프로젝트 핵심 멤버의 중도 이탈로 인한 진행 차질',
      preventionCost: 2000000,
      occurrenceCost: 4000000,
      lossCost: 8000000,
      probability: 0.3,
      impact: 7,
      rpn: 210,
      expectedCost: 0,
      priority: 'medium',
      costEffectiveness: 'B',
      preventionActions: [
        '스톡옵션 및 인센티브 제공 (150만원)',
        '정기 만족도 조사 및 개선 (30만원)',
        '업무 문서화 시스템 (20만원)'
      ],
      costBreakdown: [
        { category: '예방 비용', amount: 2000000, description: '인센티브 및 복지 개선' },
        { category: '발생 비용', amount: 4000000, description: '신규 채용 및 교육 비용' },
        { category: '손실 비용', amount: 8000000, description: '프로젝트 지연 손실' }
      ]
    }
  };

  const risk = riskDetails[riskId] || riskDetails[1];
  
  // 기대 비용 계산
  const expectedCost = (risk.occurrenceCost + risk.lossCost) * risk.probability;
  const totalCost = risk.preventionCost + risk.occurrenceCost + risk.lossCost;
  const savingsFromPrevention = expectedCost - risk.preventionCost;
  const roi = ((savingsFromPrevention / risk.preventionCost) * 100).toFixed(0);

  // 파이 차트 데이터
  const pieData = [
    { name: '예방 비용', value: risk.preventionCost, color: '#3b82f6' },
    { name: '발생 비용', value: risk.occurrenceCost, color: '#f59e0b' },
    { name: '손실 비용', value: risk.lossCost, color: '#ef4444' }
  ];

  const formatMoney = (amount: number) => {
    return (amount / 10000).toFixed(0) + '만원';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '';
    }
  };

  const getEffectivenessColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="flex-1">리스크 비용 상세</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        {/* 리스크 정보 카드 */}
        <div 
          className="rounded-2xl p-6 mb-6 text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${getPriorityColor(risk.priority)} 0%, ${getPriorityColor(risk.priority)}dd 100%)` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm opacity-90">리스크 #{risk.riskId}</span>
              </div>
              <h2 className="text-white mb-2">{risk.riskName}</h2>
              <p className="text-sm opacity-90 leading-relaxed">
                {risk.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-xs opacity-90 mb-1">RPN</div>
              <div className="text-xl">{risk.rpn}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-xs opacity-90 mb-1">발생률</div>
              <div className="text-xl">{(risk.probability * 100).toFixed(0)}%</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-xs opacity-90 mb-1">영향도</div>
              <div className="text-xl">{risk.impact}/10</div>
            </div>
          </div>
        </div>

        {/* 관리 우선순위 & 비용 효율 등급 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">관리 우선순위</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getPriorityColor(risk.priority) }}
              />
              <span className="text-xl text-gray-900">{getPriorityLabel(risk.priority)}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">비용 효율 등급</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 ${getEffectivenessColor(risk.costEffectiveness)} rounded-lg flex items-center justify-center text-white font-semibold`}>
                {risk.costEffectiveness}
              </div>
              <span className="text-sm text-gray-600">
                {risk.costEffectiveness === 'A' ? '매우 효율적' :
                 risk.costEffectiveness === 'B' ? '효율적' :
                 risk.costEffectiveness === 'C' ? '보통' : '비효율적'}
              </span>
            </div>
          </div>
        </div>

        {/* 비용 구성 비율 */}
        <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-900 mb-4">비용 구성 비율</h3>
          
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => formatMoney(value)}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {risk.costBreakdown.map((item, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: pieData[index].color }}
                    />
                    <span className="text-sm text-gray-900">{item.category}</span>
                  </div>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
                <div className="text-sm text-gray-900 ml-2">
                  {formatMoney(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 기대 비용 계산 */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-red-600" />
            <h3 className="text-gray-900">기대 비용 계산</h3>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">발생 확률</div>
              <div className="text-2xl text-gray-900">{(risk.probability * 100).toFixed(0)}%</div>
            </div>

            <div className="bg-white rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">리스크 발생 시 총 비용</div>
              <div className="text-sm text-gray-600 mb-2">
                발생 비용 + 손실 비용
              </div>
              <div className="text-2xl text-orange-600">
                {formatMoney(risk.occurrenceCost + risk.lossCost)}
              </div>
            </div>

            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-3">
              <div className="text-xs text-gray-700 mb-1">기대 비용 (Expected Cost)</div>
              <div className="text-sm text-gray-700 mb-2">
                = 발생 시 총 비용 × 발생 확률
              </div>
              <div className="text-3xl text-red-600">
                {formatMoney(expectedCost)}
              </div>
            </div>
          </div>
        </div>

        {/* 예방 투자 효과 */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="text-gray-900">예방 투자 효과</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">예방 투자 비용</span>
              <span className="text-xl text-blue-600">{formatMoney(risk.preventionCost)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">기대 비용 (예방 없이)</span>
              <span className="text-xl text-red-600">{formatMoney(expectedCost)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-100 border-2 border-green-300 rounded-lg">
              <div>
                <div className="text-sm text-gray-700 mb-1">예방으로 절감 가능</div>
                <div className="text-xs text-gray-600">ROI: {roi}%</div>
              </div>
              <span className="text-2xl text-green-600">{formatMoney(savingsFromPrevention)}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              💡 예방에 <span className="text-blue-600 font-semibold">{formatMoney(risk.preventionCost)}</span> 투자하면<br />
              <span className="text-green-600 font-semibold">{formatMoney(savingsFromPrevention)}</span> 절감 가능 
              (투자 대비 <span className="font-semibold">{roi}%</span> 효과)
            </p>
          </div>
        </div>

        {/* 예방 조치 항목 */}
        <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-900 mb-4">구체적 예방 조치</h3>
          
          <div className="space-y-2">
            {risk.preventionActions.map((action, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700 flex-1">{action}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              위 조치들을 실행하면 리스크 발생 확률을 크게 낮출 수 있습니다
            </p>
          </div>
        </div>

        {/* 권장 사항 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-gray-900 mb-2">💡 관리 권장사항</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 예방 비용 대비 효과가 {roi}%로 
                  {parseInt(roi) > 300 ? '매우 높습니다' : 
                   parseInt(roi) > 100 ? '높습니다' : '적정합니다'}
                </li>
                <li>• 우선순위 '{getPriorityLabel(risk.priority)}'로 
                  {risk.priority === 'high' ? '즉시 관리가 필요합니다' :
                   risk.priority === 'medium' ? '주의 깊은 관리가 필요합니다' :
                   '지속적인 모니터링이 필요합니다'}
                </li>
                <li>• 비용 효율 등급 {risk.costEffectiveness}로 
                  {risk.costEffectiveness === 'A' ? '예방 투자를 강력히 권장합니다' :
                   risk.costEffectiveness === 'B' ? '예방 투자가 권장됩니다' :
                   '신중한 검토가 필요합니다'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
