'use client'

import { useEffect, useState } from 'react'

interface FragranceChartProps {
  characteristics: {
    citrus: number
    floral: number
    woody: number
    musk: number
    fruity: number
    spicy: number
  }
  className?: string
}

export default function FragranceChart({ characteristics, className = '' }: FragranceChartProps) {
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 컴포넌트 마운트 후 애니메이션 시작
    const timer = setTimeout(() => {
      setIsVisible(true)
      setAnimatedValues(characteristics)
    }, 300)

    return () => clearTimeout(timer)
  }, [characteristics])

  const chartItems = [
    { key: 'citrus', label: '시트러스', color: 'from-yellow-500 to-orange-500', icon: '🍋' },
    { key: 'floral', label: '플로럴', color: 'from-pink-500 to-rose-500', icon: '🌸' },
    { key: 'woody', label: '우디', color: 'from-amber-700 to-brown-600', icon: '🌳' },
    { key: 'musk', label: '머스크', color: 'from-gray-600 to-slate-700', icon: '🦌' },
    { key: 'fruity', label: '프루티', color: 'from-red-500 to-pink-600', icon: '🍓' },
    { key: 'spicy', label: '스파이시', color: 'from-orange-600 to-red-700', icon: '🌶️' }
  ]

  return (
    <div className={`space-y-4 ${className} xs:xs-fragrance-chart`}>
      <div className="text-sm text-black mb-4 flex items-center gap-2 xs:xs-text xs:mb-2">
        <span className="text-lg xs:text-base">🎨</span>
        <span>향기 구성 분석</span>
      </div>
      
      {chartItems.map((item, index) => {
        const value = animatedValues[item.key] || 0
        const percentage = Math.max(5, (value / 10) * 100) // 최소 5% 보장
        
        return (
          <div 
            key={item.key} 
            className="group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">{item.icon}</span>
              <div className="w-20 text-sm text-black capitalize font-medium">
                {item.label}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden border border-gray-400">
                <div 
                  className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                  style={{ 
                    width: isVisible ? `${percentage}%` : '0%',
                    boxShadow: value > 0 ? `0 0 15px rgba(0, 0, 0, 0.2)` : 'none'
                  }}
                >
                  {/* 반짝이는 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
                       style={{ transform: 'translateX(-100%)', animation: 'shimmer 2s infinite' }} />
                </div>
              </div>
              <div className="w-12 text-sm text-black text-right font-mono">
                <span className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                  {value}/10
                </span>
              </div>
            </div>
            
            {/* 호버 시 추가 정보 */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-8 text-xs text-black">
              {value > 7 && "매우 강함"}
              {value > 4 && value <= 7 && "적당함"}
              {value > 0 && value <= 4 && "은은함"}
              {value === 0 && "감지되지 않음"}
            </div>
          </div>
        )
      })}
      
      {/* 전체적인 향기 강도 표시 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-center">
          <div className="text-xs text-black mb-2">전체 향기 강도</div>
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {Math.round((Object.values(animatedValues).reduce((a, b) => a + b, 0) / 6) * 10) / 10}/10
          </div>
          <div className="text-xs text-black mt-1">
            {Object.values(animatedValues).reduce((a, b) => a + b, 0) > 30 && "진하고 복합적인 향"}
            {Object.values(animatedValues).reduce((a, b) => a + b, 0) > 15 && Object.values(animatedValues).reduce((a, b) => a + b, 0) <= 30 && "균형잡힌 향"}
            {Object.values(animatedValues).reduce((a, b) => a + b, 0) <= 15 && "은은하고 섬세한 향"}
          </div>
        </div>
      </div>
    </div>
  )
}



