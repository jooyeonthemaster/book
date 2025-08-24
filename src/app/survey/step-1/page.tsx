'use client'

import { useState, useEffect } from 'react'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'
import { SurveyNavigation } from '@/components/survey/SurveyNavigation'

export default function Step1Page() {
  const { formData, updateFormData, setCurrentStep } = useSurvey()
  const [age, setAge] = useState(formData.age)
  const [gender, setGender] = useState(formData.gender)

  useEffect(() => {
    setCurrentStep(1)
  }, [setCurrentStep])

  const handleNext = () => {
    updateFormData({ age, gender })
  }

  const isValid = age && gender

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20">
          <SurveyProgress />
          
          <h1 className="lego-text text-3xl md:text-4xl text-center mb-8 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            기본 정보를 알려주세요
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-3 text-pink-300">나이대</label>
              <select 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              >
                <option value="" className="bg-gray-800 text-white">선택해주세요</option>
                <option value="10대" className="bg-gray-800 text-white">10대</option>
                <option value="20대" className="bg-gray-800 text-white">20대</option>
                <option value="30대" className="bg-gray-800 text-white">30대</option>
                <option value="40대" className="bg-gray-800 text-white">40대</option>
                <option value="50대 이상" className="bg-gray-800 text-white">50대 이상</option>
              </select>
            </div>
            
            <div>
              <label className="block text-lg font-semibold mb-3 text-purple-300">성별</label>
              <select 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              >
                <option value="" className="bg-gray-800 text-white">선택해주세요</option>
                <option value="남성" className="bg-gray-800 text-white">남성</option>
                <option value="여성" className="bg-gray-800 text-white">여성</option>
                <option value="기타" className="bg-gray-800 text-white">기타</option>
              </select>
            </div>
          </div>

          <SurveyNavigation 
            onNext={handleNext}
            nextDisabled={!isValid}
          />
        </div>
      </div>
    </div>
  )
}
