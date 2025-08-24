'use client'

import { useState, useEffect } from 'react'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'
import { SurveyNavigation } from '@/components/survey/SurveyNavigation'

export default function Step7Page() {
  const { formData, updateFormData, setCurrentStep } = useSurvey()
  const [fragrancePreference, setFragrancePreference] = useState(formData.fragrancePreference)

  useEffect(() => {
    setCurrentStep(7)
  }, [setCurrentStep])

  const fragranceOptions = [
    { value: '가볍고 상쾌한 향', emoji: '🌿', description: '시트러스, 허브 계열' },
    { value: '달콤하고 부드러운 향', emoji: '🍯', description: '플로럴, 프루티 계열' },
    { value: '깊고 성숙한 향', emoji: '🌰', description: '우디, 머스크 계열' },
    { value: '강렬하고 개성적인 향', emoji: '🔥', description: '스파이시, 레더 계열' },
    { value: '자연스럽고 편안한 향', emoji: '🌾', description: '아쿠아틱, 그린 계열' },
    { value: '특별하고 독특한 향', emoji: '✨', description: '오리엔탈, 아방가르드 계열' }
  ]

  const handleNext = () => {
    updateFormData({ fragrancePreference })
  }

  const isValid = fragrancePreference

  return (
    <div className="h-screen flex items-center justify-center px-3 py-4 overflow-hidden">
      <div className="max-w-4xl w-full h-full flex flex-col">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl h-full flex flex-col">
          {/* 헤더 섹션 */}
          <div className="flex-shrink-0">
            <SurveyProgress />
            
            <div className="text-center mb-4">
              <h1 className="lego-text text-2xl md:text-3xl mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                선호하는 향기 스타일을 알려주세요
              </h1>
              <p className="text-sm text-white">독서와 함께할 향기 스타일을 선택해주세요</p>
            </div>
          </div>
          
          {/* 메인 콘텐츠 */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden mb-4 pr-2 custom-scrollbar">
            {/* 향기 선택 */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                {fragranceOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFragrancePreference(option.value)}
                    className={`
                      group relative p-4 rounded-xl border transition-all duration-200 text-left
                      ${fragrancePreference === option.value
                        ? 'bg-gradient-to-br from-purple-500 to-pink-600 border-purple-400 text-white shadow-lg'
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
                    
                    {fragrancePreference === option.value && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs text-purple-600">✓</span>
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
            {fragrancePreference && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                  <span className="text-purple-300 font-semibold text-sm">
                    ✨ 향기 스타일 선택 완료
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