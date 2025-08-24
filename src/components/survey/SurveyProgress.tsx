'use client'

import { useSurvey } from '@/contexts/SurveyContext'

export function SurveyProgress() {
  const { currentStep, totalSteps } = useSurvey()
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-pink-300 font-semibold">
          {currentStep} / {totalSteps}
        </span>
        <span className="text-purple-300 text-sm">
          {Math.round(progress)}% 완료
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-pink-400 to-purple-400 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
