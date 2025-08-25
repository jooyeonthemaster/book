'use client'

import { VintageTypewriter } from './VintageTypewriter'

export function HeroSection() {
  return (
    <section className="relative z-10 pt-8 pb-4 px-4 flex-1 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* 미래지향적 화이트 헤더 */}
        <div className="mb-6 text-center">
          <div className="inline-block bg-white/95 backdrop-blur-xl rounded-3xl px-8 py-6 shadow-2xl border border-black/20 relative overflow-hidden">
            {/* 디지털 노트 패턴 */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px),
                repeating-linear-gradient(0deg, transparent 0px, transparent 19px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px)
              `
            }}></div>
            
            <div className="relative z-10">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-black mb-3 font-bold tracking-tight">
                <span 
                  className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent"
                  style={{
                    animation: 'floating 4s ease-in-out infinite'
                  }}
                >
                  보이는 것보다 {'<'}향긋한{'>'}
                </span>
              </h1>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-black to-transparent mb-3 opacity-30"></div>
              <p className="text-gray-600 text-xs uppercase tracking-wider font-typewriter">
                Literary Fragrance Recommendation
              </p>
            </div>
            
            {/* 미래적 코너 장식 */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-black/20"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-black/20"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-black/20"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-black/20"></div>
          </div>
        </div>

        {/* 미래지향적 화이트 인터페이스 */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-black/20 mb-4 relative overflow-hidden">
          {/* 디지털 노트 라인 */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.04) 24px, rgba(0,0,0,0.04) 25px)
            `
          }}></div>
          
          <div className="relative z-10">
            <div className="flex items-start gap-3 mb-4">

              <div className="flex-1">

                <div 
                  className="w-full h-px bg-gradient-to-r from-transparent via-black to-transparent mb-3 opacity-20"
                  style={{
                    animation: 'pulse-glow 4s ease-in-out infinite'
                  }}
                ></div>
                
                <div className="space-y-2 text-black leading-relaxed">
                  <div className="text-sm font-typewriter">
                    <span className="text-gray-600">{'>'}</span>{' '}
                    <VintageTypewriter 
                      text="AI가 당신의 독서 취향을 분석하여..."
                      speed={80}
                      className="text-black"
                    />
                  </div>
                  
                  <div className="text-sm font-typewriter">
                    <span className="text-gray-600">{'>'}</span>{' '}
                    <VintageTypewriter 
                      text="완벽한 책과 어울리는 향기를 추천해드립니다."
                      speed={85}
                      className="text-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 미래적 서명 */}
            <div className="text-right mt-4">
              <div className="inline-block">
                <div className="text-gray-500 font-typewriter text-xs">
                  <span className="text-black">◦</span> AI Literary Curator v3.0
                </div>
                <div className="w-32 h-px bg-gradient-to-r from-transparent to-black mt-1 opacity-20"></div>
              </div>
            </div>
          </div>
          
          {/* 미래적 코너 장식 */}
          <div className="absolute top-1 left-1 w-3 h-3 border-l border-t border-black/10"></div>
          <div className="absolute top-1 right-1 w-3 h-3 border-r border-t border-black/10"></div>
          <div className="absolute bottom-1 left-1 w-3 h-3 border-l border-b border-black/10"></div>
          <div className="absolute bottom-1 right-1 w-3 h-3 border-r border-b border-black/10"></div>
        </div>


      </div>
    </section>
  )
}

