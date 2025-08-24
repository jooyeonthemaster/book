'use client'

import { useRouter } from 'next/navigation'
import { useSurvey } from '@/contexts/SurveyContext'

interface SurveyNavigationProps {
  onNext?: () => void
  onPrev?: () => void
  nextDisabled?: boolean
  isLastStep?: boolean
}

export function SurveyNavigation({ 
  onNext, 
  onPrev, 
  nextDisabled = false,
  isLastStep = false 
}: SurveyNavigationProps) {
  const router = useRouter()
  const { currentStep, setCurrentStep } = useSurvey()

  const handlePrev = () => {
    if (onPrev) {
      onPrev()
    } else if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      router.push(`/survey/step-${prevStep}`)
    }
  }

  const handleNext = () => {
    if (onNext) {
      // 커스텀 onNext 실행 후 자동으로 다음 페이지로 이동
      onNext()
      
      // 약간의 지연 후 페이지 이동 (데이터 업데이트 완료 대기)
      setTimeout(() => {
        if (isLastStep) {
          // 마지막 단계에서는 결과 페이지로 이동
          router.push('/survey/result')
        } else {
          const nextStep = currentStep + 1
          setCurrentStep(nextStep)
          if (nextStep <= 8) {
            router.push(`/survey/step-${nextStep}`)
          } else {
            router.push('/survey/result')
          }
        }
      }, 100)
    } else if (!isLastStep) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      if (nextStep <= 8) {
        router.push(`/survey/step-${nextStep}`)
      } else {
        router.push('/survey/result')
      }
    } else {
      // isLastStep이 true이고 onNext가 없는 경우에도 결과 페이지로 이동
      router.push('/survey/result')
    }
  }

  return (
    <div className="flex justify-center items-center pt-8 gap-6">
      {/* 이전 버튼 - 개선된 디자인 */}
      <button
        onClick={handlePrev}
        disabled={currentStep === 1}
        className={`
          min-w-[120px] px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform border
          ${currentStep === 1 
            ? 'bg-gray-700/30 text-gray-400 border-gray-600/30 cursor-not-allowed' 
            : 'bg-white/15 text-white border-white/20 hover:bg-white/25 hover:border-white/40 hover:scale-105 hover:shadow-lg'
          }
        `}
      >
        ← 이전
      </button>
      
      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        disabled={nextDisabled}
        className={`
          min-w-[140px] lego-text text-lg px-8 py-3 rounded-xl transition-all duration-300 hover-glow transform border
          ${nextDisabled
            ? 'bg-gray-600/40 text-gray-300 border-gray-500/40 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-pink-400/50 hover:from-pink-600 hover:to-purple-600 hover:border-pink-300 hover:scale-105 hover:shadow-xl'
          }
        `}
      >
        {isLastStep ? '🎯 결과 보기' : '다음 →'}
      </button>
    </div>
  )
}
