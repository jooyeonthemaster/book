'use client'

export function HeroSection() {
  return (
    <section className="relative z-10 pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center items-center mb-8">
          <h1 className="lego-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[6.5rem] leading-none">
            보이는 것보다 향긋한
          </h1>
        </div>
        
        <div className="space-y-6 mb-12">
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed font-semibold">
            🤖 AI가 당신의 <span className="text-yellow-300 font-bold">독서 취향</span>을 분석하여
          </p>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed font-semibold">
            완벽한 <span className="text-green-300 font-bold">책</span>과 어울리는 <span className="text-blue-300 font-bold">향기</span>를 추천해드립니다
          </p>
        </div>

      </div>
    </section>
  )
}

