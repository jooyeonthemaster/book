'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'

export default function Step5Page() {
  const router = useRouter()
  const { formData, updateFormData, setCurrentStep, currentStep } = useSurvey()
  const [bookMeaning, setBookMeaning] = useState(formData.bookMeaning || '')
  const [isPreloadingImages, setIsPreloadingImages] = useState(false)

  useEffect(() => {
    setCurrentStep(5)
  }, [setCurrentStep])

  // 이미지 미리 로딩 함수
  const preloadBookCoverImages = async () => {
    return new Promise<void>((resolve) => {
      // 주요 책들의 이미지를 미리 로딩
      const commonBooks = [
        '빅토리아 마스_미친여자들의 무도회',
        '황여정_숨과 입자',
        '최진영_단 한 사람',
        '김초엽_파견자들',
        '이설야_내 얼굴이 도착하지 않았다'
      ]
      
      let loadedCount = 0
      const totalImages = commonBooks.length
      
      commonBooks.forEach((bookFile) => {
        if (typeof window !== 'undefined') {
          const img = new window.Image()
          img.onload = img.onerror = () => {
            loadedCount++
            if (loadedCount >= totalImages) {
              resolve()
            }
          }
          img.src = `/bookcover/${bookFile}.jpg`
        } else {
          // 서버 사이드에서는 바로 완료 처리
          loadedCount++
          if (loadedCount >= totalImages) {
            resolve()
          }
        }
      })
      
      // 최대 3초 후에는 강제로 완료
      setTimeout(resolve, 3000)
    })
  }

  const handleNext = async () => {
    if (bookMeaning.trim()) {
      setIsPreloadingImages(true)
      updateFormData({ bookMeaning: bookMeaning.trim() })
      
      // 이미지 미리 로딩
      await preloadBookCoverImages()
      
      // 결과 페이지로 이동
      router.push('/survey/result')
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
              <div className="text-center mb-8 xs:mb-4">
                <div 
                  className="text-gray-500 text-xs mb-4 font-typewriter xs:xs-small-text xs:mb-3"
                >
                  ◦ Step 5 of 5 - 읽기 환경 설정
                </div>
                <div 
                  className="w-full h-px bg-gradient-to-r from-transparent via-black to-transparent mb-6 opacity-20 xs:mb-4"
                ></div>
                <h1 className="font-serif text-2xl md:text-3xl text-black font-bold mb-4 xs:xs-title xs:mb-3">
                  <span 
                    className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent"
                  >
                    마지막 질문이에요
                  </span>
                </h1>
                <p className="text-gray-600 text-sm font-typewriter xs:xs-text">
                  당신만의 솔직한 이야기를 들려주세요
                </p>
              </div>
            </div>
            
            {/* 메인 콘텐츠 - 컴팩트 사이즈 */}
            <div className="flex-grow-0 flex flex-col justify-center">
              {/* 주관식 질문 */}
              <div className="space-y-7 xs:space-y-4">
                <h3 className="text-xl font-bold text-black mb-6 font-typewriter text-center xs:xs-subtitle xs:mb-4">
                  당신의 인생에서 책이란 어떤 존재인가요?
                </h3>
                <div className="relative">
                  <textarea
                    value={bookMeaning}
                    onChange={(e) => setBookMeaning(e.target.value)}
                    placeholder="책이 당신에게 어떤 의미인지, 어떤 순간에 책을 찾게 되는지, 책을 통해 얻는 것이 무엇인지... 자유롭게 써주세요."
                    className="w-full h-60 p-6 rounded-xl border-2 border-black/15 bg-white/80 text-black placeholder-gray-400 font-typewriter text-sm resize-none focus:outline-none focus:border-black/40 focus:bg-white transition-all duration-300 xs:xs-textarea xs:h-32"
                    style={{ lineHeight: '1.6' }}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-typewriter xs:xs-small-text xs:bottom-2 xs:right-2">
                    {bookMeaning.length}/500
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-typewriter text-center xs:xs-small-text">
                  솔직하고 개인적인 이야기일수록 더 정확한 추천을 받을 수 있어요
                </p>
              </div>
            </div>

            {/* 하단 섹션 - 고정 */}
            <div className="flex-shrink-0 mt-24 xs:mt-8">
              {/* 네비게이션 버튼들 - 배경 패턴 안에 위치 */}
              <div className="flex justify-center items-center gap-6 xs:xs-nav-buttons">
                {/* 이전 버튼 - 화이트 테마 */}
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`
                    min-w-[120px] px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform border font-typewriter xs:xs-button xs:min-w-[100px] xs:rounded-lg
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
                  disabled={!isValid || isPreloadingImages}
                  className={`
                    survey-next-button min-w-[140px] font-serif text-lg px-8 py-3 rounded-xl transition-all duration-300 transform border relative overflow-hidden xs:xs-button-large xs:min-w-[120px] xs:rounded-lg
                    ${!isValid || isPreloadingImages
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-black border-black hover:bg-gray-50 hover:scale-105 hover:shadow-xl'
                    }
                  `}
                  style={{
                    animation: isValid && !isPreloadingImages ? 'pulse-glow 3s ease-in-out infinite' : 'none'
                  }}
                >
                  <span className="relative z-10 text-black font-bold flex items-center gap-2">
                    {isPreloadingImages && (
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                    {isPreloadingImages ? '로딩 중...' : '결과 보기'}
                  </span>
                </button>
              </div>

              {/* 미래적 장식 */}
              <div className="flex justify-center items-center gap-4 mt-3 text-gray-400 xs:mt-2 xs:gap-2">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-black to-transparent opacity-30 xs:w-6"></div>
                <div className="text-xs font-typewriter xs:xs-small-text">5 / 5</div>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-black to-transparent opacity-30 xs:w-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}