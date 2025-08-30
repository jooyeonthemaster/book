'use client'

import { useRouter } from 'next/navigation'

export function SurveyStartButton() {
  const router = useRouter()

  const handleStartSurvey = () => {
    router.push('/survey')
  }

  return (
    <section className="relative z-10 px-4 pb-6 flex-shrink-0 xs:xs-optimized xs:pb-3">
      <div className="max-w-4xl mx-auto">
        {/* 미래지향적 화이트 설문 인터페이스 */}
        <div className="bg-white/95 backdrop-blur-xl border border-black/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden xs:xs-card xs:rounded-2xl">
          {/* 디지털 노트북 패턴 */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(90deg, transparent 0px, transparent 24px, rgba(0,0,0,0.02) 25px, rgba(0,0,0,0.02) 26px),
              repeating-linear-gradient(0deg, transparent 0px, transparent 29px, rgba(0,0,0,0.03) 30px, rgba(0,0,0,0.03) 31px)
            `
          }}></div>
          
          <div className="relative z-10">
            <div className="text-center mb-4 xs:mb-2">
              <div 
                className="w-full h-px bg-gradient-to-r from-transparent via-black to-transparent mb-3 opacity-20 xs:mb-2 xs:xs-reduce-motion"
                style={{
                  animation: 'pulse-glow 5s ease-in-out infinite'
                }}
              ></div>
              <h2 className="font-serif text-xl md:text-2xl text-black font-bold mb-3 xs:xs-title xs:mb-2">
                <span className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent">
                  당신만의 추천을 받아보세요
                </span>
              </h2>
            </div>
            
            <div className="text-gray-700 leading-relaxed mb-4 font-typewriter text-sm text-center xs:xs-text xs:mb-3">
              간단한 질문들에 답하시면 AI가 당신에게<br className="xs:hidden" />
              <span className="xs:inline hidden"> </span>완벽한 책과 향수 조합을 추천해드려요
            </div>
            
            {/* 단계 안내 - 미래적 스타일 */}
            <div className="grid grid-cols-3 gap-2 mb-6 text-gray-700 xs:grid-cols-3 xs:gap-1 xs:mb-4">
              <div className="flex flex-col items-center gap-1 font-typewriter text-xs xs:xs-small-text">
                <span className="w-6 h-6 bg-white border border-black/20 rounded-sm flex items-center justify-center text-black font-bold text-xs shadow-sm xs:w-5 xs:h-5">1</span>
                <span className="text-center">기본 정보</span>
              </div>
              <div className="flex flex-col items-center gap-1 font-typewriter text-xs xs:xs-small-text">
                <span className="w-6 h-6 bg-white border border-black/20 rounded-sm flex items-center justify-center text-black font-bold text-xs shadow-sm xs:w-5 xs:h-5">2</span>
                <span className="text-center">독서 취향</span>
              </div>
              <div className="flex flex-col items-center gap-1 font-typewriter text-xs xs:xs-small-text">
                <span className="w-6 h-6 bg-white border border-black/20 rounded-sm flex items-center justify-center text-black font-bold text-xs shadow-sm xs:w-5 xs:h-5">3</span>
                <span className="text-center">AI 추천</span>
              </div>
            </div>
            
            {/* 시작 버튼 */}
            <div className="text-center">
              <button
                onClick={handleStartSurvey}
                className="group relative inline-block xs:xs-reduce-motion"
                style={{
                  animation: 'floating 4s ease-in-out infinite'
                }}
              >
                <div 
                  className="survey-start-button bg-white hover:bg-gray-50 rounded-2xl px-8 py-4 shadow-2xl transform group-hover:scale-105 transition-all duration-300 border-2 border-black relative overflow-hidden xs:xs-button-large xs:rounded-xl xs:px-6 xs:py-3"
                  style={{
                    animation: 'pulse-glow 3s ease-in-out infinite'
                  }}
                >
                  <div className="relative z-10">
                    <div className="font-serif text-lg text-black font-bold xs:text-base">
                      ◦ 설문 시작하기
                    </div>
                    <div className="text-gray-600 text-xs mt-1 font-typewriter xs:xs-small-text xs:mt-0.5">
                      약 1-2분 소요
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* 미래적 서명 */}
            <div className="text-right mt-4 xs:mt-2">
              <div className="inline-block">
                <div className="text-gray-500 font-typewriter text-xs xs:xs-small-text">
                  <span className="text-black">◦</span> BookFestival Team
                </div>
                <div className="w-24 h-px bg-gradient-to-r from-transparent to-black mt-1 opacity-20 xs:w-16"></div>
              </div>
            </div>
          </div>
          
          {/* 미래적 코너 장식 */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-black/10"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-black/10"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-black/10"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-black/10"></div>
        </div>
      </div>
    </section>
  )
}
