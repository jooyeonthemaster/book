'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSurvey } from '@/contexts/SurveyContext'
import { RecommendationResult } from '@/lib/recommendationService'
import TextCloud from '@/components/TextCloud'
import FragranceChart from '@/components/FragranceChart'
import TypewriterNote from '@/components/TypewriterNote'
import { EnhancedLoadingPage } from '@/components/EnhancedLoadingPage'
import { EnhancedErrorPage } from '@/components/EnhancedErrorPage'

export default function ResultPage() {
  const { formData, resetFormData } = useSurvey()
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [apiCalled, setApiCalled] = useState(false)
  const router = useRouter()

  // 책 표지 이미지 경로 생성 함수
  const getBookCoverPath = (title: string, author: string) => {
    // 저자명 매핑 (데이터와 실제 파일명이 다른 경우 처리)
    const authorMapping: { [key: string]: string } = {
      '마테오 B. 비앙키': '마테오 비앙키',
      // 필요시 추가 매핑 가능
    }
    
    // 매핑된 저자명 사용 (없으면 원본 사용)
    const mappedAuthor = authorMapping[author] || author
    const fileName = `${mappedAuthor}_${title}.jpg`
    const path = `/bookcover/${fileName}`
    
    console.log('=== 이미지 경로 디버깅 ===')
    console.log('원본 저자명:', author)
    console.log('매핑된 저자명:', mappedAuthor)
    console.log('파일명:', fileName)
    console.log('최종 경로:', path)
    console.log('========================')
    
    // 이미지 존재 여부 미리 체크
    const img = new Image()
    img.onload = () => console.log('✅ 이미지 존재:', path)
    img.onerror = () => console.log('❌ 이미지 없음:', path)
    img.src = path
    
    return path
  }

  useEffect(() => {
    const generateRecommendation = async () => {
      if (apiCalled) {
        console.log('API already called, skipping...')
        return
      }

      try {
        console.log('=== Result Page Debug ===')
        console.log('Form data received:', formData)
        console.log('========================')
        
        if (!formData || Object.keys(formData).length === 0) {
          console.log('No form data, redirecting to survey')
          router.push('/survey')
          return
        }

        setApiCalled(true)
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
          console.log('=== 새로운 추천 결과 ===')
          console.log('책 제목:', data.data.book.title)
          console.log('책 저자:', data.data.book.author)
          console.log('책 ID:', data.data.book.id)
          console.log('========================')
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
  }, [formData, router])

  // result가 변경될 때 이미지 상태 초기화
  useEffect(() => {
    if (result) {
      setImageLoaded(false)
      setImageError(false)
    }
  }, [result?.book?.id]) // book id가 변경될 때만 리셋

  const handleRestart = () => {
    resetFormData()
    router.push('/survey')
  }

  const handleGoHome = () => {
    resetFormData()
    router.push('/')
  }

  if (isLoading) {
    return (
      <EnhancedLoadingPage 
        title="AI가 당신의 문학적 취향을 분석 중입니다..."
        subtitle="완벽한 책과 향기의 조합을 찾고 있어요"
      />
    )
  }

  if (error) {
    return (
      <EnhancedErrorPage
        title="분석 중 오류가 발생했습니다"
        message={error}
        onRetry={handleRestart}
        retryText="다시 추천받기"
      />
    )
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* 미래지향적 배경 패턴 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 홀로그램 그리드 */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* 스캔라인 효과 */}
        <div 
          className="absolute inset-0 opacity-5 animate-pulse"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.03) 2px,
              rgba(0, 0, 0, 0.03) 4px
            )`
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">


        {result && (
          <div className="space-y-12">
            {/* 메인 추천 섹션 */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 책 추천 */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-black/20 shadow-2xl relative overflow-hidden">
                {/* 디지털 노트 패턴 */}
                <div className="absolute inset-0 z-20" style={{
                  backgroundImage: `
                    repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px),
                    repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
                  `
                }}></div>
                
                {/* 콘텐츠 */}
                <div className="relative z-30">
                  <div className="mb-6">
                  </div>
                  
                  {/* 책 표지 이미지 */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      {/* 로딩 플레이스홀더 */}
                      {!imageLoaded && !imageError && (
                        <div className="w-96 h-144 bg-gray-100 rounded-lg shadow-xl border-2 border-black/20 flex items-center justify-center animate-pulse">
                          <div className="text-gray-400 text-lg font-typewriter text-center">
                            <div>로딩 중...</div>
                          </div>
                        </div>
                      )}
                      
                      {/* 실제 이미지 */}
                      <img 
                        src={getBookCoverPath(result.book.title, result.book.author)}
                        alt={`${result.book.title} 표지`}
                        className={`w-96 h-144 object-cover rounded-lg shadow-xl border-2 border-black/20 transition-opacity duration-500 ${
                          imageLoaded ? 'opacity-100 relative' : 'opacity-0 absolute top-0 left-0'
                        }`}
                        onLoad={(e) => {
                          console.log('Image loaded successfully:', e.currentTarget.src)
                          setImageLoaded(true)
                          setImageError(false)
                        }}
                        onError={(e) => {
                          console.log('Image failed to load:', e.currentTarget.src)
                          setImageError(true)
                          setImageLoaded(false)
                        }}
                      />
                      
                      {/* 에러시 기본 이미지 */}
                      {imageError && (
                        <div className="w-96 h-144 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-xl border-2 border-black/20 flex flex-col items-center justify-center">
                          <div className="text-gray-400 text-center font-typewriter">
                            <div className="text-xl px-6 leading-tight">
                              {result.book.title}
                            </div>
                            <div className="text-xl text-gray-500 mt-4">
                              {result.book.author}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* 그림자 효과 - 이미지가 로드된 경우에만 */}
                      {imageLoaded && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-black/20 to-gray-600/20 rounded-lg blur opacity-30"></div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-black mb-2 font-serif">{result.book.title}</h3>
                      <p className="text-gray-700 text-lg mb-4 font-typewriter">by {result.book.author}</p>
                      <div className="inline-flex px-4 py-2 bg-black/10 rounded-full border border-black/20">
                        <span className="text-black text-sm font-medium font-typewriter">{result.book.genre}</span>
                      </div>
                    </div>
                    
                    <div className="bg-black/5 rounded-2xl p-6 border border-black/10">
                      <p className="text-gray-800 leading-relaxed mb-4 font-typewriter">{result.book.description}</p>
                    </div>
                    
                    {/* 주요 테마 키워드 클라우드 */}
                    {result.book.themes && result.book.themes.length > 0 && (
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600 mb-3 flex items-center gap-2 font-typewriter">
                          <span>주요 테마</span>
                        </div>
                        <TextCloud words={result.book.themes} />
                      </div>
                    )}

                    {/* 작품 속 한 구절 */}
                    {result.book.quote && (
                      <div className="bg-black/5 rounded-2xl p-6 border border-black/10">
                        <div className="flex items-center gap-3 mb-4">

                          <h3 className="text-lg font-bold text-black font-serif">작품 속 한 구절</h3>
                          <div className="flex-1 border-b border-black/20"></div>
                        </div>
                        <TypewriterNote 
                          text={result.book.quote}
                          className="text-gray-800 font-typewriter"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 향기 추천 */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-black/20 shadow-2xl relative overflow-hidden">
                {/* 디지털 노트 패턴 */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px),
                    repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
                  `
                }}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-3xl font-bold text-black font-serif">
                      당신을 위한 북퍼퓸
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-black mb-2 font-serif">{result.fragrance.literaryName}</h3>
                      <p className="text-gray-700 text-lg mb-4 font-typewriter">{result.fragrance.baseScent}</p>
                      <div className="flex justify-center gap-2 mb-4">
                        <div className="px-4 py-2 bg-black/10 rounded-full border border-black/20">
                          <span className="text-black text-sm font-medium font-typewriter">{result.fragrance.category}</span>
                        </div>
                        <div className="px-4 py-2 bg-black/10 rounded-full border border-black/20">
                          <span className="text-black text-sm font-medium font-typewriter">{result.fragrance.intensity}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/5 rounded-2xl p-6 border border-black/10">
                      <p className="text-gray-800 leading-relaxed mb-4 font-typewriter whitespace-pre-wrap break-words overflow-visible text-ellipsis-none" style={{ textOverflow: 'clip', overflow: 'visible', whiteSpace: 'pre-wrap' }}>{result.fragrance.description}</p>
                    </div>
                    
                    {/* 향기 차트 */}
                    <FragranceChart characteristics={result.fragrance.characteristics} />
                  </div>
                </div>
              </div>

              {/* 분위기 섹션 - 별도 카드 */}
              {result.fragrance.mood.length > 0 && (
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-black/20 shadow-2xl relative overflow-hidden">
                  {/* 디지털 노트 패턴 */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px),
                      repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
                    `
                  }}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-3xl font-bold text-black font-serif">
                        향기의 분위기
                      </h2>
                    </div>
                    
                    <div className="bg-black/5 rounded-2xl p-6 border border-black/10">
                      <div className="text-sm text-gray-600 mb-4 font-typewriter">이 향기가 전하는 감정과 분위기</div>
                      <div className="flex flex-wrap gap-3">
                        {result.fragrance.mood.map((mood, index) => (
                          <span key={index} className="px-4 py-2 bg-black/10 text-black rounded-full text-sm border border-black/20 font-typewriter font-medium">
                            {mood}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI 심층 분석 섹션 */}
            {result.deepAnalysis && (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-black/20 shadow-2xl relative overflow-hidden">
                {/* 디지털 노트 패턴 */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px),
                    repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
                  `
                }}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-3xl font-bold text-black font-serif">
                      AI 심층 분석
                    </h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-black/5 rounded-2xl p-6 border border-black/10">
                        <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2 font-serif">
                          당신의 심리 프로필
                        </h3>
                        <p className="text-gray-800 leading-relaxed text-sm font-typewriter">
                          {result.deepAnalysis.userPsychology}
                        </p>
                      </div>
                      
                      <div className="bg-black/5 rounded-2xl p-6 border border-black/10">
                        <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2 font-serif">
                          숨겨진 욕구
                        </h3>
                        <p className="text-gray-800 leading-relaxed text-sm font-typewriter">
                          {result.deepAnalysis.hiddenNeeds}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-black/5 rounded-2xl p-6 border border-black/10">
                        <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2 font-serif">
                          감정적 공명
                        </h3>
                        <p className="text-gray-800 leading-relaxed text-sm font-typewriter">
                          {result.deepAnalysis.emotionalResonance}
                        </p>
                      </div>
                      
                      <div className="bg-black/5 rounded-2xl p-6 border border-black/10">
                        <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2 font-serif">
                          당신만의 키워드
                        </h3>
                        <TextCloud words={result.deepAnalysis.personalKeywords} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 개인화된 추천 이유 */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-black/20 shadow-2xl relative overflow-hidden">
              {/* 디지털 노트 패턴 */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px),
                  repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
                `
              }}></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-3xl font-bold text-black font-serif">
                    당신만을 위한 추천 이유
                  </h2>
                </div>
                
                <div className="bg-black/5 rounded-2xl p-8 border border-black/10">
                  <p className="text-gray-800 leading-relaxed text-lg font-typewriter">
                    {result.matchReason}
                  </p>
                </div>
              </div>
            </div>

            {/* 대안 추천 */}
            {result.alternativeBooks.length > 0 && (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-black/20 shadow-2xl relative overflow-hidden">
                {/* 디지털 노트 패턴 */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px),
                    repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
                  `
                }}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-3xl font-bold text-black font-serif">
                      다른 가능성들
                    </h2>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {result.alternativeBooks.slice(0, 3).map((book, index) => (
                      <div key={book.id} className="bg-black/5 rounded-2xl p-6 border border-black/10 hover:bg-black/10 transition-all duration-300 group">
                        <div className="text-center">

                          <h4 className="text-black font-bold text-lg mb-2 font-serif">{book.title}</h4>
                          <p className="text-gray-700 text-sm font-typewriter">{book.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
          <button
            onClick={handleRestart}
            className="group px-10 py-4 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-xl border-2 border-black/20 font-typewriter"
          >
            <span className="flex items-center gap-3">

              다시 추천받기
            </span>
          </button>
          <button
            onClick={handleGoHome}
            className="group px-10 py-4 bg-white text-black rounded-2xl hover:bg-gray-50 transition-all duration-300 backdrop-blur-sm border-2 border-black/20 font-bold text-lg shadow-xl font-typewriter"
          >
            <span className="flex items-center gap-3">

              홈으로 가기
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
