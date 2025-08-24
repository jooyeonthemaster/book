'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSurvey } from '@/contexts/SurveyContext'
import { RecommendationResult } from '@/lib/recommendationService'
import TextCloud from '@/components/TextCloud'
import FragranceChart from '@/components/FragranceChart'
import TypewriterNote from '@/components/TypewriterNote'

export default function ResultPage() {
  const { formData, resetFormData } = useSurvey()
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // 책 표지 이미지 경로 생성 함수
  const getBookCoverPath = (title: string, author: string) => {
    const fileName = `${author}_${title}.jpg`
    const encodedFileName = encodeURIComponent(fileName)
    const path = `/bookcover/${encodedFileName}`
    console.log('Book cover path:', path) // 디버깅용
    console.log('Original filename:', fileName) // 디버깅용
    return path
  }

  useEffect(() => {
    const generateRecommendation = async () => {
      try {
        console.log('Form data:', formData)
        
        // API 호출
        const response = await fetch('/api/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '추천 생성에 실패했습니다.')
        }

        if (data.success) {
          setResult(data.data)
        } else {
          throw new Error('추천 결과를 받을 수 없습니다.')
        }
      } catch (error) {
        console.error('Error:', error)
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    generateRecommendation()
  }, [formData])

  const handleRestart = () => {
    resetFormData()
    router.push('/survey')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 text-center">
            <div className="animate-spin w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full mx-auto mb-8"></div>
            <h1 className="lego-text text-3xl md:text-4xl mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              AI가 분석 중입니다...
            </h1>
            <p className="text-gray-300">
              당신만의 완벽한 조합을 찾고 있어요 ✨
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 text-center">
            <div className="text-6xl mb-8">😔</div>
            <h1 className="lego-text text-3xl md:text-4xl mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              오류가 발생했습니다
            </h1>
            <p className="text-gray-300 mb-8">{error}</p>
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover-glow"
            >
              🔄 다시 시도하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-2xl animate-pulse">
              🎯
            </div>
            <h1 className="lego-text text-4xl md:text-6xl bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              당신을 위한 추천
            </h1>
          </div>
          
          {result && (
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl border border-emerald-400/30 backdrop-blur-sm">
              <span className="text-3xl animate-bounce">✨</span>
              <div className="text-center">
                <div className="text-emerald-300 font-bold text-2xl">{result.confidence}%</div>
                <div className="text-emerald-200 text-sm">영혼 일치도</div>
              </div>
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-12">
            {/* 메인 추천 섹션 - 맨 위로 이동 */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 책 추천 */}
              <div 
                className="relative backdrop-blur-lg rounded-3xl p-8 border border-pink-400/20 overflow-hidden"
                style={{
                  backgroundImage: `url(${getBookCoverPath(result.book.title, result.book.author)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* 배경 오버레이 - 투명도 조정으로 이미지가 더 잘 보이도록 */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 to-rose-900/30 backdrop-blur-sm"></div>
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* 콘텐츠 */}
                <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">📚</span>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
                    운명의 책
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">{result.book.title}</h3>
                    <p className="text-pink-200 text-lg mb-4">by {result.book.author}</p>
                    <div className="inline-flex px-4 py-2 bg-pink-500/20 rounded-full border border-pink-400/30">
                      <span className="text-pink-300 text-sm font-medium">{result.book.genre}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <p className="text-gray-300 leading-relaxed mb-4">{result.book.description}</p>
                    

                  </div>
                  
                  {/* 주요 테마 키워드 클라우드 */}
                  {result.book.themes && result.book.themes.length > 0 && (
                    <div className="space-y-4">
                      <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                        <span className="text-lg">🏷️</span>
                        <span>주요 테마</span>
                      </div>
                      <TextCloud words={result.book.themes} className="h-48" />
                    </div>
                  )}
                  
                  {/* 타이핑 효과로 인용구 표시 */}
                  {result.book.quote && (
                    <TypewriterNote 
                      text={result.book.quote}
                      speed={30}
                      className="mt-6"
                    />
                  )}
                </div>
                </div>
              </div>

              {/* 향기 추천 */}
              <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-400/20">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🌸</span>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
                    영혼의 향기
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">{result.fragrance.literaryName}</h3>
                    <p className="text-purple-200 text-lg mb-4">{result.fragrance.baseScent}</p>
                    <div className="flex justify-center gap-2 mb-4">
                      <div className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">
                        <span className="text-purple-300 text-sm font-medium">{result.fragrance.category}</span>
                      </div>
                      <div className="px-4 py-2 bg-violet-500/20 rounded-full border border-violet-400/30">
                        <span className="text-violet-300 text-sm font-medium">{result.fragrance.intensity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <p className="text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap break-words overflow-visible text-ellipsis-none" style={{ textOverflow: 'clip', overflow: 'visible', whiteSpace: 'pre-wrap' }}>{result.fragrance.description}</p>
                    
                    {result.fragrance.mood.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-2">분위기</div>
                        <div className="flex flex-wrap gap-2">
                          {result.fragrance.mood.map((mood, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-400/30">
                              {mood}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 향기 차트 */}
                  <FragranceChart characteristics={result.fragrance.characteristics} />
                </div>
              </div>
            </div>

            {/* AI 심층 분석 섹션 - 메인 추천 아래로 이동 */}
            {result.deepAnalysis && (
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-lg rounded-3xl p-8 border border-indigo-400/20">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🔮</span>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                    AI 심층 분석
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                        <span>🧠</span> 당신의 심리 프로필
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-sm">
                        {result.deepAnalysis.userPsychology}
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                        <span>💫</span> 숨겨진 욕구
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-sm">
                        {result.deepAnalysis.hiddenNeeds}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                        <span>🎭</span> 감정적 공명
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-sm">
                        {result.deepAnalysis.emotionalResonance}
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                        <span>🏷️</span> 당신만의 키워드
                      </h3>
                      <TextCloud words={result.deepAnalysis.personalKeywords} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 개인화된 추천 이유 */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 backdrop-blur-lg rounded-3xl p-8 border border-cyan-400/20">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">💡</span>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                  당신만을 위한 추천 이유
                </h2>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {result.matchReason}
                </p>
              </div>
            </div>

            {/* 대안 추천 */}
            {result.alternativeBooks.length > 0 && (
              <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-lg rounded-3xl p-8 border border-amber-400/20">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">📖</span>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                    다른 가능성들
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {result.alternativeBooks.slice(0, 3).map((book, index) => (
                    <div key={book.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-xl mb-4 mx-auto group-hover:scale-110 transition-transform">
                          📚
                        </div>
                        <h4 className="text-white font-bold text-lg mb-2">{book.title}</h4>
                        <p className="text-amber-300 text-sm">{book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
          <button
            onClick={handleRestart}
            className="group px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover-glow transform hover:scale-105 font-bold text-lg"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
              다시 추천받기
            </span>
          </button>
          <button
            onClick={handleGoHome}
            className="group px-10 py-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 font-bold text-lg"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🏠</span>
              홈으로 가기
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
