import { UserPreferences } from '@/types'

/**
 * 새로운 5단계 설문조사 데이터를 기존 API 형식으로 변환하는 매퍼
 */
export class SurveyDataMapper {
  
  /**
   * 새로운 설문 데이터를 완전한 UserPreferences 객체로 변환
   */
  static mapToUserPreferences(surveyData: Partial<UserPreferences>): UserPreferences {
    // 기본값 설정
    const mappedData: UserPreferences = {
      // 새로운 5단계 필드들 (그대로 유지)
      currentMood: surveyData.currentMood || '',
      lifeStage: surveyData.lifeStage || '',
      storyStyle: surveyData.storyStyle || '',
      themes: surveyData.themes || [],
      bookMeaning: surveyData.bookMeaning || '',
      
      // 기존 필드들 (매핑 로직으로 생성)
      age: this.mapLifeStageToAge(surveyData.lifeStage || ''),
      gender: this.inferGenderFromPreferences(surveyData),
      favoriteGenres: this.mapToFavoriteGenres(surveyData),
      readingHabits: this.mapToReadingHabits(surveyData),
      moodPreference: surveyData.currentMood || '',
      fragrancePreference: this.mapToFragrancePreference(surveyData),
      personalityTraits: this.mapToPersonalityTraits(surveyData),
      additionalNotes: surveyData.bookMeaning || ''
    }

    return mappedData
  }

  /**
   * 인생 단계를 나이대로 매핑
   */
  private static mapLifeStageToAge(lifeStage: string): string {
    const ageMapping: { [key: string]: string } = {
      'youth_growth': '20대',
      'love_relationship': '20대',
      'career_success': '30대',
      'family_responsibility': '30대',
      'stability_maturity': '40대',
      'freedom_exploration': '30대',
      'reflection_wisdom': '50대 이상'
    }
    
    return ageMapping[lifeStage] || '30대'
  }

  /**
   * 선호도 패턴에서 성별 추론 (중성적 접근)
   */
  private static inferGenderFromPreferences(surveyData: Partial<UserPreferences>): string {
    // 성별을 직접 묻지 않으므로 중성적으로 처리
    // 향후 개선: 선호도 패턴 분석으로 더 정교한 추론 가능
    return '기타'
  }

  /**
   * 새로운 설문 데이터를 선호 장르로 매핑
   */
  private static mapToFavoriteGenres(surveyData: Partial<UserPreferences>): string[] {
    const genres: string[] = []
    
    // 스토리 스타일 기반 장르 매핑
    const storyStyleMapping: { [key: string]: string[] } = {
      'emotional_touching': ['소설', '에세이'],
      'intellectual_deep': ['인문학', '철학', '과학'],
      'suspenseful_thrilling': ['추리/스릴러', 'SF/판타지'],
      'realistic_social': ['소설', '사회'],
      'fantasy_imaginative': ['SF/판타지', '예술'],
      'historical_cultural': ['역사', '인문학']
    }

    if (surveyData.storyStyle && storyStyleMapping[surveyData.storyStyle]) {
      genres.push(...storyStyleMapping[surveyData.storyStyle])
    }

    // 테마 기반 장르 추가
    const themeMapping: { [key: string]: string } = {
      'love_romance': '로맨스',
      'growth_change': '자기계발',
      'mystery_unknown': '추리/스릴러',
      'philosophy_life': '철학',
      'art_beauty': '예술',
      'science_future': '과학',
      'history_culture': '역사',
      'nature_environment': '자연',
      'psychology_human': '심리학',
      'society_politics': '사회'
    }

    if (surveyData.themes) {
      surveyData.themes.forEach(theme => {
        if (themeMapping[theme] && !genres.includes(themeMapping[theme])) {
          genres.push(themeMapping[theme])
        }
      })
    }

    // 최소 1개 장르 보장
    if (genres.length === 0) {
      genres.push('소설')
    }

    return genres
  }

  /**
   * 독서 습관 매핑
   */
  private static mapToReadingHabits(surveyData: Partial<UserPreferences>): string {
    const moodMapping: { [key: string]: string } = {
      'peaceful': '조용한 곳에서 천천히',
      'curious': '다양한 장소에서 활발하게',
      'melancholy': '혼자만의 공간에서 깊이',
      'energetic': '짧은 시간에 집중해서',
      'romantic': '분위기 있는 곳에서',
      'philosophical': '사색할 수 있는 환경에서'
    }

    return moodMapping[surveyData.currentMood || ''] || '편안한 환경에서 꾸준히'
  }

  /**
   * 향기 선호도 매핑
   */
  private static mapToFragrancePreference(surveyData: Partial<UserPreferences>): string {
    const moodFragranceMapping: { [key: string]: string } = {
      'peaceful': '차분하고 은은한 향',
      'curious': '상쾌하고 활기찬 향',
      'melancholy': '깊이 있고 복합적인 향',
      'energetic': '시원하고 역동적인 향',
      'romantic': '달콤하고 감성적인 향',
      'philosophical': '우디하고 지적인 향'
    }

    return moodFragranceMapping[surveyData.currentMood || ''] || '자연스럽고 편안한 향'
  }

  /**
   * 성격 특성 매핑
   */
  private static mapToPersonalityTraits(surveyData: Partial<UserPreferences>): string[] {
    const traits: string[] = []

    // 현재 기분 기반 성격 특성
    const moodTraitsMapping: { [key: string]: string[] } = {
      'peaceful': ['안정적', '내향적', '차분한'],
      'curious': ['호기심많은', '외향적', '모험적'],
      'melancholy': ['사색적', '감성적', '내향적'],
      'energetic': ['활동적', '외향적', '긍정적'],
      'romantic': ['감성적', '로맨틱', '예술적'],
      'philosophical': ['지적', '사색적', '완벽주의']
    }

    if (surveyData.currentMood && moodTraitsMapping[surveyData.currentMood]) {
      traits.push(...moodTraitsMapping[surveyData.currentMood])
    }

    // 인생 단계 기반 성격 특성
    const lifeStageTraitsMapping: { [key: string]: string[] } = {
      'youth_growth': ['도전적', '꿈꾸는'],
      'love_relationship': ['사교적', '감정적'],
      'career_success': ['목표지향적', '실용적'],
      'family_responsibility': ['책임감있는', '안정적'],
      'stability_maturity': ['성숙한', '균형잡힌'],
      'freedom_exploration': ['자유로운', '독립적'],
      'reflection_wisdom': ['지혜로운', '성찰적']
    }

    if (surveyData.lifeStage && lifeStageTraitsMapping[surveyData.lifeStage]) {
      lifeStageTraitsMapping[surveyData.lifeStage].forEach(trait => {
        if (!traits.includes(trait)) {
          traits.push(trait)
        }
      })
    }

    return traits.length > 0 ? traits : ['균형잡힌', '사려깊은']
  }

  /**
   * 데이터 유효성 검증
   */
  static validateMappedData(data: UserPreferences): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.age) {
      errors.push('나이 정보가 누락되었습니다.')
    }

    if (!data.gender) {
      errors.push('성별 정보가 누락되었습니다.')
    }

    if (!data.favoriteGenres || data.favoriteGenres.length === 0) {
      errors.push('선호 장르가 누락되었습니다.')
    }

    if (!data.currentMood) {
      errors.push('현재 기분 정보가 누락되었습니다.')
    }

    if (!data.lifeStage) {
      errors.push('인생 단계 정보가 누락되었습니다.')
    }

    if (!data.storyStyle) {
      errors.push('스토리 스타일 정보가 누락되었습니다.')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * 디버그용 매핑 결과 출력
   */
  static debugMapping(originalData: Partial<UserPreferences>, mappedData: UserPreferences): void {
    console.log('=== Survey Data Mapping Debug ===')
    console.log('Original Data:', originalData)
    console.log('Mapped Data:', mappedData)
    console.log('Validation:', this.validateMappedData(mappedData))
    console.log('================================')
  }
}
