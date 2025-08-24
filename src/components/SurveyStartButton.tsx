'use client'

import { useRouter } from 'next/navigation'

export function SurveyStartButton() {
  const router = useRouter()

  const handleStartSurvey = () => {
    router.push('/survey')
  }

  return (
    <section className="relative z-10 px-4 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/30 text-center mx-auto">
          <h2 className="lego-text text-4xl md:text-5xl mb-8 text-white">
            당신만의 추천을 받아보세요
          </h2>
          
          <p className="text-xl text-white mb-12 leading-relaxed font-semibold">
            간단한 질문들에 답하시면<br />
            AI가 당신에게 완벽한 책과 향수 조합을 추천해드려요 ✨
          </p>
          
          <div className="space-y-4 mb-12">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-white">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 bg-yellow-400/30 rounded-full flex items-center justify-center text-yellow-300 font-bold">1</span>
                <span className="font-semibold text-sm sm:text-base">기본 정보</span>
              </div>
              <span className="text-white/70 hidden sm:inline">→</span>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 bg-green-400/30 rounded-full flex items-center justify-center text-green-300 font-bold">2</span>
                <span className="font-semibold text-sm sm:text-base">선호도 조사</span>
              </div>
              <span className="text-white/70 hidden sm:inline">→</span>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 bg-blue-400/30 rounded-full flex items-center justify-center text-blue-300 font-bold">3</span>
                <span className="font-semibold text-sm sm:text-base">AI 추천</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleStartSurvey}
            className="lego-text text-2xl px-12 py-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-2xl hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 hover-glow transform hover:scale-105 shadow-lg"
          >
            🚀 설문 시작하기
          </button>
          
          <p className="text-sm text-white/80 mt-6 font-medium">
            약 3-5분 소요됩니다
          </p>
        </div>
      </div>
    </section>
  )
}
