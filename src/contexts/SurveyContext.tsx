'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { UserPreferences } from '@/types'
import { RecommendationResult } from '@/lib/recommendationService'

interface SurveyContextType {
  formData: UserPreferences
  updateFormData: (data: Partial<UserPreferences>) => void
  resetFormData: () => void
  currentStep: number
  setCurrentStep: (step: number) => void
  totalSteps: number
  // 추천 결과 캐시
  mainRecommendation: RecommendationResult | null
  setMainRecommendation: (result: RecommendationResult | null) => void
  bookRecommendations: { [bookId: string]: RecommendationResult }
  setBookRecommendation: (bookId: string, result: RecommendationResult) => void
}

const initialFormData: UserPreferences = {
  // 새로운 5단계 질문 필드들
  currentMood: '',
  lifeStage: '',
  storyStyle: '',
  themes: [],
  bookMeaning: '',
  
  // 기존 필드들 (호환성 유지)
  age: '',
  gender: '',
  favoriteGenres: [],
  readingHabits: '',
  moodPreference: '',
  fragrancePreference: '',
  personalityTraits: [],
  additionalNotes: ''
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined)

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<UserPreferences>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  // 추천 결과 캐시 상태
  const [mainRecommendation, setMainRecommendation] = useState<RecommendationResult | null>(null)
  const [bookRecommendations, setBookRecommendationsState] = useState<{ [bookId: string]: RecommendationResult }>({})

  const updateFormData = useCallback((data: Partial<UserPreferences>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }, [])

  const resetFormData = useCallback(() => {
    setFormData(initialFormData)
    setCurrentStep(1)
    // 캐시도 초기화
    setMainRecommendation(null)
    setBookRecommendationsState({})
  }, [])

  const setBookRecommendation = useCallback((bookId: string, result: RecommendationResult) => {
    setBookRecommendationsState(prev => ({
      ...prev,
      [bookId]: result
    }))
  }, [])

  return (
    <SurveyContext.Provider value={{
      formData,
      updateFormData,
      resetFormData,
      currentStep,
      setCurrentStep,
      totalSteps,
      mainRecommendation,
      setMainRecommendation,
      bookRecommendations,
      setBookRecommendation
    }}>
      {children}
    </SurveyContext.Provider>
  )
}

export function useSurvey() {
  const context = useContext(SurveyContext)
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider')
  }
  return context
}
