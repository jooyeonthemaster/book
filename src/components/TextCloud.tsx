'use client'

import { useEffect, useState } from 'react'

interface TextCloudProps {
  words: string[]
  className?: string
}

interface WordPosition {
  text: string
  size: number
  color: string
  x: number
  y: number
  delay: number
  width: number
  height: number
}

export default function TextCloud({ words, className = '' }: TextCloudProps) {
  const [animatedWords, setAnimatedWords] = useState<WordPosition[]>([])

  // 겹침 방지를 위한 충돌 감지 함수 (개선된 버전)
  const checkCollision = (newWord: WordPosition, existingWords: WordPosition[]): boolean => {
    const padding = 30 // 단어 간 최소 거리 증가
    
    for (const existing of existingWords) {
      // 각 단어의 실제 경계 박스 계산
      const newLeft = newWord.x - newWord.width / 2
      const newRight = newWord.x + newWord.width / 2
      const newTop = newWord.y - newWord.height / 2
      const newBottom = newWord.y + newWord.height / 2
      
      const existingLeft = existing.x - existing.width / 2
      const existingRight = existing.x + existing.width / 2
      const existingTop = existing.y - existing.height / 2
      const existingBottom = existing.y + existing.height / 2
      
      // 패딩을 포함한 충돌 검사
      if (!(newRight + padding < existingLeft || 
            newLeft - padding > existingRight || 
            newBottom + padding < existingTop || 
            newTop - padding > existingBottom)) {
        return true // 충돌 발생
      }
    }
    return false
  }

  // 미리 정의된 영역 시스템 (절대 겹치지 않음) - 개선된 버전
  const getPredefinedLayout = (words: string[]): WordPosition[] => {
    // 키워드 개수를 최대 6개로 제한 (더 깔끔한 레이아웃)
    const maxKeywords = 6
    const limitedWords = words.slice(0, maxKeywords)
    
    // 미리 정의된 레이아웃 (위치 + 크기 + 색상 조합)
    const predefinedLayouts = [
      // 레이아웃 1: 균형잡힌 배치
      [
        { x: 25, y: 30, size: 22, color: 'text-gray-800', maxChars: 8 },   // 왼쪽 상단 - 큰 키워드
        { x: 70, y: 25, size: 18, color: 'text-gray-700', maxChars: 6 },   // 오른쪽 상단 - 중간 키워드
        { x: 20, y: 65, size: 16, color: 'text-gray-600', maxChars: 5 },   // 왼쪽 하단 - 작은 키워드
        { x: 75, y: 60, size: 20, color: 'text-gray-900', maxChars: 7 },   // 오른쪽 하단 - 큰 키워드
        { x: 45, y: 45, size: 14, color: 'text-gray-500', maxChars: 4 },   // 중앙 - 작은 키워드
        { x: 55, y: 75, size: 16, color: 'text-gray-700', maxChars: 5 },   // 중앙 하단 - 작은 키워드
      ],
      // 레이아웃 2: 대각선 배치
      [
        { x: 20, y: 20, size: 24, color: 'text-gray-900', maxChars: 8 },   // 왼쪽 상단 - 메인 키워드
        { x: 60, y: 35, size: 18, color: 'text-gray-700', maxChars: 6 },   // 중앙 - 중간 키워드
        { x: 80, y: 55, size: 16, color: 'text-gray-600', maxChars: 5 },   // 오른쪽 중간 - 작은 키워드
        { x: 30, y: 70, size: 20, color: 'text-gray-800', maxChars: 7 },   // 왼쪽 하단 - 큰 키워드
        { x: 70, y: 80, size: 14, color: 'text-gray-500', maxChars: 4 },   // 오른쪽 하단 - 작은 키워드
        { x: 15, y: 50, size: 16, color: 'text-gray-600', maxChars: 5 },   // 왼쪽 중간 - 작은 키워드
      ],
      // 레이아웃 3: 중앙 집중형
      [
        { x: 50, y: 25, size: 22, color: 'text-gray-900', maxChars: 8 },   // 중앙 상단 - 메인 키워드
        { x: 25, y: 45, size: 18, color: 'text-gray-700', maxChars: 6 },   // 왼쪽 중간 - 중간 키워드
        { x: 75, y: 45, size: 18, color: 'text-gray-700', maxChars: 6 },   // 오른쪽 중간 - 중간 키워드
        { x: 35, y: 70, size: 16, color: 'text-gray-600', maxChars: 5 },   // 왼쪽 하단 - 작은 키워드
        { x: 65, y: 70, size: 16, color: 'text-gray-600', maxChars: 5 },   // 오른쪽 하단 - 작은 키워드
        { x: 50, y: 80, size: 14, color: 'text-gray-500', maxChars: 4 },   // 중앙 하단 - 작은 키워드
      ]
    ]
    
    // 랜덤하게 레이아웃 선택
    const selectedLayout = predefinedLayouts[Math.floor(Math.random() * predefinedLayouts.length)]
    
    // 키워드를 길이순으로 정렬 (긴 키워드부터 큰 위치에 배치)
    const sortedWords = [...limitedWords].sort((a, b) => b.length - a.length)
    
    return sortedWords.map((word, index) => {
      const layout = selectedLayout[index] || selectedLayout[selectedLayout.length - 1] // 폴백
      
      // 키워드가 최대 글자 수를 초과하면 자르기
      const truncatedWord = word.length > layout.maxChars 
        ? word.substring(0, layout.maxChars - 1) + '…'
        : word
      
      return {
        text: truncatedWord,
        size: layout.size,
        color: layout.color,
        x: layout.x,
        y: layout.y,
        delay: index * 150,
        width: truncatedWord.length * (layout.size * 0.7),
        height: layout.size * 1.4
      }
    })
  }

  useEffect(() => {
    // 미리 정의된 레이아웃 시스템 사용 (완전히 새로운 접근)
    const processedWords = getPredefinedLayout(words)
    setAnimatedWords(processedWords)
  }, [words])

  return (
    <div className={`relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm border border-black/10 ${className}`}>
      {/* 구름 배경 효과 */}
      <div className="absolute inset-0">
        {/* 구름 레이어 1 - 더 진한 구름 */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(ellipse 140px 70px at 25% 35%, rgba(0,0,0,0.15) 0%, transparent 60%),
              radial-gradient(ellipse 120px 60px at 75% 65%, rgba(0,0,0,0.12) 0%, transparent 60%),
              radial-gradient(ellipse 100px 50px at 55% 25%, rgba(0,0,0,0.10) 0%, transparent 60%),
              radial-gradient(ellipse 110px 55px at 35% 75%, rgba(0,0,0,0.13) 0%, transparent 60%)
            `
          }}
        />
        
        {/* 구름 레이어 2 - 움직이는 효과 */}
        <div 
          className="absolute inset-0 opacity-25 animate-pulse"
          style={{
            background: `
              radial-gradient(ellipse 180px 90px at 45% 55%, rgba(0,0,0,0.18) 0%, transparent 70%),
              radial-gradient(ellipse 130px 65px at 65% 35%, rgba(0,0,0,0.15) 0%, transparent 70%),
              radial-gradient(ellipse 160px 80px at 20% 60%, rgba(0,0,0,0.12) 0%, transparent 70%)
            `,
            animationDuration: '4s'
          }}
        />
        
        {/* 구름 레이어 3 - 부드러운 안개 효과 */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(ellipse 200px 100px at 50% 50%, rgba(0,0,0,0.08) 0%, transparent 80%)
            `
          }}
        />
        
        {/* 디지털 노트 패턴 */}
        <div className="absolute inset-0 opacity-8" style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.12) 20px, rgba(0,0,0,0.12) 21px),
            repeating-linear-gradient(0deg, transparent 0px, transparent 19px, rgba(0,0,0,0.12) 20px, rgba(0,0,0,0.12) 21px)
          `
        }}></div>
      </div>

      {/* 텍스트 단어들 */}
      {animatedWords.map((word, index) => (
        <div
          key={index}
          className={`absolute transition-all duration-1000 ease-out ${word.color} font-medium hover:scale-110 hover:opacity-100 cursor-default select-none font-typewriter`}
          style={{
            left: `${word.x}%`,
            top: `${word.y}%`,
            fontSize: `${word.size}px`,
            animationDelay: `${word.delay}ms`,
            transform: 'translate(-50%, -50%)',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.5))',
            animation: `fadeIn 1s ease-out ${word.delay}ms forwards`,
            opacity: 0
          }}
        >
          {word.text}
        </div>
      ))}
      
      {/* 미세한 반짝임 효과 - 더 잘 보이게 */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-black rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>


      {/* CSS 애니메이션 정의 */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  )
}


