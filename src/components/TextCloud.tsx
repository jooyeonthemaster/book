'use client'

import { useEffect, useState } from 'react'

interface TextCloudProps {
  words: string[]
  className?: string
}

export default function TextCloud({ words, className = '' }: TextCloudProps) {
  const [animatedWords, setAnimatedWords] = useState<Array<{
    text: string
    size: number
    color: string
    x: number
    y: number
    delay: number
  }>>([])

  useEffect(() => {
    const colors = [
      'text-pink-300',
      'text-purple-300', 
      'text-cyan-300',
      'text-yellow-300',
      'text-green-300',
      'text-blue-300',
      'text-indigo-300',
      'text-rose-300'
    ]

    const sizes = [
      'text-xs',
      'text-sm', 
      'text-base',
      'text-lg',
      'text-xl',
      'text-2xl'
    ]

    const sizeValues = [12, 14, 16, 18, 20, 24]

    const processedWords = words.map((word, index) => ({
      text: word,
      size: sizeValues[Math.floor(Math.random() * sizeValues.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      x: Math.random() * 80 + 10, // 10-90% 범위
      y: Math.random() * 80 + 10, // 10-90% 범위
      delay: index * 100
    }))

    setAnimatedWords(processedWords)
  }, [words])

  return (
    <div className={`relative h-64 w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-white/10 ${className}`}>
      {animatedWords.map((word, index) => (
        <div
          key={index}
          className={`absolute transition-all duration-1000 ease-out opacity-0 animate-fade-in ${word.color} font-medium hover:scale-110 hover:opacity-100 cursor-default select-none`}
          style={{
            left: `${word.x}%`,
            top: `${word.y}%`,
            fontSize: `${word.size}px`,
            animationDelay: `${word.delay}ms`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {word.text}
        </div>
      ))}
      
      {/* 중앙 포커스 효과 */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 pointer-events-none" />
      
      {/* 반짝이는 효과 */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}
