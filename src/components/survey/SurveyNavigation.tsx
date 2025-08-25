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
          if (nextStep <= 5) {
            router.push(`/survey/step-${nextStep}`)
          } else {
            router.push('/survey/result')
          }
        }
      }, 100)
    } else if (!isLastStep) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      if (nextStep <= 5) {
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
    <div className="flex justify-center items-center gap-4">
      {/* 이전 버튼 */}
      <button
        onClick={handlePrev}
        disabled={currentStep === 1}
        className={`
          min-w-[120px] px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform border-2 font-typewriter relative overflow-hidden
          ${currentStep === 1 
            ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed' 
            : 'bg-white text-black border-black/15 hover:bg-black hover:text-white hover:border-black hover:scale-[1.02] hover:shadow-lg'
          }
        `}
      >
        <span className="relative z-10">이전</span>
      </button>
      
      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        disabled={nextDisabled}
        className={`
          min-w-[140px] px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform border-2 relative overflow-hidden font-typewriter
          ${nextDisabled
            ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
            : 'bg-black text-white border-black hover:bg-white hover:text-black hover:border-black hover:scale-[1.02] hover:shadow-lg'
          }
        `}
      >
        {!nextDisabled && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
          />
        )}
        <span className="relative z-10">
          {isLastStep ? '결과 보기' : '다음'}
        </span>
      </button>
    </div>
  )
}
