'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { UserPreferences } from '@/types'

interface SurveyContextType {
  formData: UserPreferences
  updateFormData: (data: Partial<UserPreferences>) => void
  resetFormData: () => void
  currentStep: number
  setCurrentStep: (step: number) => void
  totalSteps: number
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

  const updateFormData = (data: Partial<UserPreferences>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const resetFormData = () => {
    setFormData(initialFormData)
    setCurrentStep(1)
  }

  return (
    <SurveyContext.Provider value={{
      formData,
      updateFormData,
      resetFormData,
      currentStep,
      setCurrentStep,
      totalSteps
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
