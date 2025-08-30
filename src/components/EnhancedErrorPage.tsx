'use client'

interface EnhancedErrorPageProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryText?: string
}

export function EnhancedErrorPage({ 
  title = "오류가 발생했습니다", 
  message = "예상치 못한 문제가 발생했습니다.",
  onRetry,
  retryText = "다시 시도하기"
}: EnhancedErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* 미래지향적 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100">
        {/* 홀로그램 그리드 */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* 에러 스캔라인 효과 */}
        <div 
          className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20"
          style={{
            animation: 'error-scanlines 3s linear infinite'
          }}
        />
        
        {/* 경고 데이터 포인트들 */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full opacity-30 animate-ping" />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-orange-500 rounded-full opacity-40 animate-ping" style={{
          animationDelay: '1s'
        }} />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-red-400 rounded-full opacity-25 animate-ping" style={{
          animationDelay: '2s'
        }} />
      </div>

      {/* 메인 에러 컨테이너 */}
      <div className="max-w-3xl w-full relative z-10">
        {/* 미래지향적 화이트 에러 박스 */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-red-200/50 relative overflow-hidden">
          {/* 디지털 노트 패턴 */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(239,68,68,0.02) 20px, rgba(239,68,68,0.02) 21px),
              repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(239,68,68,0.03) 24px, rgba(239,68,68,0.03) 25px)
            `
          }}></div>
          
          <div className="relative z-10 text-center">
            {/* 에러 아이콘 */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-full border-4 border-red-100 mb-4">
                <div 
                  className="text-4xl text-red-500"
                  style={{
                    animation: 'error-pulse 2s ease-in-out infinite'
                  }}
                >⚠️</div>
              </div>
              
              {/* 시스템 상태 */}
              <div className="text-gray-500 text-xs font-typewriter mb-2">
                System Status: ERROR
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-red-300 to-transparent mb-4"></div>
            </div>

            {/* 에러 메시지 */}
            <div className="mb-8">
              <h1 className="font-serif text-2xl md:text-3xl text-red-600 mb-4 font-bold">
                {title}
              </h1>
              <p className="text-gray-600 text-sm md:text-base font-typewriter leading-relaxed">
                {message}
              </p>
            </div>

            {/* 에러 세부 정보 */}
            <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🔍</span>
                <span className="text-gray-600 font-typewriter text-sm">시스템 진단</span>
              </div>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm font-typewriter">AI 연결 상태 확인 중...</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 text-sm font-typewriter">데이터 무결성 검증 중...</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm font-typewriter">시스템 복구 준비 완료</span>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            {onRetry && (
              <div className="space-y-4">
                <button
                  onClick={onRetry}
                  className="group px-8 py-4 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 font-bold text-sm font-typewriter relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="text-lg group-hover:rotate-180 transition-transform duration-500">🔄</span>
                    {retryText}
                  </span>
                </button>
                
                <div className="text-gray-500 text-xs font-typewriter">
                  문제가 지속되면 잠시 후 다시 시도해주세요
                </div>
              </div>
            )}

            {/* 미래적 코너 장식 */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-red-200"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-red-200"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-red-200"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-red-200"></div>
          </div>
        </div>

        {/* 하단 시스템 정보 */}
        <div className="text-center mt-6">
          <div className="inline-block bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-red-100">
            <div className="text-gray-500 font-typewriter text-xs flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Error Code: LIT_AI_001 • BookFestival v3.0
            </div>
          </div>
        </div>
      </div>

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes error-scanlines {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        
        @keyframes error-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
