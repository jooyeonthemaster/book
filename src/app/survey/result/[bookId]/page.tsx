'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSurvey } from '@/contexts/SurveyContext'
import { RecommendationResult } from '@/lib/recommendationService'
import ResultDisplay from '@/components/ResultDisplay'
import { EnhancedLoadingPage } from '@/components/EnhancedLoadingPage'
import { EnhancedErrorPage } from '@/components/EnhancedErrorPage'

export default function BookSpecificResultPage() {
  const { formData, resetFormData, bookRecommendations, setBookRecommendation } = useSurvey()
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 초기 로드 상태
  const router = useRouter()
  const params = useParams()
  
  const bookId = params.bookId as string

  useEffect(() => {
    const generateBookSpecificRecommendation = async () => {
      try {
        console.log('=== Book Specific Result Page Debug ===')
        console.log('Book ID:', bookId)
        console.log('Form data received:', formData)
        console.log('=======================================')
        
        // 캐시된 책별 추천이 있으면 바로 사용
        if (bookRecommendations[bookId]) {
          console.log('Using cached book recommendation for ID:', bookId)
          setResult(bookRecommendations[bookId])
          setIsInitialLoad(false)
          return
        }
        
        if (!formData || Object.keys(formData).length === 0) {
          console.log('No form data, redirecting to survey')
          router.push('/survey')
          return
        }

        if (!bookId || isNaN(parseInt(bookId))) {
          throw new Error('잘못된 책 ID입니다.')
        }
        
        // 특정 책 ID로 추천 API 호출 (로딩 없이 바로)
        const response = await fetch(`/api/recommend/${bookId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '추천 생성에 실패했습니다.')
        }

        if (data.success) {
          console.log('=== 책별 추천 결과 ===')
          console.log('책 제목:', data.data.book.title)
          console.log('책 저자:', data.data.book.author)
          console.log('책 ID:', data.data.book.id)
          console.log('====================')
          setResult(data.data)
          // 책별 추천 결과를 캐시에 저장
          setBookRecommendation(bookId, data.data)
        } else {
          throw new Error('추천 결과를 받을 수 없습니다.')
        }
      } catch (error) {
        console.error('Error:', error)
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setIsInitialLoad(false) // 로딩 완료
      }
    }

    generateBookSpecificRecommendation()
  }, [formData, router, bookId])

  const handleRestart = () => {
    resetFormData()
    router.push('/survey')
  }

  const handleGoHome = () => {
    resetFormData()
    router.push('/')
  }

  const handleGoBack = () => {
    // 브라우저 뒤로가기 사용 (더 자연스러운 네비게이션)
    router.back()
  }

  // 초기 로딩 중이거나 에러가 있을 때만 에러 페이지 표시
  if (isInitialLoad && !result) {
    return <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100"></div> // 빈 화면
  }

  if (error && !result) {
    return (
      <EnhancedErrorPage
        title="추천 생성 중 오류가 발생했습니다"
        message={error}
        onRetry={handleGoBack}
        retryText="다른 추천 보기"
      />
    )
  }

  if (!result) {
    return (
      <EnhancedErrorPage
        title="추천 결과를 찾을 수 없습니다"
        message="다시 시도해주세요."
        onRetry={handleGoBack}
        retryText="다른 추천 보기"
      />
    )
  }

  return (
    <div>
      {/* 뒤로 가기 버튼 */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={handleGoBack}
          className="group px-6 py-3 bg-white/90 backdrop-blur-sm text-black rounded-xl hover:bg-white transition-all duration-300 shadow-lg border border-black/10 font-typewriter"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            돌아가기
          </span>
        </button>
      </div>

      <ResultDisplay 
        result={result}
        onRestart={handleRestart}
        onGoHome={handleGoHome}
        showAlternatives={false} // 무한 루프 방지를 위해 대안 추천 숨김
        showShareButton={true}
      />
    </div>
  )
}
