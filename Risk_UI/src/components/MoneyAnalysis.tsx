import { useState } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';

interface MoneyAnalysisProps {
  onRiskClick: (riskId: number) => void;
}

interface RiskCost {
  riskId: number;
  riskName: string;
  preventionCost: number;
  occurrenceCost: number;
  lossCost: number;
  probability: number;
  impact: number;
  expectedCost: number;
  priority: 'high' | 'medium' | 'low';
  costEffectiveness: 'A' | 'B' | 'C' | 'D';
}

export function MoneyAnalysis({ onRiskClick }: MoneyAnalysisProps) {
  // 샘플 리스크 비용 데이터
  const [riskCosts] = useState<RiskCost[]>([
    {
      riskId: 1,
      riskName: '시장 수요 부족',
      preventionCost: 1500000,    // 시장 조사 비용
      occurrenceCost: 3000000,    // 피봇/마케팅 비용
      lossCost: 15000000,         // 매출 손실
      probability: 0.6,           // 60%
      impact: 9,
      expectedCost: 0,
      priority: 'high',
      costEffectiveness: 'A'
    },
    {
      riskId: 2,
      riskName: '자금 고갈',
      preventionCost: 800000,     // 재무 관리 시스템
      occurrenceCost: 5000000,    // 긴급 자금 조달
      lossCost: 20000000,         // 프로젝트 중단
      probability: 0.4,           // 40%
      impact: 10,
      expectedCost: 0,
      priority: 'high',
      costEffectiveness: 'A'
    },
    {
      riskId: 3,
      riskName: '핵심 인력 이탈',
      preventionCost: 2000000,    // 인센티브/복지
      occurrenceCost: 4000000,    // 신규 채용/교육
      lossCost: 8000000,          // 프로젝트 지연
      probability: 0.3,           // 30%
      impact: 7,
      expectedCost: 0,
      priority: 'medium',
      costEffectiveness: 'B'
    }
  ]);

  // 기대 비용 계산 (발생 확률 * 총 비용)
  const costsWithExpected = riskCosts.map(risk => ({
    ...risk,
    expectedCost: (risk.occurrenceCost + risk.lossCost) * risk.probability
  }));

  const totalPreventionCost = costsWithExpected.reduce((sum, r) => sum + r.preventionCost, 0);
  const totalExpectedCost = costsWithExpected.reduce((sum, r) => sum + r.expectedCost, 0);
  const highestRisk = costsWithExpected.reduce((max, r) => 
    r.expectedCost > max.expectedCost ? r : max
  );
  const costImpactRatio = (totalPreventionCost / totalExpectedCost * 100).toFixed(1);

  // Bar Chart 데이터
  const barChartData = costsWithExpected.map(risk => ({
    name: risk.riskName.length > 8 ? risk.riskName.substring(0, 8) + '...' : risk.riskName,
    예방: risk.preventionCost / 10000,
    발생: risk.occurrenceCost / 10000,
    손실: risk.lossCost / 10000,
    기대비용: risk.expectedCost / 10000
  }));

  // 비용-영향도 버블 차트 데이터
  const bubbleData = costsWithExpected.map(risk => ({
    x: risk.impact,
    y: risk.expectedCost / 10000,
    z: risk.preventionCost / 10000,
    name: risk.riskName,
    riskId: risk.riskId,
    priority: risk.priority
  }));

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

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">리스크 비용 분석</h1>
        <p className="text-gray-600">
          예방·발생·손실 비용을 분석하여<br />
          효율적인 리스크 관리 전략을 수립하세요
        </p>
      </div>

      {/* 전체 리스크 예상 비용 요약 카드 3개 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* 총 예방 비용 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4" />
          </div>
          <div className="text-xs mb-1 opacity-90">예방 비용</div>
          <div className="text-lg">{formatMoney(totalPreventionCost)}</div>
        </div>

        {/* 총 기대 비용 */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xs mb-1 opacity-90">기대 비용</div>
          <div className="text-lg">{formatMoney(totalExpectedCost)}</div>
        </div>

        {/* 비용 대비 영향도 */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-xs mb-1 opacity-90">예방 효율</div>
          <div className="text-lg">{costImpactRatio}%</div>
        </div>
      </div>

      {/* 최고 비용 리스크 알림 */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">💰 최고 비용 리스크</h3>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-red-600">{highestRisk.riskName}</span>의 기대 비용이{' '}
              <span className="font-semibold">{formatMoney(highestRisk.expectedCost)}</span>로 
              가장 높습니다. 우선적으로 관리가 필요합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 비용 구조 카드 */}
      <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-gray-200">
        <h3 className="text-gray-900 mb-4">전체 비용 구조</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <div className="text-sm text-gray-600 mb-1">예방 비용 (사전 투자)</div>
              <p className="text-xs text-gray-500">리스크 발생을 막기 위한 비용</p>
            </div>
            <div className="text-blue-600 text-xl">
              {formatMoney(totalPreventionCost)}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div>
              <div className="text-sm text-gray-600 mb-1">복구 비용 (발생 시)</div>
              <p className="text-xs text-gray-500">리스크 발생 후 복구 비용</p>
            </div>
            <div className="text-orange-600 text-xl">
              {formatMoney(costsWithExpected.reduce((sum, r) => sum + r.occurrenceCost, 0))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div>
              <div className="text-sm text-gray-600 mb-1">손실 비용 (최악의 경우)</div>
              <p className="text-xs text-gray-500">프로젝트 실패로 인한 손실</p>
            </div>
            <div className="text-red-600 text-xl">
              {formatMoney(costsWithExpected.reduce((sum, r) => sum + r.lossCost, 0))}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">예방 투자 대비 절감 효과</div>
            <div className="text-green-600 text-2xl">
              {formatMoney(totalExpectedCost - totalPreventionCost)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              예방에 투자하면 <span className="font-semibold text-green-600">
                {((1 - totalPreventionCost / totalExpectedCost) * 100).toFixed(0)}%
              </span> 절감 가능
            </p>
          </div>
        </div>
      </div>

      {/* 리스크별 비용 Bar Chart */}
      <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-gray-200">
        <h3 className="text-gray-900 mb-4">리스크별 비용 분석</h3>
        
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
                tickFormatter={(value) => value + '만'}
              />
              <Tooltip 
                formatter={(value: any) => value + '만원'}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
              <Bar dataKey="예방" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="발생" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="손실" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 범례 */}
        <div className="flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-gray-600">예방</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded" />
            <span className="text-gray-600">발생</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-gray-600">손실</span>
          </div>
        </div>
      </div>

      {/* 비용-영향도 버블 차트 */}
      <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-gray-200">
        <h3 className="text-gray-900 mb-2">비용-영향도 분석</h3>
        <p className="text-sm text-gray-600 mb-4">
          버블 크기 = 예방 비용 / 오른쪽 상단 = 우선 관리 필요
        </p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="영향도"
                domain={[0, 10]}
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
                label={{ value: '영향도 →', position: 'bottom', fontSize: 11, fill: '#6b7280' }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="기대 비용"
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
                tickFormatter={(value) => value + '만'}
                label={{ value: '기대 비용 ↑', angle: -90, position: 'left', fontSize: 11, fill: '#6b7280' }}
              />
              <ZAxis type="number" dataKey="z" range={[100, 400]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                        <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
                        <p className="text-sm text-gray-600">영향도: {data.x}</p>
                        <p className="text-sm text-gray-600">기대 비용: {data.y}만원</p>
                        <p className="text-sm text-gray-600">예방 비용: {data.z}만원</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={bubbleData}>
                {bubbleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getPriorityColor(entry.priority)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 리스크별 상세 */}
      <div className="mb-6">
        <h3 className="text-gray-900 mb-4">리스크별 상세 비용</h3>
        
        <div className="space-y-3">
          {costsWithExpected
            .sort((a, b) => b.expectedCost - a.expectedCost)
            .map((risk, index) => {
              const savingsRate = ((1 - risk.preventionCost / risk.expectedCost) * 100).toFixed(0);
              
              return (
                <button
                  key={risk.riskId}
                  onClick={() => onRiskClick(risk.riskId)}
                  className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ${
                        index === 0 ? 'bg-red-500' :
                        index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1">{risk.riskName}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs text-white`}
                            style={{ backgroundColor: getPriorityColor(risk.priority) }}>
                            우선순위: {getPriorityLabel(risk.priority)}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            효율 {risk.costEffectiveness}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-600 mb-1">예방</div>
                      <div className="text-sm text-blue-600">{formatMoney(risk.preventionCost)}</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-600 mb-1">발생</div>
                      <div className="text-sm text-orange-600">{formatMoney(risk.occurrenceCost)}</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-600 mb-1">손실</div>
                      <div className="text-sm text-red-600">{formatMoney(risk.lossCost)}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">기대 비용 (확률 {(risk.probability * 100).toFixed(0)}%)</span>
                      <span className="text-red-600 font-semibold">{formatMoney(risk.expectedCost)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600">예방 투자 효과</span>
                      <span className="text-green-600 font-semibold">{savingsRate}% 절감</span>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <span className="font-semibold">분석 팁:</span><br />
          • 예방 비용 &lt; 기대 비용 → 예방 투자가 효율적<br />
          • 우선순위 '높음' 리스크를 먼저 관리<br />
          • 비용 효율 등급 A가 가장 효과적
        </p>
      </div>
    </div>
  );
}
