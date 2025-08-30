'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'

export default function Step3Page() {
  const router = useRouter()
  const { formData, updateFormData, setCurrentStep, currentStep } = useSurvey()
  const [storyStyle, setStoryStyle] = useState(formData.storyStyle || '')

  useEffect(() => {
    setCurrentStep(3)
  }, [setCurrentStep])

  const handleNext = () => {
    updateFormData({ storyStyle })
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

  const isValid = storyStyle

  const storyStyleOptions = [
    { 
      value: 'emotional_touching', 
      label: '감동적이고 따뜻한 이야기', 
      desc: '마음을 울리고 위로가 되는 감성적인 스토리',
      examples: ['가족의 사랑', '우정', '성장 이야기']
    },
    { 
      value: 'intellectual_deep', 
      label: '지적이고 깊이 있는 이야기', 
      desc: '생각할 거리를 주는 철학적이고 통찰력 있는 내용',
      examples: ['인문학', '철학', '사회 비평']
    },
    { 
      value: 'realistic_honest', 
      label: '현실적이고 솔직한 이야기', 
      desc: '있는 그대로의 삶과 사회를 담은 리얼한 스토리',
      examples: ['사회 문제', '일상의 진실', '현실 고발']
    },
    { 
      value: 'fantasy_imaginative', 
      label: '환상적인 이야기', 
      desc: '현실을 벗어난 창의적이고 몽환적인 세계',
      examples: ['판타지', 'SF', '마법적 현실주의']
    },
    { 
      value: 'poetic_artistic', 
      label: '시적이고 예술적인 이야기', 
      desc: '아름다운 문체와 섬세한 감성이 담긴 문학적 작품',
      examples: ['시집', '서정적 소설', '예술 에세이']
    },
    { 
      value: 'suspenseful_thrilling', 
      label: '스릴 있는 이야기', 
      desc: '몰입도 높고 흥미진진한 전개의 이야기',
      examples: ['추리', '스릴러', '서스펜스']
    }
  ]

  return (
    <div className="min-h-screen-mobile flex items-start justify-center px-3 py-4 xs:xs-survey-container">
      <div className="max-w-4xl w-full flex flex-col">
        {/* 미래지향적 화이트 설문지 */}
        <div className="bg-white/95 backdrop-blur-xl border border-black/20 rounded-3xl p-4 md:p-6 shadow-2xl relative min-h-screen-mobile flex flex-col xs:xs-survey-content xs:rounded-2xl xs:min-h-0 xs:overflow-visible">
          {/* 디지털 노트 패턴 */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(90deg, transparent 0px, transparent 24px, rgba(0,0,0,0.02) 25px, rgba(0,0,0,0.02) 26px),
              repeating-linear-gradient(0deg, transparent 0px, transparent 29px, rgba(0,0,0,0.03) 30px, rgba(0,0,0,0.03) 31px)
            `
          }}></div>
          
          <div className="relative z-10 flex flex-col">
            {/* 헤더 섹션 - 컴팩트 */}
            <div className="flex-shrink-0">
              <SurveyProgress />
              
              {/* 설문지 헤더 */}
              <div className="text-center mb-4">
                <div 
                  className="text-gray-500 text-xs mb-2 font-typewriter"
                >
                  ◦ Step 3 of 5 - 이야기 스타일 선호
                </div>
                <div 
                  className="w-full h-px bg-gradient-to-r from-transparent via-black to-transparent mb-3 opacity-20"
                ></div>
                <h1 className="font-serif text-2xl md:text-3xl text-black font-bold mb-2 xs:xs-title xs:mb-1">
                  <span 
                    className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent"
                  >
                    어떤 방식의 이야기를 좋아하시나요?
                  </span>
          </h1>
                <p className="text-gray-600 text-sm font-typewriter">
                  선호하는 스토리텔링 스타일을 알려주세요
                </p>
              </div>
            </div>
            
            {/* 메인 콘텐츠 - 컴팩트 사이즈 */}
            <div className="flex-grow-0 flex flex-col justify-center">
              {/* 이야기 스타일 선택 카드들 */}
              <div className="grid grid-cols-2 gap-4 mb-6 xs:grid-cols-1 xs:gap-3">
              {storyStyleOptions.map((style, index) => (
                <div
                  key={style.value}
                  onClick={() => setStoryStyle(style.value)}
                  className={`p-6 py-6 rounded-xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                    storyStyle === style.value
                      ? 'border-black bg-black/5 shadow-lg'
                      : 'border-black/10 bg-white/50 hover:border-black/30 hover:bg-black/5'
                  }`}
                  style={{}}
                >
                  {/* 선택 시 글로우 효과 */}
                  {storyStyle === style.value && (
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent"
                      style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
                    ></div>
                  )}
                  
                  <div className="relative z-10">
                    <div className="text-sm font-bold text-black mb-2 font-typewriter">
                      {style.label}
                    </div>
                    <div className="text-gray-600 text-xs font-typewriter mb-2">
                      {style.desc}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {style.examples.slice(0, 2).map((example, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-black/10 text-gray-700 px-1 py-0.5 rounded-full font-typewriter"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* 선택 표시 */}
                  {storyStyle === style.value && (
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
                    survey-next-button min-w-[140px] font-serif text-lg px-8 py-3 rounded-xl transition-all duration-300 transform border relative overflow-hidden
                    ${!isValid
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-black border-black hover:bg-gray-50 hover:scale-105 hover:shadow-xl'
                    }
                  `}
                  style={{
                    animation: isValid ? 'pulse-glow 3s ease-in-out infinite' : 'none'
                  }}
                >
                  <span className="relative z-10 text-black font-bold">
                    다음 →
                  </span>
                </button>
              </div>

              {/* 미래적 장식 */}
              <div className="flex justify-center items-center gap-4 mt-4 text-gray-400">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-black to-transparent opacity-30"></div>
                <div className="text-xs font-typewriter">3 / 5</div>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-black to-transparent opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}