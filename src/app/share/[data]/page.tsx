'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getFirebaseShareData } from '@/lib/firebaseShareService'
import { RecommendationResult } from '@/lib/recommendationService'
import ResultDisplay from '@/components/ResultDisplay'
import { EnhancedLoadingPage } from '@/components/EnhancedLoadingPage'
import { EnhancedErrorPage } from '@/components/EnhancedErrorPage'

export default function SharedResultPage() {
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  
  const shareId = params.data as string

  useEffect(() => {
    const loadSharedData = async () => {
      try {
        if (!shareId) {
          throw new Error('공유 ID가 없습니다.')
        }

        console.log('=== Firebase 공유 페이지 로딩 ===')
        console.log('Share ID:', shareId)
        
        // Firebase에서 공유 데이터 가져오기
        const result = await getFirebaseShareData(shareId)
        
        if (!result) {
          throw new Error('공유 데이터를 찾을 수 없거나 만료되었습니다.')
        }
        
        console.log('Firebase 공유 데이터 로딩 성공:', result.book.title)
        setResult(result)
        
      } catch (error) {
        console.error('Firebase 공유 데이터 로딩 실패:', error)
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadSharedData()
  }, [shareId])

  const handleGoHome = () => {
    router.push('/')
  }

  const handleStartSurvey = () => {
    router.push('/survey')
  }

  if (isLoading) {
    return (
      <EnhancedLoadingPage 
        title="공유된 추천 결과를 불러오는 중..."
        subtitle="잠시만 기다려주세요"
      />
    )
  }

  if (error || !result) {
    return (
      <EnhancedErrorPage
        title="공유 링크를 열 수 없습니다"
        message={error || '유효하지 않은 공유 링크입니다.'}
        onRetry={handleGoHome}
        retryText="홈으로 가기"
      />
    )
  }

  return (
    <div className="relative">
      {/* 공유 페이지 표시 (상단 중앙) */}
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/90 backdrop-blur-sm text-white rounded-full text-sm font-typewriter shadow-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          공유된 추천 결과
        </div>
      </div>

      {/* 결과 표시 */}
      <ResultDisplay 
        result={result}
        showAlternatives={false} // 공유 페이지에서는 대안 추천 숨김
        showShareButton={false} // 공유 페이지에서는 공유 버튼 숨김
        isSharedPage={true} // 공유 페이지임을 표시
        onRestart={handleStartSurvey} // "나도 추천받기"
        onGoHome={handleGoHome} // "홈으로 가기"
      />
    </div>
  )
}
