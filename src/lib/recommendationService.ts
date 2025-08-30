import { UserPreferences } from '@/types'
import verifiedBooks from '@/data/verified_books.json'
import verifiedFragrances from '@/data/verified_fragrances.json'
import { geminiService } from './geminiService'

// 추천 결과 타입 정의
export interface RecommendationResult {
  book: {
    id: number
    title: string
    author: string
    description: string
    genre: string
    themes: string[]
    quote: string
    speaker: string
    keywords: string[]
  }
  fragrance: {
    id: number
    literaryName: string
    baseScent: string
    description: string
    mood: string[]
    intensity: string
    category: string
    characteristics: {
      citrus: number
      floral: number
      woody: number
      musk: number
      fruity: number
      spicy: number
    }
  }
  matchReason: string
  confidence: number
  alternativeBooks: any[]
  alternativeFragrances: any[]
  deepAnalysis?: {
    userPsychology: string
    emotionalResonance: string
    hiddenNeeds: string
    personalKeywords: string[]
  }
}

// 사용 통계 추적을 위한 글로벌 변수
let recommendationStats: { [key: number]: number } = {}

// 설문 응답을 점수화하는 함수들
class RecommendationEngine {
  
  // 나이대별 선호도 매칭
  private getAgePreferences(age: string): {
    preferredComplexity: number
    preferredThemes: string[]
    preferredIntensity: string[]
  } {
    switch (age) {
      case '10대':
        return {
          preferredComplexity: 0.3,
          preferredThemes: ['청춘', '성장', '꿈', '우정', '첫사랑'],
          preferredIntensity: ['light', 'medium']
        }
      case '20대':
        return {
          preferredComplexity: 0.6,
          preferredThemes: ['사랑', '자아', '미래', '도전', '관계'],
          preferredIntensity: ['medium', 'strong']
        }
      case '30대':
        return {
          preferredComplexity: 0.8,
          preferredThemes: ['현실', '가족', '일', '성숙', '선택'],
          preferredIntensity: ['medium', 'strong']
        }
      case '40대':
        return {
          preferredComplexity: 0.9,
          preferredThemes: ['인생', '지혜', '성찰', '책임', '의미'],
          preferredIntensity: ['medium', 'strong']
        }
      case '50대 이상':
        return {
          preferredComplexity: 1.0,
          preferredThemes: ['철학', '역사', '전통', '깊이', '완성'],
          preferredIntensity: ['strong']
        }
      default:
        return {
          preferredComplexity: 0.5,
          preferredThemes: [],
          preferredIntensity: ['medium']
        }
    }
  }

  // 성별별 선호도 매칭 (성향 기반, 편견 배제)
  private getGenderPreferences(gender: string): {
    preferredCategories: string[]
    preferredMoods: string[]
  } {
    // 성별에 따른 일반적 선호도 (개인차 존재)
    switch (gender) {
      case '여성':
        return {
          preferredCategories: ['플로럴', '프루티', '머스크'],
          preferredMoods: ['우아한', '감성적인', '로맨틱', '섬세한']
        }
      case '남성':
        return {
          preferredCategories: ['우디', '스파이시', '시트러스'],
          preferredMoods: ['강렬한', '깊이 있는', '남성적인', '세련된']
        }
      default:
        return {
          preferredCategories: ['시트러스', '플로럴', '우디'],
          preferredMoods: ['균형잡힌', '중성적인', '자연스러운']
        }
    }
  }

  // 장르별 향기 카테고리 매칭
  private getGenreFragranceMapping(): { [key: string]: string[] } {
    return {
      '소설': ['플로럴', '머스크', '우디'],
      '에세이': ['시트러스', '허브/아로마틱', '우디'],
      '시/시집': ['플로럴', '프루티', '허브/아로마틱'],
      '자기계발': ['시트러스', '스파이시', '우디'],
      '경영/경제': ['우디', '레더', '스파이시'],
      '건강': ['시트러스', '허브/아로마틱', '아쿠아틱'],
      '인문학': ['우디', '허브/아로마틱', '머스크'],
      '과학': ['시트러스', '우디', '스파이시'],
      '역사': ['우디', '레더', '스파이시'],
      '철학': ['우디', '머스크', '허브/아로마틱'],
      '심리학': ['플로럴', '머스크', '우디'],
      '예술': ['플로럴', '프루티', '스파이시'],
      '여행': ['시트러스', '아쿠아틱', '프루티'],
      '요리': ['스파이시', '프루티', '허브/아로마틱'],
      'SF/판타지': ['스파이시', '우디', '시트러스'],
      '추리/스릴러': ['우디', '레더', '스파이시'],
      '로맨스': ['플로럴', '프루티', '머스크'],
      '종교/영성': ['허브/아로마틱', '우디', '머스크']
    }
  }

  // 성격 특성별 향기 매칭
  private getPersonalityFragranceMapping(): { [key: string]: string[] } {
    return {
      '내향적': ['머스크', '우디', '허브/아로마틱'],
      '외향적': ['시트러스', '프루티', '스파이시'],
      '감성적': ['플로럴', '머스크', '프루티'],
      '이성적': ['우디', '시트러스', '스파이시'],
      '모험적': ['스파이시', '시트러스', '우디'],
      '안정적': ['머스크', '우디', '허브/아로마틱'],
      '창의적': ['플로럴', '프루티', '스파이시'],
      '실용적': ['시트러스', '우디', '레더'],
      '완벽주의': ['우디', '머스크', '레더'],
      '자유로운': ['시트러스', '아쿠아틱', '프루티'],
      '계획적': ['우디', '레더', '머스크'],
      '즉흥적': ['시트러스', '프루티', '스파이시']
    }
  }

  // 기분별 향기 매칭
  private getMoodFragranceMapping(): { [key: string]: string[] } {
    return {
      '평온한': ['머스크', '허브/아로마틱', '우디'],
      '활기찬': ['시트러스', '프루티', '스파이시'],
      '우울한': ['플로럴', '머스크', '우디'],
      '스트레스받는': ['허브/아로마틱', '시트러스', '아쿠아틱'],
      '설레는': ['플로럴', '프루티', '시트러스'],
      '사색적인': ['우디', '머스크', '허브/아로마틱']
    }
  }

  // 책과 향기 매칭 점수 계산
  private calculateMatchScore(
    book: any, 
    fragrance: any, 
    preferences: UserPreferences
  ): number {
    let score = 0
    const maxScore = 100

    // 1. 나이대 매칭 (20점)
    const agePrefs = this.getAgePreferences(preferences.age)
    if (agePrefs.preferredIntensity.includes(fragrance.intensity)) {
      score += 20
    }

    // 2. 성별 선호도 매칭 (15점)
    const genderPrefs = this.getGenderPreferences(preferences.gender)
    if (genderPrefs.preferredCategories.includes(fragrance.category)) {
      score += 15
    }

    // 3. 장르 매칭 (25점)
    const genreMapping = this.getGenreFragranceMapping()
    const userGenres = preferences.favoriteGenres
    let genreScore = 0
    userGenres.forEach(genre => {
      if (genreMapping[genre]?.includes(fragrance.category)) {
        genreScore += 25 / userGenres.length
      }
    })
    score += genreScore

    // 4. 성격 특성 매칭 (20점)
    const personalityMapping = this.getPersonalityFragranceMapping()
    const userTraits = preferences.personalityTraits || []
    let personalityScore = 0
    userTraits.forEach(trait => {
      if (personalityMapping[trait]?.includes(fragrance.category)) {
        personalityScore += 20 / userTraits.length
      }
    })
    score += personalityScore

    // 5. 현재 기분 매칭 (10점)
    const moodMapping = this.getMoodFragranceMapping()
    if (preferences.currentMood && moodMapping[preferences.currentMood]?.includes(fragrance.category)) {
      score += 10
    }

    // 6. 테마 키워드 매칭 (10점)
    const bookThemes = book.themes || []
    const fragranceMoods = fragrance.mood || []
    let themeScore = 0
    bookThemes.forEach((theme: string) => {
      fragranceMoods.forEach((mood: string) => {
        if (theme.includes(mood) || mood.includes(theme)) {
          themeScore += 2
        }
      })
    })
    score += Math.min(themeScore, 10)

    return Math.min(score, maxScore)
  }

  // 균등 분배를 위한 가중치 적용
  private applyEqualDistributionWeight(fragranceId: number, baseScore: number): number {
    // 사용 통계 초기화
    if (!recommendationStats[fragranceId]) {
      recommendationStats[fragranceId] = 0
    }

    // 사용 빈도가 낮을수록 가중치 증가
    const usageCount = recommendationStats[fragranceId]
    const totalRecommendations = Object.values(recommendationStats).reduce((a, b) => a + b, 0)
    const averageUsage = totalRecommendations / Object.keys(recommendationStats).length || 0
    
    // 평균보다 적게 사용된 향기에 보너스 점수
    const distributionBonus = Math.max(0, (averageUsage - usageCount) * 2)
    
    return baseScore + distributionBonus
  }

  // 메인 추천 함수 - Gemini AI 기반
  public async generateRecommendation(preferences: UserPreferences): Promise<RecommendationResult> {
    try {
      const books = verifiedBooks.books
      const fragrances = verifiedFragrances.fragrances

      // Gemini AI를 통한 추천 생성
      const geminiRecommendation = await geminiService.generateRecommendation(
        preferences,
        books,
        fragrances
      )

      // Gemini 응답을 우리 형식에 맞게 변환
      const selectedBook = geminiRecommendation.selectedBook
      const selectedFragrance = geminiRecommendation.selectedFragrance

      // 사용 통계 업데이트
      recommendationStats[selectedFragrance.id] = (recommendationStats[selectedFragrance.id] || 0) + 1

      // alternativeBooks ID 유효성 검증 및 수정
      const validatedAlternativeBooks = this.validateAlternativeBooks(
        geminiRecommendation.alternativeBooks || [],
        selectedBook.id
      )

      return {
        book: {
          id: selectedBook.id,
          title: selectedBook.title,
          author: selectedBook.author,
          description: selectedBook.description,
          genre: selectedBook.genre,
          themes: selectedBook.themes || [],
          quote: selectedBook.quote || '',
          speaker: selectedBook.speaker || '',
          keywords: selectedBook.keywords || []
        },
        fragrance: {
          id: selectedFragrance.id,
          literaryName: selectedFragrance.literaryName,
          baseScent: selectedFragrance.baseScent,
          description: selectedFragrance.description,
          mood: selectedFragrance.mood || [],
          intensity: selectedFragrance.intensity,
          category: selectedFragrance.category,
          characteristics: selectedFragrance.characteristics || {
            citrus: 0, floral: 0, woody: 0, musk: 0, fruity: 0, spicy: 0
          }
        },
        matchReason: geminiRecommendation.matchReason,
        confidence: geminiRecommendation.confidence,
        alternativeBooks: validatedAlternativeBooks,
        alternativeFragrances: geminiRecommendation.alternativeFragrances || [],
        deepAnalysis: geminiRecommendation.deepAnalysis || undefined
      }
    } catch (error) {
      console.error('Gemini AI 추천 생성 오류:', error)
      
      // Gemini API 실패 시 폴백으로 기존 로직 사용
      console.log('폴백 모드: 기존 로직으로 추천 생성')
      return this.generateFallbackRecommendation(preferences)
    }
  }

  // 폴백 추천 함수 (Gemini API 실패 시 사용)
  private async generateFallbackRecommendation(preferences: UserPreferences): Promise<RecommendationResult> {
    const books = verifiedBooks.books
    const fragrances = verifiedFragrances.fragrances

    let bestMatch: {
      book: any
      fragrance: any
      score: number
    } | null = null

    // 모든 책-향기 조합에 대해 점수 계산
    for (const book of books) {
      // 해당 책과 매칭된 향기 찾기
      const matchedFragrance = fragrances.find(f => f.bookId === book.id)
      
      if (matchedFragrance) {
        const baseScore = this.calculateMatchScore(book, matchedFragrance, preferences)
        const finalScore = this.applyEqualDistributionWeight(matchedFragrance.id, baseScore)
        
        if (!bestMatch || finalScore > bestMatch.score) {
          bestMatch = {
            book,
            fragrance: matchedFragrance,
            score: finalScore
          }
        }
      }
    }

    if (!bestMatch) {
      throw new Error('추천 결과를 생성할 수 없습니다.')
    }

    // 사용 통계 업데이트
    recommendationStats[bestMatch.fragrance.id] = (recommendationStats[bestMatch.fragrance.id] || 0) + 1

    // 대안 추천 생성 (상위 3개)
    const alternatives = books
      .filter(book => book.id !== bestMatch!.book.id)
      .map(book => {
        const fragrance = fragrances.find(f => f.bookId === book.id)
        if (!fragrance) return null
        return {
          book,
          fragrance,
          score: this.calculateMatchScore(book, fragrance, preferences)
        }
      })
      .filter(item => item !== null)
      .sort((a, b) => b!.score - a!.score)
      .slice(0, 3)

    // 매칭 이유 생성
    const matchReason = this.generateMatchReason(bestMatch.book, bestMatch.fragrance, preferences, bestMatch.score)

    return {
      book: {
        id: bestMatch.book.id,
        title: bestMatch.book.title,
        author: bestMatch.book.author,
        description: bestMatch.book.description,
        genre: bestMatch.book.genre,
        themes: bestMatch.book.themes,
        quote: bestMatch.book.quote,
        speaker: bestMatch.book.speaker,
        keywords: bestMatch.book.keywords
      },
      fragrance: {
        id: bestMatch.fragrance.id,
        literaryName: bestMatch.fragrance.literaryName,
        baseScent: bestMatch.fragrance.baseScent,
        description: bestMatch.fragrance.description,
        mood: bestMatch.fragrance.mood,
        intensity: bestMatch.fragrance.intensity,
        category: bestMatch.fragrance.category,
        characteristics: bestMatch.fragrance.characteristics
      },
      matchReason: `[폴백 모드] ${matchReason}`,
      confidence: Math.round(bestMatch.score),
      alternativeBooks: alternatives.map(alt => alt!.book),
      alternativeFragrances: alternatives.map(alt => alt!.fragrance)
    }
  }

  // 매칭 이유 생성
  private generateMatchReason(book: any, fragrance: any, preferences: UserPreferences, score: number): string {
    const reasons = []

    // 나이대 기반 이유
    if (preferences.age) {
      const agePrefs = this.getAgePreferences(preferences.age)
      if (agePrefs.preferredIntensity.includes(fragrance.intensity)) {
        reasons.push(`${preferences.age}에게 적합한 ${fragrance.intensity} 강도의 향`)
      }
    }

    // 장르 기반 이유
    if (preferences.favoriteGenres.length > 0) {
      const matchingGenres = preferences.favoriteGenres.slice(0, 2).join(', ')
      reasons.push(`선호하시는 ${matchingGenres} 장르와 조화로운 ${fragrance.category} 계열`)
    }

    // 성격 기반 이유
    if (preferences.personalityTraits && preferences.personalityTraits.length > 0) {
      const mainTrait = preferences.personalityTraits[0]
      reasons.push(`${mainTrait} 성향에 어울리는 ${fragrance.literaryName}`)
    }

    // 기분 기반 이유
    if (preferences.currentMood) {
      reasons.push(`현재 ${preferences.currentMood} 기분에 맞는 향기`)
    }

    // 책 테마 기반 이유
    if (book.themes && book.themes.length > 0) {
      const mainTheme = book.themes[0]
      reasons.push(`'${book.title}'의 ${mainTheme} 테마와 완벽한 조화`)
    }

    const finalReason = reasons.length > 0 
      ? reasons.join(', ') + `를 고려하여 ${score}% 일치도로 추천드립니다.`
      : `당신의 취향을 종합 분석하여 ${score}% 일치도로 추천드립니다.`

    return finalReason
  }

  // 통계 리셋 (테스트용)
  public resetStats(): void {
    recommendationStats = {}
  }

  // alternativeBooks ID 유효성 검증 및 수정
  private validateAlternativeBooks(alternativeBooks: any[], mainBookId: number): any[] {
    const books = verifiedBooks.books
    const validatedBooks: any[] = []
    
    console.log('=== Alternative Books 유효성 검증 ===')
    console.log('원본 alternativeBooks:', alternativeBooks)
    console.log('메인 책 ID:', mainBookId)
    
    alternativeBooks.forEach((altBook, index) => {
      // 실제 데이터베이스에서 해당 ID의 책 찾기
      const realBook = books.find(book => book.id === altBook.id)
      
      if (realBook) {
        // ID가 존재하면 실제 데이터로 교체
        const correctedBook = {
          id: realBook.id,
          title: realBook.title,
          author: realBook.author
        }
        
        console.log(`✅ Alternative ${index + 1}: ID ${altBook.id} → ${realBook.title} (${realBook.author})`)
        validatedBooks.push(correctedBook)
      } else {
        // ID가 존재하지 않으면 제목으로 찾기
        const bookByTitle = books.find(book => 
          book.title === altBook.title || 
          book.title.includes(altBook.title) ||
          altBook.title.includes(book.title)
        )
        
        if (bookByTitle && bookByTitle.id !== mainBookId) {
          const correctedBook = {
            id: bookByTitle.id,
            title: bookByTitle.title,
            author: bookByTitle.author
          }
          
          console.log(`🔧 Alternative ${index + 1}: "${altBook.title}" → ID ${bookByTitle.id} (${bookByTitle.title})`)
          validatedBooks.push(correctedBook)
        } else {
          console.log(`❌ Alternative ${index + 1}: "${altBook.title}" - 유효하지 않은 책, 제외됨`)
        }
      }
    })
    
    // 메인 책과 다른 책들만 유지하고, 최대 3개로 제한
    const filteredBooks = validatedBooks
      .filter(book => book.id !== mainBookId)
      .slice(0, 3)
    
    console.log('최종 검증된 alternativeBooks:', filteredBooks)
    console.log('=====================================')
    
    return filteredBooks
  }

  // 현재 통계 조회
  public getStats(): { [key: number]: number } {
    return { ...recommendationStats }
  }
}

// 싱글톤 인스턴스
export const recommendationEngine = new RecommendationEngine()
