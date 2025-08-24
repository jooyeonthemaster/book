'use client'

import { useState, useEffect } from 'react'
import { useSurvey } from '@/contexts/SurveyContext'
import { SurveyProgress } from '@/components/survey/SurveyProgress'
import { SurveyNavigation } from '@/components/survey/SurveyNavigation'

export default function Step2Page() {
  const { formData, updateFormData, setCurrentStep } = useSurvey()
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>(formData.favoriteGenres)

  useEffect(() => {
    setCurrentStep(2)
  }, [setCurrentStep])

  const genreCategories = [
    {
      title: "📖 문학 & 글쓰기",
      genres: [
        { name: '소설', icon: '📚' },
        { name: '에세이', icon: '✍️' },
        { name: '시/시집', icon: '🌸' }
      ]
    },
    {
      title: "🎯 실용 & 자기계발",
      genres: [
        { name: '자기계발', icon: '🚀' },
        { name: '경영/경제', icon: '💼' },
        { name: '건강', icon: '💪' }
      ]
    },
    {
      title: "🎓 학문 & 지식",
      genres: [
        { name: '인문학', icon: '🏛️' },
        { name: '과학', icon: '🔬' },
        { name: '역사', icon: '📜' },
        { name: '철학', icon: '🤔' },
        { name: '심리학', icon: '🧠' }
      ]
    },
    {
      title: "🎨 취미 & 라이프스타일",
      genres: [
        { name: '예술', icon: '🎨' },
        { name: '여행', icon: '✈️' },
        { name: '요리', icon: '👨‍🍳' }
      ]
    },
    {
      title: "🌟 장르소설",
      genres: [
        { name: 'SF/판타지', icon: '🚀' },
        { name: '추리/스릴러', icon: '🔍' },
        { name: '로맨스', icon: '💕' }
      ]
    },
    {
      title: "🙏 종교 & 영성",
      genres: [
        { name: '종교/영성', icon: '🙏' }
      ]
    }
  ]

  const handleGenreChange = (genreName: string) => {
    setFavoriteGenres(prev => 
      prev.includes(genreName)
        ? prev.filter(g => g !== genreName)
        : [...prev, genreName]
    )
  }

  const handleNext = () => {
    updateFormData({ favoriteGenres })
  }

  const isValid = favoriteGenres.length > 0

  return (
    <div className="h-screen flex items-center justify-center px-3 py-4 overflow-hidden">
      <div className="max-w-4xl w-full h-full flex flex-col">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl h-full flex flex-col">
          {/* 헤더 섹션 - 컴팩트 */}
          <div className="flex-shrink-0">
            <SurveyProgress />
            
            <div className="text-center mb-4">
              <h1 className="lego-text text-2xl md:text-3xl mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                좋아하는 장르를 선택해주세요
              </h1>
              <p className="text-sm text-white">복수 선택 가능 • 취향에 맞는 책을 추천해드려요</p>
            </div>
          </div>
          
          {/* 메인 콘텐츠 - 스크롤 가능 */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 mb-4 pr-2 custom-scrollbar">
            {genreCategories.map((category, categoryIndex) => (
              <div key={category.title} className="space-y-2">
                {/* 카테고리 헤더 - 컴팩트 */}
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{category.title}</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
                </div>
                
                {/* 장르 버튼들 - 더 작고 조밀하게 */}
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {category.genres.map(genre => {
                    const isSelected = favoriteGenres.includes(genre.name)
                    return (
                      <button
                        key={genre.name}
                        type="button"
                        onClick={() => handleGenreChange(genre.name)}
                        className={`
                          group relative p-2 rounded-lg border transition-all duration-200
                          ${isSelected 
                            ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-pink-400 text-white shadow-md'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
                          }
                        `}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                            {genre.icon}
                          </span>
                          <span className={`text-xs font-medium text-center leading-tight ${
                            isSelected ? 'text-white' : 'text-white'
                          }`}>
                            {genre.name}
                          </span>
                        </div>
                        
                        {/* 선택 표시 */}
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-xs text-pink-600">✓</span>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 하단 섹션 - 고정 */}
          <div className="flex-shrink-0">
            {/* 선택된 장르 표시 - 컴팩트 */}
            {favoriteGenres.length > 0 && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-400/30">
                  <span className="text-pink-300 font-semibold text-sm">
                    ✨ {favoriteGenres.length}개 선택
                  </span>
                  {favoriteGenres.length <= 4 && (
                    <div className="flex gap-1">
                      {favoriteGenres.map(genreName => {
                        const genre = genreCategories
                          .flatMap(cat => cat.genres)
                          .find(g => g.name === genreName)
                        return (
                          <span key={genreName} className="text-xs">
                            {genre?.icon}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            <SurveyNavigation 
              onNext={handleNext}
              nextDisabled={!isValid}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
