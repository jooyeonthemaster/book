'use client'

import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 모바일 디바이스 체크
    const checkMobile = () => {
      const mobile = window.innerWidth < 480 || 'ontouchstart' in window
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // 모바일에서는 커서 효과 비활성화
    if (isMobile) {
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return // 모바일에서는 실행하지 않음
    let trailId = 0

    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY }
      setMousePosition(newPosition)

      // 트레일 효과 추가
      setTrails(prev => {
        const newTrail = { ...newPosition, id: trailId++ }
        const updatedTrails = [newTrail, ...prev].slice(0, 8) // 최대 8개 트레일
        return updatedTrails
      })
    }

    document.addEventListener('mousemove', handleMouseMove)

    // 트레일 페이드아웃
    const trailInterval = setInterval(() => {
      setTrails(prev => prev.slice(0, -1))
    }, 50)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      clearInterval(trailInterval)
    }
  }, [])

  // 모바일에서는 아무것도 렌더링하지 않음
  if (isMobile) {
    return null
  }

  return (
    <>
      {/* 메인 커서 */}
      <div
        className="custom-cursor"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />
      
      {/* 커서 트레일 */}
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="custom-cursor-trail"
          style={{
            left: trail.x - 2,
            top: trail.y - 2,
            opacity: (trails.length - index) / trails.length * 0.5,
            transform: `scale(${(trails.length - index) / trails.length})`,
            transition: 'opacity 0.1s ease, transform 0.1s ease'
          }}
        />
      ))}
    </>
  )
}
