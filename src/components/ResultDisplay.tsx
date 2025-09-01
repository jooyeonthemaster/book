'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { RecommendationResult } from '@/lib/recommendationService'
import { createFirebaseShareUrl, copyFirebaseShareUrl } from '@/lib/firebaseShareService'
import TextCloud from '@/components/TextCloud'
import FragranceChart from '@/components/FragranceChart'
import TypewriterNote from '@/components/TypewriterNote'
import SocialShareModal from '@/components/SocialShareModal'

interface ResultDisplayProps {
  result: RecommendationResult
  onRestart?: () => void
  onGoHome?: () => void
  showAlternatives?: boolean
  showShareButton?: boolean
  isSharedPage?: boolean // 공유 페이지 여부
}

export default function ResultDisplay({ 
  result, 
  onRestart, 
  onGoHome, 
  showAlternatives = true,
  showShareButton = true,
  isSharedPage = false
}: ResultDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>('')
  const [fallbackQueue, setFallbackQueue] = useState<string[]>([])
  const [shareStatus, setShareStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle')
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareUrl, setShareUrl] = useState<string>('')
  const router = useRouter()

  // 책 표지 이미지 경로 생성 함수
  const getBookCoverPath = (title: string, author: string) => {
    // 저자명 매핑 (데이터와 실제 파일명이 다른 경우 처리)
    const authorMapping: { [key: string]: string } = {
      '마테오 B. 비앙키': '마테오 비앙키',
      // 필요시 추가 매핑 가능
    }
    
    // 매핑된 저자명 사용 (없으면 원본 사용)
    const mappedAuthor = authorMapping[author] || author
    const fileName = `${mappedAuthor}_${title}.jpg`
    
    // 한글 파일명을 URL 안전하게 인코딩
    const encodedFileName = encodeURIComponent(fileName)
    const path = `/bookcover/${encodedFileName}`
    
    console.log('=== 이미지 경로 디버깅 ===')
    console.log('원본 저자명:', author)
    console.log('매핑된 저자명:', mappedAuthor)
    console.log('파일명:', fileName)
    console.log('인코딩된 파일명:', encodedFileName)
    console.log('최종 경로:', path)
    console.log('========================')
    
    // 이미지 존재 여부 미리 체크 (브라우저 환경에서만)
    if (typeof window !== 'undefined') {
      const img = new window.Image()
      img.onload = () => console.log('✅ 이미지 존재:', path)
      img.onerror = () => console.log('❌ 이미지 없음:', path)
      img.src = path
    }
    
    return path
  }

  // 대체 경로 후보 생성 (공백 제거, 저자-제목 순서 교체 등)
  const getFallbackCoverPaths = (title: string, author: string) => {
    const authorMapping: { [key: string]: string } = {
      '마테오 B. 비앙키': '마테오 비앙키',
    }
    const mappedAuthor = authorMapping[author] || author
    const titleNoSpaces = title.replace(/\s+/g, '')
    const titleFirstSpaceRemoved = title.replace(/\s/, '')

    const candidates = [
      `${mappedAuthor}_${titleNoSpaces}.jpg`, // 제목 공백 제거
      `${title}_${mappedAuthor}.jpg`,        // 순서 교체 (일부 자산 오류 대응)
      `${titleNoSpaces}_${mappedAuthor}.jpg`, // 교체 + 공백 제거
      `${mappedAuthor}_${titleFirstSpaceRemoved}.jpg`, // 제목 첫 공백만 제거 (특정 케이스)
      `${titleFirstSpaceRemoved}_${mappedAuthor}.jpg`  // 순서 교체 + 첫 공백 제거
    ]

    // URL 인코딩 적용
    return candidates.map((name) => `/bookcover/${encodeURIComponent(name)}`)
  }

  // result가 변경될 때 이미지 상태 초기화
  useEffect(() => {
    if (result) {
      setImageLoaded(false)
      setImageError(false)
      const primary = getBookCoverPath(result.book.title, result.book.author)
      const fallbacks = getFallbackCoverPaths(result.book.title, result.book.author)
      setImageSrc(primary)
      setFallbackQueue(fallbacks)
    }
  }, [result?.book?.id]) // book id가 변경될 때만 리셋

  // 대안 추천 클릭 핸들러
  const handleAlternativeClick = (bookId: number) => {
    console.log('=== 대안 책 클릭 디버깅 ===')
    console.log('클릭된 책 ID:', bookId)
    console.log('alternativeBooks 전체:', result.alternativeBooks)
    console.log('클릭된 책 정보:', result.alternativeBooks.find(book => book.id === bookId))
    console.log('========================')
    router.push(`/survey/result/${bookId}`)
  }

  // SNS 공유 모달 열기
  const handleShare = async () => {
    try {
      setShareStatus('copying')
      
      // Firebase에 저장하고 공유 URL 생성
      const generatedShareUrl = await createFirebaseShareUrl(result)
      setShareUrl(generatedShareUrl)
      
      // 모달 열기
      setShowShareModal(true)
      setShareStatus('success')
      
      // 상태 초기화
      setTimeout(() => setShareStatus('idle'), 2000)
    } catch (error) {
      console.error('Firebase 공유 실패:', error)
      setShareStatus('error')
      setTimeout(() => setShareStatus('idle'), 3000)
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* 미래지향적 배경 패턴 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 홀로그램 그리드 */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* 스캔라인 효과 */}
        <div 
          className="absolute inset-0 opacity-5 animate-pulse"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.03) 2px,
              rgba(0, 0, 0, 0.03) 4px
            )`
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="space-y-12">
          {/* 메인 추천 섹션 */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* 책 추천 */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-black/20 shadow-2xl relative overflow-hidden">
              {/* 디지털 노트 패턴 */}
              <div className="absolute inset-0 z-20" style={{
                backgroundImage: `
                  repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px),
                  repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
                `
              }}></div>
              
              {/* 콘텐츠 */}
              <div className="relative z-30">
                <div className="mb-6">
                </div>
                
                {/* 책 표지 이미지 */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    {/* 로딩 플레이스홀더 */}
                    {!imageLoaded && !imageError && (
                      <div className="w-96 h-144 bg-gray-100 rounded-lg shadow-xl border-2 border-black/20 flex items-center justify-center animate-pulse">
                        <div className="text-gray-400 text-lg font-typewriter text-center">
                          <div>로딩 중...</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Next.js Image 컴포넌트 사용 */}
                    <Image
                      src={imageSrc}
                      alt={`${result.book.title} 표지`}
                      width={384}
                      height={576}
                      className={`w-96 h-144 object-cover rounded-lg shadow-xl border-2 border-black/20 transition-opacity duration-500 ${
                        imageLoaded ? 'opacity-100 relative' : 'opacity-0 absolute top-0 left-0'
                      }`}
                      onLoad={() => {
                        console.log('✅ Next.js Image loaded successfully')
                        setImageLoaded(true)
                        setImageError(false)
                      }}
                      onError={() => {
                        console.log('❌ Next.js Image failed to load', imageSrc)
                        // 대체 경로가 남아있다면 순차 시도
                        setImageLoaded(false)
                        setImageError(false)
                        setFallbackQueue((queue) => {
                          if (queue.length > 0) {
                            const [next, ...rest] = queue
                            console.log('🔁 Fallback 시도:', next)
                            setImageSrc(next)
                            return rest
                          }
                          // 더 이상 대체 경로가 없으면 에러 처리
                          setImageError(true)
                          return []
                        })
                      }}
                      priority={true}
                      quality={85}
                    />
                    
                    {/* 에러시 기본 이미지 */}
                    {imageError && (
                      <div className="w-96 h-144 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-xl border-2 border-black/20 flex flex-col items-center justify-center">
                        <div className="text-gray-400 text-center font-typewriter">
                          <div className="text-xl px-6 leading-tight">
                            {result.book.title}
                          </div>
                          <div className="text-xl text-gray-500 mt-4">
                            {result.book.author}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* 그림자 효과 - 이미지가 로드된 경우에만 */}
                    {imageLoaded && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-black/20 to-gray-600/20 rounded-lg blur opacity-30"></div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-black mb-2 font-serif">{result.book.title}</h3>
                    <p className="text-gray-700 text-lg mb-4 font-typewriter">by {result.book.author}</p>
                    <div className="inline-flex px-4 py-2 bg-black/10 rounded-full border border-black/20">
                      <span className="text-black text-sm font-medium font-typewriter">{result.book.genre}</span>
                    </div>
                  </div>
                  
                  {/* AI의 한줄 소개 섹션 제목 */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-black font-serif">ai의 한줄 소개</h3>
                    <div className="flex-1 border-b border-black/20"></div>
                  </div>
                  <p className="text-gray-800 leading-relaxed mb-6 font-typewriter">{result.book.description}</p>
                  
                  {/* 주요 테마 키워드 클라우드 */}
                  {result.book.themes && result.book.themes.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-lg font-bold text-black font-serif">ai가 도출한 키워드</h3>
                        <div className="flex-1 border-b border-black/20"></div>
                      </div>
                      <TextCloud words={result.book.themes} />
                    </div>
                  )}

                  {/* 작품 속 한 구절 */}
                  {result.book.quote && (
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-lg font-bold text-black font-serif">작품 속 한 구절</h3>
                        <div className="flex-1 border-b border-black/20"></div>
                      </div>
                      <TypewriterNote 
                        text={result.book.quote}
                        className="text-gray-800 font-typewriter"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 향기 추천 */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-black/20 shadow-2xl relative overflow-hidden">
              {/* 디지털 노트 패턴 */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px),
                  repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
                `
              }}></div>
              
              <div className="relative z-10">
                <div className="flex justify-center items-center mb-6">
                  {/* 타이틀 배경 강조 */}
                  <div className="bg-black/90 backdrop-blur-sm px-6 py-3 rounded-2xl border border-black/20 shadow-lg">
                    <h2 className="text-3xl font-bold text-white font-serif text-center">
                      향기로 읽는 책
                    </h2>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-black mb-2 font-serif">{result.fragrance.literaryName}</h3>
                    <p className="text-gray-700 text-lg mb-4 font-typewriter">{result.fragrance.baseScent}</p>
                    <div className="flex justify-center gap-2 mb-4">
                      <div className="px-4 py-2 bg-black/10 rounded-full border border-black/20">
                        <span className="text-black text-sm font-medium font-typewriter">{result.fragrance.category}</span>
                      </div>
                      <div className="px-4 py-2 bg-black/10 rounded-full border border-black/20">
                        <span className="text-black text-sm font-medium font-typewriter">{result.fragrance.intensity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-800 leading-relaxed mb-6 font-typewriter whitespace-pre-wrap break-words overflow-visible text-ellipsis-none" style={{ textOverflow: 'clip', overflow: 'visible', whiteSpace: 'pre-wrap' }}>{result.fragrance.description}</p>
                  
                  {/* 향기 차트 */}
                  <FragranceChart characteristics={result.fragrance.characteristics} />
                </div>
              </div>
            </div>

            {/* 분위기 섹션 - 별도 카드 */}
            {result.fragrance.mood.length > 0 && (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-black/20 shadow-2xl relative overflow-hidden">
                {/* 디지털 노트 패턴 */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px),
                    repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
                  `
                }}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-3xl font-bold text-black font-serif">
                      향기의 분위기
                    </h2>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-4 font-typewriter">이 향기가 전하는 감정과 분위기</div>
                    <div className="flex flex-wrap gap-3">
                      {result.fragrance.mood.map((mood, index) => (
                        <span key={index} className="px-4 py-2 bg-black/10 text-black rounded-full text-sm border border-black/20 font-typewriter font-medium">
                          {mood}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI 심층 분석 섹션 */}
          {result.deepAnalysis && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-black/20 shadow-2xl relative overflow-hidden">
              {/* 디지털 노트 패턴 */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px),
                  repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
                `
              }}></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-3xl font-bold text-black font-serif">
                    AI 심층 분석
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2 font-serif">
                        당신의 심리 프로필
                      </h3>
                      <p className="text-gray-800 leading-relaxed text-sm font-typewriter">
                        {result.deepAnalysis.userPsychology}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2 font-serif">
                        숨겨진 욕구
                      </h3>
                      <p className="text-gray-800 leading-relaxed text-sm font-typewriter">
                        {result.deepAnalysis.hiddenNeeds}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2 font-serif">
                        감정적 공명
                      </h3>
                      <p className="text-gray-800 leading-relaxed text-sm font-typewriter">
                        {result.deepAnalysis.emotionalResonance}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2 font-serif">
                        당신만의 키워드
                      </h3>
                      <TextCloud words={result.deepAnalysis.personalKeywords} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 개인화된 추천 이유 */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-black/20 shadow-2xl relative overflow-hidden">
            {/* 디지털 노트 패턴 */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px),
                repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
              `
            }}></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl font-bold text-black font-serif">
                  당신만을 위한 추천 이유
                </h2>
              </div>
              
              <p className="text-gray-800 leading-relaxed text-lg font-typewriter mb-8">
                {result.matchReason}
              </p>
            </div>
          </div>

          {/* 대안 추천 */}
          {showAlternatives && result.alternativeBooks.length > 0 && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-black/20 shadow-2xl relative overflow-hidden">
              {/* 디지털 노트 패턴 */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px),
                  repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
                `
              }}></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-3xl font-bold text-black font-serif">
                    다른 가능성들
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {result.alternativeBooks.slice(0, 3).map((book, index) => (
                    <div 
                      key={book.id} 
                      className="text-center p-4 hover:bg-black/5 transition-all duration-300 group rounded-xl cursor-pointer border border-transparent hover:border-black/20 hover:shadow-lg"
                      onClick={() => handleAlternativeClick(book.id)}
                    >
                      <h4 className="text-black font-bold text-lg mb-2 font-serif group-hover:text-blue-600 transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-gray-700 text-sm font-typewriter group-hover:text-gray-900">
                        {book.author}
                      </p>
                      <div className="mt-3 text-xs text-gray-500 group-hover:text-gray-700 font-typewriter">
                        클릭하여 상세 추천 보기
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 액션 버튼들 */}
        {(onRestart || onGoHome || showShareButton) && (
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
            {/* 공유하기 버튼 */}
            {showShareButton && (
              <button
                onClick={handleShare}
                disabled={shareStatus === 'copying'}
                className={`group px-10 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-xl border-2 font-typewriter ${
                  shareStatus === 'success' 
                    ? 'bg-green-500 text-white border-green-500/20' 
                    : shareStatus === 'error'
                    ? 'bg-red-500 text-white border-red-500/20'
                    : shareStatus === 'copying'
                    ? 'bg-gray-400 text-white border-gray-400/20 cursor-not-allowed'
                    : 'bg-blue-500 text-white border-blue-500/20 hover:bg-blue-600'
                }`}
              >
                <span className="flex items-center gap-3">
                  {shareStatus === 'copying' && (
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  {shareStatus === 'success' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {shareStatus === 'error' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {shareStatus === 'idle' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  )}
                  {shareStatus === 'copying' && '준비 중...'}
                  {shareStatus === 'success' && 'SNS 공유하기'}
                  {shareStatus === 'error' && '공유 실패'}
                  {shareStatus === 'idle' && 'SNS 공유하기'}
                </span>
              </button>
            )}
            
            {onRestart && (
              <button
                onClick={onRestart}
                className="group px-10 py-4 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-xl border-2 border-black/20 font-typewriter"
              >
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  {isSharedPage ? '나도 추천받기' : '다시 추천받기'}
                </span>
              </button>
            )}
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="group px-10 py-4 bg-white text-black rounded-2xl hover:bg-gray-50 transition-all duration-300 backdrop-blur-sm border-2 border-black/20 font-bold text-lg shadow-xl font-typewriter"
              >
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  홈으로 가기
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* SNS 공유 모달 */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={shareUrl}
        result={result}
      />
    </div>
  )
}
