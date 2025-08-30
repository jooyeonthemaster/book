'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'

export default function Step4Page() {
  const router = useRouter()
  const { formData, updateFormData, setCurrentStep, currentStep } = useSurvey()
  const [themes, setThemes] = useState<string[]>(formData.themes || [])

  useEffect(() => {
    setCurrentStep(4)
  }, [setCurrentStep])

  const handleThemeToggle = (theme: string) => {
    setThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    )
  }

  const handleNext = () => {
    updateFormData({ themes })
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

  const isValid = themes.length > 0

  const themeCategories = [
    {
      title: '인간 관계',
      themes: [
        { name: '사랑과 연애', desc: '로맨스와 감정의 세계' },
        { name: '가족의 의미', desc: '가족 간의 사랑과 갈등' },
        { name: '우정과 동료', desc: '진정한 우정과 동반자' },
        { name: '세대 간 이해', desc: '다른 세대와의 소통' }
      ]
    },
    {
      title: '성장과 도전',
      themes: [
        { name: '꿈과 목표', desc: '인생의 목표와 꿈 추구' },
        { name: '역경과 극복', desc: '어려움을 이겨내는 힘' },
        { name: '자아 발견', desc: '진정한 나를 찾는 여정' },
        { name: '새로운 시작', desc: '변화와 새로운 도전' }
      ]
    },
    {
      title: '사회와 세상',
      themes: [
        { name: '사회 정의', desc: '공정하고 올바른 세상' },
        { name: '환경과 자연', desc: '자연과 환경 보호' },
        { name: '문화와 전통', desc: '역사와 문화 유산' },
        { name: '미래와 기술', desc: '과학기술과 미래 사회' }
      ]
    },
    {
      title: '내면과 철학',
      themes: [
        { name: '삶의 의미', desc: '존재의 이유와 목적' },
        { name: '죽음과 영원', desc: '생명과 죽음에 대한 성찰' },
        { name: '행복과 만족', desc: '진정한 행복 찾기' },
        { name: '고독과 성찰', desc: '혼자만의 시간과 생각' }
      ]
    },
    {
      title: '예술과 창작',
      themes: [
        { name: '예술과 창조', desc: '창작과 예술적 영감' },
        { name: '음악과 리듬', desc: '음악이 주는 감동' },
        { name: '여행과 모험', desc: '새로운 곳으로의 여행' },
        { name: '일상의 아름다움', desc: '평범한 일상 속 특별함' }
      ]
    }
  ]

  return (
    <div className="min-h-screen-mobile flex items-start justify-center px-3 py-4 xs:xs-survey-container">
      <div className="max-w-5xl w-full flex flex-col">
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
              <div className="text-center mb-3">
                <div 
                  className="text-gray-500 text-xs mb-2 font-typewriter"
                >
                  ◦ Step 4 of 5 - 관심 주제 선택
                </div>
                <div 
                  className="w-full h-px bg-gradient-to-r from-transparent via-black to-transparent mb-3 opacity-20"
                ></div>
                <h1 className="font-serif text-2xl md:text-3xl text-black font-bold mb-2 xs:xs-title xs:mb-1">
                  <span 
                    className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent"
                  >
                    어떤 세계를 탐험해보고 싶으신가요?
                  </span>
                </h1>
                <p className="text-gray-600 text-sm font-typewriter mb-1">
                  관심 있는 주제를 선택해주세요 (복수 선택 가능)
                </p>
                {themes.length > 0 && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full">
                    <span className="text-black font-semibold text-xs">
                      ✨ {themes.length}개 선택됨
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* 메인 콘텐츠 - 컴팩트 사이즈 */}
            <div className="flex-grow-0 space-y-9 xs:space-y-4">
              {themeCategories.slice(0, 3).map((category, categoryIndex) => (
                <div key={category.title} className="space-y-3 xs:xs-theme-category">
                  {/* 카테고리 헤더 */}
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                        <h3 className="text-sm font-bold text-black font-typewriter tracking-wide">{category.title}</h3>
                      </div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-black/30 via-black/10 to-transparent rounded-full"></div>
                      <div className="w-1 h-1 bg-black/40 rounded-full"></div>
                    </div>
                    {/* 직선적인 구분선 */}
                    <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-black/20 via-black/10 to-black/5"></div>
                  </div>
                  
                  {/* 주제 버튼들 */}
                  <div className="grid grid-cols-4 gap-1 xs:grid-cols-2 xs:gap-3">
                    {category.themes.map((theme, index) => {
                      const isSelected = themes.includes(theme.name)
                      return (
                        <button
                          key={theme.name}
                          type="button"
                          onClick={() => handleThemeToggle(theme.name)}
                          className={`
                            group relative p-4 py-6 rounded-xl border-2 transition-all duration-300 text-center hover:scale-[1.02] hover:shadow-md xs:p-3 xs:py-4 xs:rounded-lg
                            ${isSelected 
                              ? 'border-black bg-black text-white shadow-lg'
                              : 'border-black/15 bg-white/80 hover:border-black/40 hover:bg-black/5 hover:shadow-lg'
                            }
                          `}
                          style={{}}
                        >
                          {/* 선택 시 글로우 효과 */}
                          {isSelected && (
                            <div 
                              className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent rounded-xl"
                              style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
                            ></div>
                          )}
                          
                          <div className="relative z-10 flex items-center justify-center h-full">
                            <span className={`font-semibold text-sm font-typewriter transition-colors duration-300 ${
                              isSelected ? 'text-white' : 'text-black group-hover:text-black'
                            }`}>
                              {theme.name}
                            </span>
                          </div>
                          
                          {/* 선택 표시 */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                              <div className="w-2 h-2 bg-black rounded-full"></div>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 섹션 - 고정 */}
            <div className="flex-shrink-0 mt-20 xs:mt-6">
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
                  disabled={!isValid}
                  className={`
                    min-w-[140px] font-serif text-lg px-8 py-3 rounded-xl transition-all duration-300 transform border relative overflow-hidden xs:xs-button-large xs:min-w-[120px] xs:rounded-lg
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
              <div className="flex justify-center items-center gap-4 mt-3 text-gray-400">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-black to-transparent opacity-30"></div>
                <div className="text-xs font-typewriter">4 / 5</div>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-black to-transparent opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}