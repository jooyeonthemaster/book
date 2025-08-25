'use client'

import { useSurvey } from '@/contexts/SurveyContext'

export function SurveyProgress() {
  const { currentStep, totalSteps } = useSurvey()
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600 font-semibold font-typewriter text-sm">
          {currentStep} / {totalSteps}
        </span>
        <span className="text-gray-500 text-xs font-typewriter">
          {Math.round(progress)}% 완료
        </span>
      </div>
      
      {/* 미래지향적 진행률 바 */}
      <div className="w-full bg-black/10 rounded-lg h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-black to-gray-800 h-full transition-all duration-500 ease-out relative"
          style={{ 
            width: `${progress}%`,
            animation: 'pulse-glow 3s ease-in-out infinite'
          }}
        >
          {/* 디지털 패턴 효과 */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 3px)'
          }} />
        </div>
      </div>
      
      {/* 단계 표시 점들 */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full border transition-all duration-300 ${
              index + 1 <= currentStep 
                ? 'bg-black border-black' 
                : 'bg-white border-black/20'
            }`}
            style={{
              animation: index + 1 <= currentStep ? `pulse-glow 2s ease-in-out infinite ${index * 0.1}s` : 'none'
            }}
          />
        ))}
      </div>
    </div>
  )
}
