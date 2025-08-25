'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'

export default function Step1Page() {
  const router = useRouter()
  const { formData, updateFormData, setCurrentStep, currentStep } = useSurvey()
  const [currentMood, setCurrentMood] = useState(formData.currentMood || '')

  useEffect(() => {
    setCurrentStep(1)
  }, [setCurrentStep])

  const handleNext = () => {
    console.log('Step 1 - handleNext clicked', { currentMood, isValid })
    updateFormData({ currentMood })
    // 약간의 지연 후 다음 페이지로 이동
    setTimeout(() => {
      const nextStep = currentStep + 1
      console.log('Step 1 - navigating to step:', nextStep)
      setCurrentStep(nextStep)
      router.push(`/survey/step-${nextStep}`)
    }, 100)
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      router.push(`/survey/step-${prevStep}`)
    } else {
      // 첫 번째 단계에서는 메인 페이지로 이동
      router.push('/')
    }
  }

  const isValid = currentMood

  const moodOptions = [
    { value: 'peaceful', label: '평온하고 고요한', desc: '마음이 차분하고 안정적인 상태' },
    { value: 'curious', label: '호기심 가득한', desc: '새로운 것을 알고 싶은 마음' },
    { value: 'melancholy', label: '조금 우울하고 사색적인', desc: '깊이 생각하고 싶은 기분' },
    { value: 'energetic', label: '에너지 넘치는', desc: '활기차고 역동적인 느낌' },
    { value: 'romantic', label: '로맨틱하고 감성적인', desc: '사랑과 감정에 빠져있는 상태' },
    { value: 'philosophical', label: '철학적이고 깊이 있는', desc: '인생과 세상에 대해 고민하는 중' }
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
                  ◦ Step 1 of 5 - 감정 상태 파악
                </div>
                <div 
                  className="w-full h-px bg-gradient-to-r from-transparent via-black to-transparent mb-3 opacity-20"
                ></div>
                <h1 className="font-serif text-2xl md:text-3xl text-black font-bold mb-2">
                  <span 
                    className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent"
                  >
                    지금 이 순간의 당신은?
                  </span>
                </h1>
                <p className="text-gray-600 text-sm font-typewriter">
                  현재 기분에 맞는 책을 찾아드릴게요
                </p>
              </div>
            </div>
            
            {/* 메인 콘텐츠 - 컴팩트 사이즈 */}
            <div className="flex-grow-0 flex flex-col justify-center">
              {/* 기분 선택 카드들 */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {moodOptions.map((mood, index) => (
                  <div
                    key={mood.value}
                    onClick={() => setCurrentMood(mood.value)}
                    className={`p-6 py-8 rounded-xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                      currentMood === mood.value
                        ? 'border-black bg-black/5 shadow-lg'
                        : 'border-black/10 bg-white/50 hover:border-black/30 hover:bg-black/5'
                    }`}
                    style={{}}
                  >
                    {/* 선택 시 글로우 효과 */}
                    {currentMood === mood.value && (
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent"
                        style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
                      ></div>
                    )}
                    
                    <div className="relative z-10">
                      <div className="text-sm font-bold text-black mb-3 font-typewriter">
                        {mood.label}
                      </div>
                      <div className="text-gray-600 text-xs font-typewriter">
                        {mood.desc}
                      </div>
                    </div>
                    
                    {/* 선택 표시 */}
                    {currentMood === mood.value && (
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
                  className="min-w-[120px] px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform border font-typewriter bg-white text-black border-black/20 hover:bg-black/5 hover:border-black/40 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
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
                <div className="text-xs font-typewriter">1 / 5</div>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-black to-transparent opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
