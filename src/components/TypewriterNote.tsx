'use client'

import { useState, useEffect } from 'react'

interface TypewriterNoteProps {
  text: string
  speed?: number
  className?: string
}

export default function TypewriterNote({ text, speed = 30, className = '' }: TypewriterNoteProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    // 컴포넌트 마운트 후 1초 뒤에 타이핑 시작
    const startTimer = setTimeout(() => {
      setIsTyping(true)
    }, 1000)

    return () => clearTimeout(startTimer)
  }, [])

  useEffect(() => {
    if (!isTyping || currentIndex >= text.length) {
      if (currentIndex >= text.length) {
        // 타이핑 완료 후 커서 깜빡임 중지
        setTimeout(() => setShowCursor(false), 2000)
      }
      return
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, currentIndex + 1))
      setCurrentIndex(currentIndex + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, speed, isTyping])

  // 커서 깜빡임 효과
  useEffect(() => {
    if (!showCursor) return

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorTimer)
  }, [showCursor])

  return (
    <div className={`relative ${className}`}>
      {/* 노트북 스타일 배경 */}
      <div className="bg-gradient-to-br from-amber-50/10 to-yellow-50/5 rounded-2xl p-8 border border-amber-200/20 backdrop-blur-sm relative overflow-hidden">
        {/* 노트 라인들 */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="border-b border-pink-300/30 h-8"
              style={{ marginTop: `${i * 32}px` }}
            />
          ))}
        </div>
        
        {/* 노트 구멍들 */}
        <div className="absolute left-6 top-0 bottom-0 flex flex-col justify-evenly opacity-20">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border-2 border-pink-300/50"
            />
          ))}
        </div>

        {/* 헤더 */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">📝</span>
            </div>
            <h3 className="text-lg font-bold text-pink-300">작품 속 한 구절</h3>
            <div className="flex-1 border-b border-pink-300/30"></div>
          </div>
        </div>

        {/* 타이핑 텍스트 */}
        <div className="relative z-10 font-mono text-sm leading-relaxed">
          <p className="text-gray-300 whitespace-pre-wrap">
            {displayedText}
            {isTyping && showCursor && (
              <span className="inline-block w-0.5 h-5 bg-pink-400 ml-1 animate-pulse" />
            )}
          </p>
        </div>

        {/* 타이핑 사운드 시각화 */}
        {isTyping && (
          <div className="absolute top-4 right-4 flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-pink-400 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 12 + 8}px`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '300ms'
                }}
              />
            ))}
          </div>
        )}

        {/* 종이 그림자 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 pointer-events-none rounded-2xl" />
        
        {/* 종이 모서리 접힌 효과 */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-100/20 to-transparent border-l border-b border-amber-200/30 rounded-bl-lg" />
      </div>

      {/* 타이핑 진행 상태 */}
      {isTyping && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 bg-white/10 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-400 to-rose-400 h-full transition-all duration-100 ease-out"
              style={{ width: `${(currentIndex / text.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {Math.round((currentIndex / text.length) * 100)}%
          </span>
        </div>
      )}

      {/* 완료 후 효과 */}
      {!isTyping && currentIndex >= text.length && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30">
            <span className="text-green-300 text-sm">✨</span>
            <span className="text-green-300 text-sm font-medium">작성 완료</span>
          </div>
        </div>
      )}
    </div>
  )
}
