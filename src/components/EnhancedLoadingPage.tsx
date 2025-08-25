'use client'

import { useState, useEffect } from 'react'
import verifiedBooks from '@/data/verified_books.json'

interface EnhancedLoadingPageProps {
  title?: string
  subtitle?: string
}

export function EnhancedLoadingPage({ 
  title = "AI가 분석 중입니다...", 
  subtitle = "당신만의 완벽한 조합을 찾고 있어요" 
}: EnhancedLoadingPageProps) {
  const [currentQuote, setCurrentQuote] = useState('')
  const [currentAuthor, setCurrentAuthor] = useState('')
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // 랜덤 인용문 선택 함수
  const getRandomQuote = () => {
    const books = verifiedBooks.books
    const randomBook = books[Math.floor(Math.random() * books.length)]
    return {
      quote: randomBook.quote,
      author: randomBook.author,
      title: randomBook.title
    }
  }

  useEffect(() => {
    // 초기 인용문 설정
    const initialQuote = getRandomQuote()
    setCurrentQuote(initialQuote.quote)
    setCurrentAuthor(`${initialQuote.author}, 『${initialQuote.title}』`)

    // 5초마다 인용문 변경
    const quoteInterval = setInterval(() => {
      const newQuote = getRandomQuote()
      setCurrentQuote(newQuote.quote)
      setCurrentAuthor(`${newQuote.author}, 『${newQuote.title}』`)
      setQuoteIndex(prev => prev + 1)
    }, 5000)

    // 로딩 진행률 시뮬레이션
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) return prev
        return prev + Math.random() * 3
      })
    }, 200)

    return () => {
      clearInterval(quoteInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* 미래지향적 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100">
        {/* 홀로그램 그리드 */}
        <div 
          className="absolute inset-0 opacity-20"
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
          className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black to-transparent opacity-10"
          style={{
            animation: 'scanlines 8s linear infinite'
          }}
        />
        
        {/* 떠다니는 데이터 포인트들 */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-black rounded-full opacity-20 animate-ping" />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-gray-600 rounded-full opacity-30 animate-ping" style={{
          animationDelay: '2s'
        }} />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-black rounded-full opacity-25 animate-ping" style={{
          animationDelay: '4s'
        }} />
      </div>

      {/* 메인 로딩 컨테이너 */}
      <div className="max-w-4xl w-full relative z-10">
        {/* 미래지향적 화이트 로딩 박스 */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-black/20 relative overflow-hidden">
          {/* 디지털 노트 패턴 */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px),
              repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
            `
          }}></div>
          
          <div className="relative z-10">
            {/* AI 분석 헤더 */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div 
                  className="text-3xl"
                  style={{
                    animation: 'pulse-glow 2s ease-in-out infinite'
                  }}
                >🤖</div>
                <div className="text-gray-500 text-sm font-typewriter">
                  AI Literary Analysis System v3.0
                </div>
              </div>
              
              <h1 className="font-serif text-2xl md:text-3xl text-black mb-3 font-bold">
                {title}
              </h1>
              <p className="text-gray-600 text-sm font-typewriter">
                {subtitle} ✨
              </p>
            </div>

            {/* 미래지향적 로딩 애니메이션 */}
            <div className="mb-8">
              {/* 메인 로딩 스피너 */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* 외부 링 */}
                  <div className="w-24 h-24 border-4 border-black/10 rounded-full"></div>
                  {/* 회전하는 링 */}
                  <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-black rounded-full animate-spin"></div>
                  {/* 내부 펄스 */}
                  <div className="absolute inset-3 w-18 h-18 bg-black/5 rounded-full animate-pulse"></div>
                  {/* 중앙 아이콘 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-2xl animate-bounce">📚</div>
                  </div>
                </div>
              </div>

              {/* 진행률 바 */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-typewriter text-xs">분석 진행률</span>
                  <span className="text-gray-500 font-typewriter text-xs">{Math.round(loadingProgress)}%</span>
                </div>
                <div className="w-full bg-black/10 rounded-lg h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-black to-gray-800 h-full transition-all duration-500 ease-out relative"
                    style={{ 
                      width: `${loadingProgress}%`,
                      animation: 'pulse-glow 3s ease-in-out infinite'
                    }}
                  >
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)'
                    }} />
                  </div>
                </div>
              </div>

              {/* 분석 단계 표시 */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {['감정 분석', '취향 매칭', 'AI 추론', '결과 생성'].map((step, index) => (
                  <div
                    key={step}
                    className={`text-center p-2 rounded-lg border transition-all duration-500 ${
                      loadingProgress > (index + 1) * 20 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white border-black/20 text-gray-600'
                    }`}
                  >
                    <div className="text-xs font-typewriter">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 인용문 섹션 */}
            <div className="bg-black/5 rounded-2xl p-6 border border-black/10 relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📖</span>
                <span className="text-gray-600 font-typewriter text-sm">오늘의 문학</span>
              </div>
              
              {/* 인용문 */}
              <div 
                key={quoteIndex}
                className="mb-4 animate-fade-in"
                style={{
                  animation: 'fadeIn 1s ease-in-out'
                }}
              >
                <blockquote className="text-gray-800 leading-relaxed text-sm md:text-base font-serif italic border-l-4 border-black/20 pl-4 mb-3">
                  "{currentQuote.length > 200 ? currentQuote.substring(0, 200) + '...' : currentQuote}"
                </blockquote>
                <cite className="text-gray-600 text-xs font-typewriter">
                  — {currentAuthor}
                </cite>
              </div>

              {/* 타이핑 인디케이터 */}
              <div className="flex items-center gap-2 text-gray-500">
                <span className="text-xs font-typewriter">AI가 문학을 해석하는 중</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>

            {/* 미래적 코너 장식 */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-black/20"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-black/20"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-black/20"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-black/20"></div>
          </div>
        </div>

        {/* 하단 시스템 정보 */}
        <div className="text-center mt-6">
          <div className="inline-block bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-black/10">
            <div className="text-gray-500 font-typewriter text-xs flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Gemini AI 연결됨 • {new Date().toLocaleTimeString('ko-KR')}
            </div>
          </div>
        </div>
      </div>

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes scanlines {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
