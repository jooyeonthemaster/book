// 사용자 입력 데이터 타입
export interface UserPreferences {
  // 새로운 5단계 질문 필드들
  currentMood: string          // 1단계: 현재 감정 상태
  lifeStage: string           // 2단계: 인생 단계
  storyStyle: string          // 3단계: 선호하는 이야기 방식
  themes: string[]            // 4단계: 관심 주제들
  bookMeaning: string         // 5단계: 책의 의미 (주관식)
  
  // 기존 필드들 (호환성 유지)
  age: string
  gender: string
  favoriteGenres: string[]
  readingHabits: string
  moodPreference: string
  fragrancePreference: string
  personalityTraits: string[]
  additionalNotes: string
}

// 책 데이터 타입
export interface Book {
  id: number
  title: string
  author: string
  genre: string[]
  description: string
  mood: string[]
  themes: string[]
  readingTime: string
  difficulty: 'easy' | 'medium' | 'hard'
  coverImage?: string
  publishYear: number
  rating: number
}

// 향기 데이터 타입
export interface Fragrance {
  id: number
  name: string
  category: string
  notes: {
    top: string[]
    middle: string[]
    base: string[]
  }
  mood: string[]
  season: string[]
  timeOfDay: string[]
  intensity: 'light' | 'medium' | 'strong'
  description: string
  matchingGenres: string[]
}

// AI 추천 결과 타입
export interface RecommendationResult {
  book: Book
  fragrance: Fragrance
  matchReason: string
  confidence: number
  alternativeBooks: Book[]
  alternativeFragrances: Fragrance[]
}

// Gemini API 응답 타입
export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

