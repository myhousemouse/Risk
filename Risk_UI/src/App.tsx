import { useState } from 'react';
import { Home } from './components/Home';
import { ProjectInput } from './components/ProjectInput';
import { RiskInput } from './components/RiskInput';
import { RPNResults } from './components/RPNResults';
import { AIActions } from './components/AIActions';
import { Report } from './components/Report';
import { History } from './components/History';
import { Header } from './components/Header';
import { MoneyAnalysis } from './components/MoneyAnalysis';
import { CategoryDetail } from './components/CategoryDetail';
import { BottomNav } from './components/BottomNav';

export interface Risk {
  id: number;
  name: string;
  description: string;
  occurrence: number;
  severity: number;
  detection: number;
  rpn: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  date: string;
  risks: Risk[];
  totalRPN: number;
  failureProbability: number;
  estimatedLoss: number;
}

export interface RiskCost {
  riskId: number;
  riskName: string;
  preventionCost: number;  // 예방 비용
  occurrenceCost: number;  // 발생 비용 (복구)
  lossCost: number;        // 손실 비용
  probability: number;     // 발생 확률 (0-1)
  impact: number;          // 영향도 (1-10)
  expectedCost: number;    // 기대 비용
  priority: 'high' | 'medium' | 'low';
  costEffectiveness: 'A' | 'B' | 'C' | 'D';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'risk' | 'money'>('risk');
  const [screen, setScreen] = useState<string>('home');
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [currentRiskIndex, setCurrentRiskIndex] = useState(0);
  const [history, setHistory] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleProjectSubmit = (title: string, description: string, budget: number) => {
    // AI가 제안한 3개의 리스크 (실제로는 AI API 호출)
    const suggestedRisks: Risk[] = [
      {
        id: 1,
        name: '시장 수요 부족',
        description: '목표 고객층의 실제 수요가 예상보다 현저히 낮을 수 있음',
        occurrence: 5,
        severity: 5,
        detection: 5,
        rpn: 125
      },
      {
        id: 2,
        name: '자금 고갈',
        description: '예상치 못한 비용 증가로 인한 운영 자금 부족',
        occurrence: 5,
        severity: 5,
        detection: 5,
        rpn: 125
      },
      {
        id: 3,
        name: '핵심 인력 이탈',
        description: '프로젝트 핵심 멤버의 중도 이탈로 인한 진행 차질',
        occurrence: 5,
        severity: 5,
        detection: 5,
        rpn: 125
      }
    ];

    setCurrentProject({
      title,
      description,
      budget,
      risks: suggestedRisks,
      date: new Date().toISOString()
    });
    setCurrentRiskIndex(0);
    setScreen('risk-input');
  };

  const handleRiskUpdate = (riskId: number, occurrence: number, severity: number, detection: number) => {
    const rpn = occurrence * severity * detection;
    const updatedRisks = currentProject.risks!.map(risk =>
      risk.id === riskId
        ? { ...risk, occurrence, severity, detection, rpn }
        : risk
    );
    setCurrentProject({ ...currentProject, risks: updatedRisks });
  };

  const handleNextRisk = () => {
    if (currentRiskIndex < 2) {
      setCurrentRiskIndex(currentRiskIndex + 1);
    } else {
      // 모든 리스크 입력 완료 - RPN 계산
      const totalRPN = currentProject.risks!.reduce((sum, risk) => sum + risk.rpn, 0);
      const avgRPN = totalRPN / 3;
      const failureProbability = Math.min((avgRPN / 1000) * 100, 95);
      const estimatedLoss = (currentProject.budget! * failureProbability) / 100;
      
      setCurrentProject({
        ...currentProject,
        totalRPN,
        failureProbability,
        estimatedLoss
      });
      setScreen('rpn-results');
    }
  };

  const handlePreviousRisk = () => {
    if (currentRiskIndex > 0) {
      setCurrentRiskIndex(currentRiskIndex - 1);
    }
  };

  const handleSaveProject = () => {
    const finalProject: Project = {
      ...currentProject,
      id: Date.now().toString()
    } as Project;
    
    setHistory([finalProject, ...history]);
    setScreen('home');
    setCurrentProject({});
    setCurrentRiskIndex(0);
  };

  const handleViewProject = (project: Project) => {
    setCurrentProject(project);
    setScreen('report');
  };

  const handleRiskCostClick = (riskId: number) => {
    setSelectedCategory(riskId.toString());
    setScreen('risk-cost-detail');
  };

  const isInFlow = screen !== 'home' && screen !== 'money-analysis' && screen !== 'history';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {(screen !== 'home' && screen !== 'money-analysis' && screen !== 'category-detail') && (
        <Header 
          title={
            screen === 'project-input' ? '새 프로젝트' :
            screen === 'risk-input' ? `리스크 ${currentRiskIndex + 1}/3` :
            screen === 'rpn-results' ? 'RPN 분석 결과' :
            screen === 'ai-actions' ? 'AI 실행 조언' :
            screen === 'report' ? '최종 보고서' :
            screen === 'history' ? '분석 이력' : ''
          }
          onBack={() => {
            if (screen === 'risk-input' && currentRiskIndex > 0) {
              handlePreviousRisk();
            } else if (screen === 'project-input' || screen === 'history') {
              setScreen('home');
            } else if (screen === 'risk-input') {
              setScreen('project-input');
            } else if (screen === 'rpn-results') {
              setScreen('risk-input');
            } else if (screen === 'ai-actions') {
              setScreen('rpn-results');
            } else if (screen === 'report') {
              setScreen('ai-actions');
            } else {
              setScreen('home');
            }
          }}
        />
      )}
      
      {screen === 'home' && (
        <Home 
          onNewProject={() => setScreen('project-input')}
          onViewHistory={() => setScreen('history')}
          projectCount={history.length}
        />
      )}
      
      {screen === 'project-input' && (
        <ProjectInput onSubmit={handleProjectSubmit} />
      )}
      
      {screen === 'risk-input' && currentProject.risks && (
        <RiskInput
          risk={currentProject.risks[currentRiskIndex]}
          riskNumber={currentRiskIndex + 1}
          totalRisks={3}
          onUpdate={handleRiskUpdate}
          onNext={handleNextRisk}
          onPrevious={currentRiskIndex > 0 ? handlePreviousRisk : undefined}
        />
      )}
      
      {screen === 'rpn-results' && (
        <RPNResults
          project={currentProject as Project}
          onNext={() => setScreen('ai-actions')}
        />
      )}
      
      {screen === 'ai-actions' && (
        <AIActions
          project={currentProject as Project}
          onNext={() => setScreen('report')}
        />
      )}
      
      {screen === 'report' && (
        <Report
          project={currentProject as Project}
          onSave={handleSaveProject}
          onBack={() => setScreen('ai-actions')}
        />
      )}
      
      {screen === 'history' && (
        <History
          projects={history}
          onViewProject={handleViewProject}
        />
      )}
      
      {screen === 'money-analysis' && (
        <MoneyAnalysis onRiskClick={handleRiskCostClick} />
      )}
      
      {screen === 'risk-cost-detail' && selectedCategory && (
        <CategoryDetail 
          riskId={parseInt(selectedCategory)}
          onBack={() => setScreen('money-analysis')}
        />
      )}
      
      {!isInFlow && (
        <BottomNav 
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'risk') {
              setScreen('home');
            } else if (tab === 'money') {
              setScreen('money-analysis');
            }
          }}
        />
      )}
    </div>
  );
}
