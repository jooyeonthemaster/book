'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSurvey } from '@/contexts/SurveyContext'
import { RecommendationResult } from '@/lib/recommendationService'
import ResultDisplay from '@/components/ResultDisplay'
import { EnhancedLoadingPage } from '@/components/EnhancedLoadingPage'
import { EnhancedErrorPage } from '@/components/EnhancedErrorPage'

export default function ResultPage() {
  const { formData, resetFormData, mainRecommendation, setMainRecommendation } = useSurvey()
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiCalled, setApiCalled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const generateRecommendation = async () => {
      // 캐시된 메인 추천이 있으면 바로 사용
      if (mainRecommendation) {
        console.log('Using cached main recommendation')
        setResult(mainRecommendation)
        setIsLoading(false)
        return
      }

      if (apiCalled) {
        console.log('API already called, skipping...')
        return
      }

      try {
        console.log('=== Result Page Debug ===')
        console.log('Form data received:', formData)
        console.log('========================')
        
        if (!formData || Object.keys(formData).length === 0) {
          console.log('No form data, redirecting to survey')
          router.push('/survey')
          return
        }

        setApiCalled(true)
        console.log('Form data:', formData)
        
        // API 호출
        const response = await fetch('/api/recommend', {
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
          console.log('=== 새로운 추천 결과 ===')
          console.log('책 제목:', data.data.book.title)
          console.log('책 저자:', data.data.book.author)
          console.log('책 ID:', data.data.book.id)
          console.log('========================')
          setResult(data.data)
          // 메인 추천 결과를 캐시에 저장
          setMainRecommendation(data.data)
        } else {
          throw new Error('추천 결과를 받을 수 없습니다.')
        }
      } catch (error) {
        console.error('Error:', error)
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    generateRecommendation()
  }, [formData, router, apiCalled])

  const handleRestart = () => {
    resetFormData()
    router.push('/survey')
  }

  const handleGoHome = () => {
    resetFormData()
    router.push('/')
  }

  if (isLoading) {
    return (
      <EnhancedLoadingPage 
        title="AI가 당신의 문학적 취향을 분석 중입니다..."
        subtitle="완벽한 책과 향기의 조합을 찾고 있어요"
      />
    )
  }

  if (error) {
    return (
      <EnhancedErrorPage
        title="분석 중 오류가 발생했습니다"
        message={error}
        onRetry={handleRestart}
        retryText="다시 추천받기"
      />
    )
  }

  return result ? (
    <ResultDisplay 
      result={result}
      onRestart={handleRestart}
      onGoHome={handleGoHome}
      showAlternatives={true}
      showShareButton={true}
    />
  ) : null
}
