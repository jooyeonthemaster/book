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
      <div className="bg-white/90 rounded-2xl p-8 border border-black/20 backdrop-blur-sm relative overflow-hidden shadow-lg">
        {/* 노트 라인들 */}
        <div className="absolute inset-0 opacity-15">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="border-b border-black/20 h-8"
              style={{ marginTop: `${i * 32}px` }}
            />
          ))}
        </div>
        


        {/* 타이핑 텍스트 */}
        <div className="relative z-10 font-typewriter text-sm leading-relaxed">
          <p className="text-black whitespace-pre-wrap font-medium">
            {displayedText}
            {isTyping && showCursor && (
              <span className="inline-block w-0.5 h-5 bg-black ml-1 animate-pulse" />
            )}
          </p>
        </div>

        {/* 종이 그림자 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/3 pointer-events-none rounded-2xl" />
        
        {/* 종이 모서리 접힌 효과 */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-gray-100/50 to-transparent border-l border-b border-black/20 rounded-bl-lg" />
      </div>

      {/* 타이핑 진행 상태 */}
      {isTyping && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 bg-black/10 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-black to-gray-700 h-full transition-all duration-100 ease-out"
              style={{ width: `${(currentIndex / text.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 font-typewriter">
            {Math.round((currentIndex / text.length) * 100)}%
          </span>
        </div>
      )}

      {/* 완료 후 효과 */}
      {!isTyping && currentIndex >= text.length && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/10 rounded-full border border-black/20">
            <span className="text-black text-sm">✨</span>
            <span className="text-black text-sm font-medium font-typewriter">작성 완료</span>
          </div>
        </div>
      )}
    </div>
  )
}


