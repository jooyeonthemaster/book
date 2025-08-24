'use client'

import { useState, useEffect } from 'react'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'
import { SurveyNavigation } from '@/components/survey/SurveyNavigation'

export default function Step5Page() {
  const { formData, updateFormData, setCurrentStep } = useSurvey()
  const [currentMood, setCurrentMood] = useState(formData.currentMood)

  useEffect(() => {
    setCurrentStep(5)
  }, [setCurrentStep])

  const moods = [
    { value: '평온한', emoji: '😌', description: '마음이 고요하고 평화로운' },
    { value: '활기찬', emoji: '😄', description: '에너지가 넘치고 활동적인' },
    { value: '우울한', emoji: '😔', description: '기분이 가라앉고 침울한' },
    { value: '스트레스받는', emoji: '😰', description: '긴장되고 압박감을 느끼는' },
    { value: '설레는', emoji: '🥰', description: '기대감과 흥분으로 가득한' },
    { value: '사색적인', emoji: '🤔', description: '깊이 생각하고 성찰하는' }
  ]

  const handleNext = () => {
    updateFormData({ currentMood })
  }

  const isValid = currentMood !== ''

  return (
    <div className="h-screen flex items-center justify-center px-3 py-4 overflow-hidden">
      <div className="max-w-4xl w-full h-full flex flex-col">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl h-full flex flex-col">
          {/* 헤더 섹션 - 컴팩트 */}
          <div className="flex-shrink-0">
            <SurveyProgress />
            
            <div className="text-center mb-4">
              <h1 className="lego-text text-2xl md:text-3xl mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                현재 기분은 어떠신가요?
              </h1>
              <p className="text-sm text-white">지금 이 순간의 감정을 선택해주세요</p>
            </div>
          </div>
          
          {/* 메인 콘텐츠 - 스크롤 가능 */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden mb-4 pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-x-2 gap-y-4 px-1">
              {moods.map(mood => {
                const isSelected = currentMood === mood.value
                return (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setCurrentMood(mood.value)}
                    className={`
                      group relative p-3 rounded-xl border transition-all duration-300 text-left
                      ${isSelected
                        ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-pink-400 text-white shadow-lg'
                        : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                        {mood.emoji}
                      </span>
                      <div className="flex-1">
                        <div className={`font-semibold text-base ${
                          isSelected ? 'text-white' : 'text-white'
                        }`}>
                          {mood.value}
                        </div>
                        <div className={`text-sm ${
                          isSelected ? 'text-white/80' : 'text-white/90'
                        }`}>
                          {mood.description}
                        </div>
                      </div>
                    </div>
                    
                    {/* 선택 표시 */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs text-pink-600">✓</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 하단 섹션 - 고정 */}
          <div className="flex-shrink-0">
            {/* 선택된 기분 표시 - 컴팩트 */}
            {currentMood && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-400/30">
                  <span className="text-pink-300 font-semibold text-sm">
                    현재 기분
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {moods.find(m => m.value === currentMood)?.emoji}
                    </span>
                    <span className="text-white text-sm font-medium">
                      {currentMood}
                    </span>
                  </div>
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
