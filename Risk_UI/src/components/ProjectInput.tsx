import { useState } from 'react';
import { Rocket } from 'lucide-react';

interface ProjectInputProps {
  onSubmit: (title: string, description: string, budget: number) => void;
}

export function ProjectInput({ onSubmit }: ProjectInputProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && budget) {
      onSubmit(title, description, parseFloat(budget));
    }
  };

  const isValid = title.trim() && description.trim() && budget && parseFloat(budget) > 0;

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <Rocket className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-gray-900 mb-2">프로젝트 정보 입력</h2>
        <p className="text-gray-600">
          분석할 프로젝트나 아이디어를<br />
          자세히 설명해주세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 프로젝트 제목 */}
        <div>
          <label className="block text-gray-700 mb-2">
            프로젝트 제목 *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 온라인 교육 플랫폼 런칭"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
          />
        </div>

        {/* 프로젝트 설명 */}
        <div>
          <label className="block text-gray-700 mb-2">
            프로젝트 설명 *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="프로젝트의 목표, 대상 고객, 주요 기능 등을 구체적으로 작성해주세요."
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            상세할수록 더 정확한 리스크 분석이 가능합니다
          </p>
        </div>

        {/* 예산 */}
        <div>
          <label className="block text-gray-700 mb-2">
            투입 예산 (만원) *
          </label>
          <div className="relative">
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="5000"
              min="0"
              step="100"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              만원
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            실패 시 예상 손실을 계산하는 데 사용됩니다
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">다음 단계:</span> AI가 귀하의 프로젝트를 분석하여 
            가장 중요한 3가지 리스크를 제안합니다.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl transition-colors"
        >
          리스크 분석 시작
        </button>
      </form>
    </div>
  );
}
