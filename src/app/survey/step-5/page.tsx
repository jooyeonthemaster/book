'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'

export default function Step5Page() {
  const router = useRouter()
  const { formData, updateFormData, setCurrentStep, currentStep } = useSurvey()
  const [bookMeaning, setBookMeaning] = useState(formData.bookMeaning || '')

  useEffect(() => {
    setCurrentStep(5)
  }, [setCurrentStep])

  const handleNext = () => {
    if (bookMeaning.trim()) {
      updateFormData({ bookMeaning: bookMeaning.trim() })
      // 약간의 지연 후 결과 페이지로 이동
      setTimeout(() => {
        router.push('/survey/result')
      }, 100)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      router.push(`/survey/step-${prevStep}`)
    }
  }

  const isValid = bookMeaning.trim().length > 0



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
              <div className="text-center mb-3">
                <div 
                  className="text-gray-500 text-xs mb-2 font-typewriter"
                >
                  ◦ Step 5 of 5 - 읽기 환경 설정
                </div>
                <div 
                  className="w-full h-px bg-gradient-to-r from-transparent via-black to-transparent mb-3 opacity-20"
                ></div>
                <h1 className="font-serif text-2xl md:text-3xl text-black font-bold mb-2">
                  <span 
                    className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent"
                  >
                    마지막 질문이에요
                  </span>
                </h1>
                <p className="text-gray-600 text-sm font-typewriter">
                  당신만의 솔직한 이야기를 들려주세요
                </p>
              </div>
            </div>
            
            {/* 메인 콘텐츠 - 컴팩트 사이즈 */}
            <div className="flex-grow-0 flex flex-col justify-center">
              {/* 주관식 질문 */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black mb-4 font-typewriter text-center">
                  당신의 인생에서 책이란 어떤 존재인가요?
                </h3>
                <div className="relative">
                  <textarea
                    value={bookMeaning}
                    onChange={(e) => setBookMeaning(e.target.value)}
                    placeholder="책이 당신에게 어떤 의미인지, 어떤 순간에 책을 찾게 되는지, 책을 통해 얻는 것이 무엇인지... 자유롭게 써주세요."
                    className="w-full h-60 p-6 rounded-xl border-2 border-black/15 bg-white/80 text-black placeholder-gray-400 font-typewriter text-sm resize-none focus:outline-none focus:border-black/40 focus:bg-white transition-all duration-300"
                    style={{ lineHeight: '1.6' }}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-typewriter">
                    {bookMeaning.length}/500
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-typewriter text-center">
                  솔직하고 개인적인 이야기일수록 더 정확한 추천을 받을 수 있어요
                </p>
              </div>
            </div>

            {/* 하단 섹션 - 고정 */}
            <div className="flex-shrink-0 mt-16">
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
                    결과 보기
                  </span>
                </button>
              </div>

              {/* 미래적 장식 */}
              <div className="flex justify-center items-center gap-4 mt-3 text-gray-400">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-black to-transparent opacity-30"></div>
                <div className="text-xs font-typewriter">5 / 5</div>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-black to-transparent opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}