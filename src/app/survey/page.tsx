'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSurvey } from '@/contexts/SurveyContext'

export default function SurveyPage() {
  const router = useRouter()
  const { resetFormData } = useSurvey()

  useEffect(() => {
    // 설문 시작 시 데이터 초기화
    resetFormData()
    // 첫 번째 단계로 리다이렉트
    router.push('/survey/step-1')
  }, [resetFormData, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white text-xl">설문을 시작합니다...</div>
    </div>
  )
}
