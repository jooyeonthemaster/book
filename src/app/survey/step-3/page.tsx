'use client'

import { useState, useEffect } from 'react'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'
import { SurveyNavigation } from '@/components/survey/SurveyNavigation'

export default function Step3Page() {
  const { formData, updateFormData, setCurrentStep } = useSurvey()
  const [readingHabits, setReadingHabits] = useState(formData.readingHabits)

  useEffect(() => {
    setCurrentStep(3)
  }, [setCurrentStep])

  const handleNext = () => {
    updateFormData({ readingHabits })
  }

  const isValid = readingHabits.trim().length > 0

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20">
          <SurveyProgress />
          
          <h1 className="lego-text text-3xl md:text-4xl text-center mb-8 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            독서 습관을 알려주세요
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-3 text-pink-300">독서 습관</label>
              <textarea
                value={readingHabits}
                onChange={(e) => setReadingHabits(e.target.value)}
                placeholder="예: 주로 밤에 읽으며, 한 번에 긴 시간 집중해서 읽는 편입니다..."
                className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 h-32 resize-none"
                required
              />
              <div className="text-right text-sm text-white/70 mt-2">
                {readingHabits.length}/500
              </div>
            </div>
          </div>

          <SurveyNavigation 
            onNext={handleNext}
            nextDisabled={!isValid}
          />
        </div>
      </div>
    </div>
  )
}
