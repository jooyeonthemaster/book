'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'

export default function Step2Page() {
  const router = useRouter()
  const { formData, updateFormData, setCurrentStep, currentStep } = useSurvey()
  const [lifeStage, setLifeStage] = useState(formData.lifeStage || '')

  useEffect(() => {
    setCurrentStep(2)
  }, [setCurrentStep])

  const handleNext = () => {
    updateFormData({ lifeStage })
    // 약간의 지연 후 다음 페이지로 이동
    setTimeout(() => {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      router.push(`/survey/step-${nextStep}`)
    }, 100)
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      router.push(`/survey/step-${prevStep}`)
    }
  }

  const isValid = lifeStage

  const lifeStageOptions = [
    { 
      value: 'youth_growth', 
      label: '성장과 꿈을 키우는 시기', 
      desc: '새로운 경험과 가능성을 탐험하고 있어요',
      keywords: ['성장', '꿈', '가능성', '청춘']
    },
    { 
      value: 'love_relationship', 
      label: '사랑과 관계에 집중하는 시기', 
      desc: '연인, 친구, 가족과의 관계가 중요해요',
      keywords: ['사랑', '관계', '우정', '가족']
    },
    { 
      value: 'career_challenge', 
      label: '도전과 성취를 추구하는 시기', 
      desc: '커리어와 목표 달성에 집중하고 있어요',
      keywords: ['도전', '성취', '커리어', '목표']
    },
    { 
      value: 'family_responsibility', 
      label: '가족과 책임을 돌보는 시기', 
      desc: '가정과 안정적인 삶이 우선이에요',
      keywords: ['가족', '책임', '안정', '일상']
    },
    { 
      value: 'reflection_wisdom', 
      label: '성찰과 지혜를 쌓는 시기', 
      desc: '인생을 돌아보고 의미를 찾고 있어요',
      keywords: ['성찰', '지혜', '인생', '의미']
    },
    { 
      value: 'freedom_exploration', 
      label: '자유롭게 탐험하는 시기', 
      desc: '새로운 취미와 관심사를 발견하고 있어요',
      keywords: ['자유', '탐험', '취미', '관심사']
    }
  ]

  return (
    <div className="h-screen flex items-center justify-center px-3 py-4 overflow-hidden">
      <div className="max-w-4xl w-full h-full flex flex-col">
        {/* 미래지향적 화이트 설문지 */}
        <div className="bg-white/95 backdrop-blur-xl border border-black/20 rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden h-full flex flex-col">
          {/* 디지털 노트 패턴 */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(90deg, transparent 0px, transparent 24px, rgba(0,0,0,0.02) 25px, rgba(0,0,0,0.02) 26px),
              repeating-linear-gradient(0deg, transparent 0px, transparent 29px, rgba(0,0,0,0.03) 30px, rgba(0,0,0,0.03) 31px)
            `
          }}></div>
          
          <div className="relative z-10 h-full flex flex-col">
            {/* 헤더 섹션 - 컴팩트 */}
            <div className="flex-shrink-0">
              <SurveyProgress />
              
              {/* 설문지 헤더 */}
              <div className="text-center mb-4">
                <div 
                  className="text-gray-500 text-xs mb-2 font-typewriter"
                >
                  ◦ Step 2 of 5 - 인생 단계 파악
                </div>
                <div 
                  className="w-full h-px bg-gradient-to-r from-transparent via-black to-transparent mb-3 opacity-20"
                ></div>
                <h1 className="font-serif text-2xl md:text-3xl text-black font-bold mb-2">
                  <span 
                    className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent"
                  >
                    지금 당신의 인생 이야기는?
                  </span>
                </h1>
                <p className="text-gray-600 text-sm font-typewriter">
                  현재 인생 단계에 맞는 책을 추천해드릴게요
                </p>
              </div>
            </div>
            
            {/* 메인 콘텐츠 - 컴팩트 사이즈 */}
            <div className="flex-grow-0 flex flex-col justify-center">
              {/* 인생 단계 선택 카드들 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {lifeStageOptions.map((stage, index) => (
                  <div
                    key={stage.value}
                    onClick={() => setLifeStage(stage.value)}
                    className={`p-6 py-6 rounded-xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                      lifeStage === stage.value
                        ? 'border-black bg-black/5 shadow-lg'
                        : 'border-black/10 bg-white/50 hover:border-black/30 hover:bg-black/5'
                    }`}
                    style={{}}
                  >
                    {/* 선택 시 글로우 효과 */}
                    {lifeStage === stage.value && (
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent"
                        style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
                      ></div>
                    )}
                    
                    <div className="relative z-10">
                      <div className="mb-1">
                        <div className="text-sm font-bold text-black font-typewriter">
                          {stage.label}
                        </div>
                      </div>
                      <div className="text-gray-600 text-xs font-typewriter mb-2">
                        {stage.desc}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {stage.keywords.slice(0, 2).map((keyword, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-black/10 text-gray-700 px-1 py-0.5 rounded-full font-typewriter"
                          >
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* 선택 표시 */}
                    {lifeStage === stage.value && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 섹션 - 고정 */}
            <div className="flex-shrink-0">
              {/* 네비게이션 버튼들 - 배경 패턴 안에 위치 */}
              <div className="flex justify-center items-center gap-6">
                {/* 이전 버튼 - 화이트 테마 */}
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`
                    min-w-[120px] px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform border font-typewriter
                    ${currentStep === 1 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'bg-white text-black border-black/20 hover:bg-black/5 hover:border-black/40 hover:scale-105 hover:shadow-lg backdrop-blur-sm'
                    }
                  `}
                >
                  ← 이전
                </button>
                
                {/* 다음 버튼 */}
                <button
                  onClick={handleNext}
                  disabled={!isValid}
                  className={`
                    min-w-[140px] font-serif text-lg px-8 py-3 rounded-xl transition-all duration-300 transform border relative overflow-hidden
                    ${!isValid
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-black text-white border-black hover:bg-gray-800 hover:scale-105 hover:shadow-xl'
                    }
                  `}
                  style={{
                    animation: isValid ? 'pulse-glow 3s ease-in-out infinite' : 'none'
                  }}
                >
                  {isValid && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-black/10 hover:from-gray-600/20 hover:to-black/20 transition-all duration-300"></div>
                  )}
                  <span className="relative z-10">
                    다음 →
                  </span>
                </button>
              </div>

              {/* 미래적 장식 */}
              <div className="flex justify-center items-center gap-4 mt-4 text-gray-400">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-black to-transparent opacity-30"></div>
                <div className="text-xs font-typewriter">2 / 5</div>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-black to-transparent opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}