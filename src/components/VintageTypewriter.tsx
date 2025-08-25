'use client'

import { useState, useEffect } from 'react'

interface VintageTypewriterProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function VintageTypewriter({ 
  text, 
  speed = 100, 
  className = '', 
  onComplete 
}: VintageTypewriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed + Math.random() * 50) // 약간의 불규칙성 추가

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <span className={`font-typewriter ${className}`}>
      {displayText}
      <span 
        className={`inline-block w-0.5 h-6 bg-black ml-1 ${
          showCursor ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-100`}
        style={{
          animation: currentIndex >= text.length ? 'cursor-blink 1s infinite' : 'cursor-blink 1s infinite'
        }}
      />
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}
