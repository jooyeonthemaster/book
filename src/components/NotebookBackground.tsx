'use client'

import { useEffect, useState } from 'react'

export function NotebookBackground() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 480)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* 미래지향적 화이트 & 블랙 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100">
        
        {/* 홀로그램 그리드 효과 */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
          }}
        />
        
        {/* 미래적 스캔라인 */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)',
          }}
        />
        
        {/* 홀로그램 경계선 */}
        <div className="absolute left-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-black to-transparent opacity-20" />
        <div className="absolute right-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-black to-transparent opacity-20" />
        
        {/* 미래적 데이터 포인트들 - 모바일에서는 단순화 */}
        {!isMobile && (
          <div className="absolute left-8 top-0 bottom-0 flex flex-col justify-start pt-8">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i}
                className="w-2 h-2 bg-black border border-gray-300 rounded-sm mb-8 opacity-30"
                style={{
                  transform: `rotate(${i * 2}deg)`,
                  boxShadow: '0 0 3px rgba(0, 0, 0, 0.1)'
                }}
              />
            ))}
          </div>
        )}
        
        {/* 고급 모핑 글로우 효과들 - 모바일에서는 비활성화 */}
        {!isMobile && (
          <>
            <div 
              className="absolute top-20 left-1/4 w-32 h-32 bg-black opacity-3 blur-3xl"
              style={{
                animation: 'morphing-glow 8s ease-in-out infinite, floating 6s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute bottom-32 right-1/3 w-24 h-24 bg-black opacity-4 blur-2xl"
              style={{
                animation: 'morphing-glow 10s ease-in-out infinite reverse, floating 7s ease-in-out infinite',
                animationDelay: '2s'
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 w-20 h-20 bg-black opacity-5 blur-xl"
              style={{
                animation: 'morphing-glow 12s ease-in-out infinite, floating 5s ease-in-out infinite',
                animationDelay: '4s'
              }}
            />
          </>
        )}
        
        {/* 미래적 파티클 효과 */}
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-black rounded-full opacity-40 animate-ping" />
        <div className="absolute bottom-1/3 left-1/3 w-0.5 h-0.5 bg-gray-600 rounded-full opacity-30 animate-ping" style={{
          animationDelay: '1.5s'
        }} />
        <div className="absolute top-3/4 right-1/2 w-1.5 h-1.5 bg-black rounded-full opacity-50 animate-ping" style={{
          animationDelay: '3s'
        }} />
        
        {/* 미래적 스캔라인 효과 */}
        <div 
          className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black to-transparent opacity-10"
          style={{
            animation: 'scanlines 15s linear infinite'
          }}
        />
        <div 
          className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-5"
          style={{
            animation: 'scanlines 20s linear infinite',
            animationDelay: '7s'
          }}
        />
        
        {/* 디지털 노트 오버레이 */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.005) 50%, transparent 100%),
            radial-gradient(circle at 25% 75%, rgba(0,0,0,0.01) 0%, transparent 60%),
            radial-gradient(circle at 75% 25%, rgba(0,0,0,0.01) 0%, transparent 60%)
          `
        }} />
      </div>
    </div>
  )
}
