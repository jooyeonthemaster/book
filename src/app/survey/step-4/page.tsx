'use client'

import { useState, useEffect } from 'react'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'
import { SurveyNavigation } from '@/components/survey/SurveyNavigation'

export default function Step4Page() {
  const { formData, updateFormData, setCurrentStep } = useSurvey()
  const [personalityTraits, setPersonalityTraits] = useState<string[]>(formData.personalityTraits)

  useEffect(() => {
    setCurrentStep(4)
  }, [setCurrentStep])

  const personalities = [
    { name: '내향적', icon: '🤫' },
    { name: '외향적', icon: '🎉' },
    { name: '감성적', icon: '💝' },
    { name: '이성적', icon: '🧠' },
    { name: '모험적', icon: '🏔️' },
    { name: '안정적', icon: '🏠' },
    { name: '창의적', icon: '🎨' },
    { name: '실용적', icon: '🔧' },
    { name: '완벽주의', icon: '✨' },
    { name: '자유로운', icon: '🦋' },
    { name: '계획적', icon: '📋' },
    { name: '즉흥적', icon: '🎲' }
  ]

  const handlePersonalityChange = (traitName: string) => {
    setPersonalityTraits(prev => 
      prev.includes(traitName)
        ? prev.filter(t => t !== traitName)
        : [...prev, traitName]
    )
  }

  const handleNext = () => {
    updateFormData({ personalityTraits })
  }

  const isValid = personalityTraits.length > 0

  return (
    <div className="h-screen flex items-center justify-center px-3 py-4 overflow-hidden">
      <div className="max-w-4xl w-full h-full flex flex-col">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl h-full flex flex-col">
          {/* 헤더 섹션 - 컴팩트 */}
          <div className="flex-shrink-0">
            <SurveyProgress />
            
            <div className="text-center mb-4">
              <h1 className="lego-text text-2xl md:text-3xl mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                성격 특성을 선택해주세요
              </h1>
              <p className="text-sm text-white">복수 선택 가능 • 나를 가장 잘 표현하는 특성들을 골라주세요</p>
            </div>
          </div>
          
          {/* 메인 콘텐츠 - 스크롤 가능 */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden mb-4 pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {personalities.map(personality => {
                const isSelected = personalityTraits.includes(personality.name)
                return (
                  <button
                    key={personality.name}
                    type="button"
                    onClick={() => handlePersonalityChange(personality.name)}
                    className={`
                      group relative p-3 rounded-xl border transition-all duration-300
                      ${isSelected 
                        ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-pink-400 text-white shadow-lg'
                        : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                        {personality.icon}
                      </span>
                      <span className={`text-sm font-medium text-center leading-tight ${
                        isSelected ? 'text-white' : 'text-white'
                      }`}>
                        {personality.name}
                      </span>
                    </div>
                    
                    {/* 선택 표시 */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-lg">
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
            {/* 선택된 특성 표시 - 컴팩트 */}
            {personalityTraits.length > 0 && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-400/30">
                  <span className="text-pink-300 font-semibold text-sm">
                    ✨ {personalityTraits.length}개 특성 선택
                  </span>
                  {personalityTraits.length <= 4 && (
                    <div className="flex gap-1">
                      {personalityTraits.map(traitName => {
                        const personality = personalities.find(p => p.name === traitName)
                        return (
                          <span key={traitName} className="text-xs">
                            {personality?.icon}
                          </span>
                        )
                      })}
                    </div>
                  )}
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
