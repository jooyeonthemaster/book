'use client'

import { useState, useEffect } from 'react'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'
import { SurveyNavigation } from '@/components/survey/SurveyNavigation'

export default function Step6Page() {
  const { formData, updateFormData, setCurrentStep } = useSurvey()
  const [moodPreference, setMoodPreference] = useState(formData.moodPreference)

  useEffect(() => {
    setCurrentStep(6)
  }, [setCurrentStep])

  const moodOptions = [
    { value: '차분하고 평온한', emoji: '🧘‍♀️', description: '마음의 평화를 찾고 싶어요' },
    { value: '활기차고 에너지 넘치는', emoji: '⚡', description: '활력과 동기부여가 필요해요' },
    { value: '로맨틱하고 감성적인', emoji: '💕', description: '사랑과 감성을 느끼고 싶어요' },
    { value: '지적이고 사색적인', emoji: '🤓', description: '깊이 있는 사고를 하고 싶어요' },
    { value: '신비롭고 몽환적인', emoji: '🌙', description: '꿈같은 세계에 빠지고 싶어요' },
    { value: '자유롭고 모험적인', emoji: '🦋', description: '새로운 경험을 추구해요' }
  ]



  const handleNext = () => {
    updateFormData({ moodPreference })
  }

  const isValid = moodPreference

  return (
    <div className="h-screen flex items-center justify-center px-3 py-4 overflow-hidden">
      <div className="max-w-4xl w-full h-full flex flex-col">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl h-full flex flex-col">
          {/* 헤더 섹션 */}
          <div className="flex-shrink-0">
            <SurveyProgress />
            
            <div className="text-center mb-4">
              <h1 className="lego-text text-2xl md:text-3xl mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                원하는 독서 분위기를 알려주세요
              </h1>
              <p className="text-sm text-white">독서할 때 원하는 분위기를 선택해주세요</p>
            </div>
          </div>
          
          {/* 메인 콘텐츠 */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden mb-4 pr-2 custom-scrollbar">
            {/* 분위기 선택 */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                {moodOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMoodPreference(option.value)}
                    className={`
                      group relative p-4 rounded-xl border transition-all duration-200 text-left
                      ${moodPreference === option.value
                        ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-pink-400 text-white shadow-lg'
                        : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                        {option.emoji}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-base mb-1">{option.value}</div>
                        <div className="text-sm opacity-80">{option.description}</div>
                      </div>
                    </div>
                    
                    {moodPreference === option.value && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs text-pink-600">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 섹션 */}
          <div className="flex-shrink-0">
            {/* 선택 상태 표시 */}
            {moodPreference && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-400/30">
                  <span className="text-pink-300 font-semibold text-sm">
                    ✨ 독서 분위기 선택 완료
                  </span>
                </div>
              </div>
            )}

            <SurveyNavigation 
              onNext={handleNext}
              nextDisabled={!isValid}
            />
          </div>
        </div>
      </div>
    </div>
  )
}