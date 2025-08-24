'use client'

import { useState, useEffect } from 'react'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'
import { SurveyNavigation } from '@/components/survey/SurveyNavigation'

export default function Step8Page() {
  const { formData, updateFormData, setCurrentStep } = useSurvey()
  const [readingEnvironment, setReadingEnvironment] = useState(formData.readingEnvironment)
  const [additionalNotes, setAdditionalNotes] = useState(formData.additionalNotes)

  useEffect(() => {
    setCurrentStep(8)
  }, [setCurrentStep])

  const environmentOptions = [
    { value: '조용한 집 안', emoji: '🏠', description: '편안한 나만의 공간에서' },
    { value: '카페나 공공장소', emoji: '☕', description: '적당한 소음이 있는 곳에서' },
    { value: '자연 속', emoji: '🌳', description: '공원이나 야외에서' },
    { value: '도서관', emoji: '📚', description: '완전히 조용한 환경에서' },
    { value: '침실', emoji: '🛏️', description: '잠들기 전 침대에서' },
    { value: '이동 중', emoji: '🚌', description: '지하철이나 버스에서' }
  ]

  const handleNext = () => {
    updateFormData({ readingEnvironment, additionalNotes })
  }

  const isValid = readingEnvironment.trim().length > 0

  return (
    <div className="h-screen flex items-center justify-center px-3 py-4 overflow-hidden">
      <div className="max-w-4xl w-full h-full flex flex-col">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl h-full flex flex-col">
          {/* 헤더 섹션 */}
          <div className="flex-shrink-0">
            <SurveyProgress />
            
            <div className="text-center mb-4">
              <h1 className="lego-text text-2xl md:text-3xl mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                마지막 질문입니다! 🎉
              </h1>
              <p className="text-sm text-white">독서 환경과 추가로 전하고 싶은 말씀을 알려주세요</p>
            </div>
          </div>
          
          {/* 메인 콘텐츠 */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden mb-4 pr-2 space-y-6 custom-scrollbar">
            {/* 독서 환경 선택 */}
            <div>
              <h3 className="text-lg font-bold text-pink-300 mb-3">📍 주로 어디서 책을 읽으시나요?</h3>
              <div className="grid grid-cols-2 gap-3">
                {environmentOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setReadingEnvironment(option.value)}
                    className={`
                      group relative p-4 rounded-xl border transition-all duration-200 text-left
                      ${readingEnvironment === option.value
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
                        <div className="font-medium text-sm mb-1">{option.value}</div>
                        <div className="text-xs opacity-80">{option.description}</div>
                      </div>
                    </div>
                    
                    {readingEnvironment === option.value && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs text-pink-600">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 추가 메모 */}
            <div>
              <h3 className="text-lg font-bold text-purple-300 mb-3">💭 추가로 전하고 싶은 말씀이 있나요?</h3>
              <div className="space-y-3">
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="예: 최근에 관심 있는 주제, 피하고 싶은 장르, 특별한 상황 등 자유롭게 적어주세요..."
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 h-24 resize-none text-sm"
                  maxLength={300}
                />
                <div className="text-right text-xs text-white/70">
                  {additionalNotes.length}/300 (선택사항)
                </div>
              </div>
            </div>

            {/* 완료 메시지 */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4 border border-green-400/30 text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="text-green-300 font-bold mb-1">설문이 거의 완료되었습니다!</h4>
              <p className="text-white text-sm">
                AI가 당신만의 완벽한 책과 향기 조합을 찾아드릴게요 ✨
              </p>
            </div>
          </div>

          {/* 하단 섹션 */}
          <div className="flex-shrink-0">
            {/* 선택 상태 표시 */}
            {readingEnvironment && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-green-400/30">
                  <span className="text-green-300 font-semibold text-sm">
                    ✅ 설문 완료 준비됨
                  </span>
                </div>
              </div>
            )}

            <SurveyNavigation 
              onNext={handleNext}
              nextDisabled={!isValid}
              isLastStep={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}