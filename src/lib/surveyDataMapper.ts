import { UserPreferences } from '@/types'

/**
 * 새로운 5단계 설문조사 데이터를 기존 API 형식으로 변환하는 매퍼
 */
export class SurveyDataMapper {
  
  /**
   * 새로운 설문 데이터를 완전한 UserPreferences 객체로 변환
   */
  static mapToUserPreferences(surveyData: Partial<UserPreferences>): UserPreferences {
    // 현재 5단계 설문조사에서는 currentMood, lifeStage, storyStyle을 수집하지 않음
    // 테마와 책의 의미를 기반으로 다른 필드들을 추론
    
    const mappedData: UserPreferences = {
      // 현재 설문에서 수집하는 필드들
      currentMood: 'balanced', // 기본값
      lifeStage: 'stability_maturity', // 기본값  
      storyStyle: 'realistic_social', // 기본값
      themes: surveyData.themes || [],
      bookMeaning: surveyData.bookMeaning || '',
      
      // 기존 필드들 (테마 기반으로 매핑)
      age: this.mapThemesToAge(surveyData.themes || []),
      gender: '기타', // 성별을 묻지 않으므로 중성적 처리
      favoriteGenres: this.mapThemesToGenres(surveyData.themes || []),
      readingHabits: '편안한 환경에서 꾸준히',
      moodPreference: 'balanced',
      fragrancePreference: this.mapThemesToFragrance(surveyData.themes || []),
      personalityTraits: this.mapThemesToPersonality(surveyData.themes || []),
      additionalNotes: surveyData.bookMeaning || ''
    }

    return mappedData
  }

  /**
   * 테마를 나이대로 매핑
   */
  private static mapThemesToAge(themes: string[]): string {
    const ageMapping: { [key: string]: string } = {
      '사랑과 연애': '20대',
      '꿈과 목표': '20대',
      '새로운 시작': '20대',
      '가족의 의미': '30대',
      '역경과 극복': '30대',
      '사회 정의': '30대',
      '자아 발견': '30대',
      '삶의 의미': '40대',
      '고독과 성찰': '40대',
      '죽음과 영원': '50대 이상',
      '문화와 전통': '50대 이상'
    }
    
    for (const theme of themes) {
      if (ageMapping[theme]) {
        return ageMapping[theme]
      }
    }
    
    return '30대' // 기본값
  }

  /**
   * 테마를 장르로 매핑
   */
  private static mapThemesToGenres(themes: string[]): string[] {
    const genreMapping: { [key: string]: string[] } = {
      '사랑과 연애': ['로맨스', '소설'],
      '가족의 의미': ['소설', '에세이'],
      '우정과 동료': ['소설'],
      '세대 간 이해': ['소설', '에세이'],
      '꿈과 목표': ['자기계발', '에세이'],
      '역경과 극복': ['자기계발', '소설'],
      '자아 발견': ['심리학', '에세이'],
      '새로운 시작': ['자기계발'],
      '사회 정의': ['사회', '정치'],
      '환경과 자연': ['자연', '과학'],
      '문화와 전통': ['역사', '인문학'],
      '미래와 기술': ['과학', 'SF/판타지'],
      '삶의 의미': ['철학', '종교'],
      '죽음과 영원': ['철학', '종교'],
      '행복과 만족': ['철학', '심리학'],
      '고독과 성찰': ['철학', '에세이'],
      '예술과 창조': ['예술', '문학'],
      '음악과 리듬': ['예술', '에세이'],
      '여행과 모험': ['여행', '에세이'],
      '일상의 아름다움': ['에세이', '소설']
    }
    
    const genres: string[] = []
    themes.forEach(theme => {
      if (genreMapping[theme]) {
        genreMapping[theme].forEach(genre => {
          if (!genres.includes(genre)) {
            genres.push(genre)
          }
        })
      }
    })
    
    return genres.length > 0 ? genres : ['소설']
  }

  /**
   * 테마를 향기 선호도로 매핑
   */
  private static mapThemesToFragrance(themes: string[]): string {
    const fragranceMapping: { [key: string]: string } = {
      '사랑과 연애': '달콤하고 감성적인 향',
      '가족의 의미': '따뜻하고 포근한 향',
      '우정과 동료': '상쾌하고 활기찬 향',
      '꿈과 목표': '시원하고 역동적인 향',
      '역경과 극복': '강인하고 깊이 있는 향',
      '자아 발견': '차분하고 은은한 향',
      '사회 정의': '강렬하고 명확한 향',
      '환경과 자연': '자연스럽고 편안한 향',
      '문화와 전통': '우디하고 고급스러운 향',
      '미래와 기술': '모던하고 세련된 향',
      '삶의 의미': '깊이 있고 복합적인 향',
      '죽음과 영원': '신비롭고 깊은 향',
      '행복과 만족': '밝고 긍정적인 향',
      '고독과 성찰': '차분하고 내성적인 향',
      '예술과 창조': '창의적이고 독특한 향',
      '음악과 리듬': '리듬감 있고 활기찬 향',
      '여행과 모험': '이국적이고 모험적인 향',
      '일상의 아름다움': '자연스럽고 일상적인 향'
    }
    
    for (const theme of themes) {
      if (fragranceMapping[theme]) {
        return fragranceMapping[theme]
      }
    }
    
    return '자연스럽고 편안한 향'
  }

  /**
   * 테마를 성격 특성으로 매핑
   */
  private static mapThemesToPersonality(themes: string[]): string[] {
    const personalityMapping: { [key: string]: string[] } = {
      '사랑과 연애': ['감성적', '로맨틱'],
      '가족의 의미': ['따뜻한', '책임감있는'],
      '우정과 동료': ['사교적', '협력적'],
      '세대 간 이해': ['포용적', '이해심많은'],
      '꿈과 목표': ['목표지향적', '도전적'],
      '역경과 극복': ['강인한', '인내심강한'],
      '자아 발견': ['내성적', '성찰적'],
      '새로운 시작': ['모험적', '적응력좋은'],
      '사회 정의': ['정의로운', '비판적'],
      '환경과 자연': ['자연친화적', '환경의식적'],
      '문화와 전통': ['전통적', '문화적'],
      '미래와 기술': ['혁신적', '미래지향적'],
      '삶의 의미': ['철학적', '사색적'],
      '죽음과 영원': ['깊이있는', '성숙한'],
      '행복과 만족': ['긍정적', '낙관적'],
      '고독과 성찰': ['내향적', '사색적'],
      '예술과 창조': ['창의적', '예술적'],
      '음악과 리듬': ['감각적', '리듬감있는'],
      '여행과 모험': ['모험적', '개방적'],
      '일상의 아름다움': ['세심한', '관찰력좋은']
    }
    
    const traits: string[] = []
    themes.forEach(theme => {
      if (personalityMapping[theme]) {
        personalityMapping[theme].forEach(trait => {
          if (!traits.includes(trait)) {
            traits.push(trait)
          }
        })
      }
    })
    
    return traits.length > 0 ? traits : ['균형잡힌', '사려깊은']
  }



  /**
   * 데이터 유효성 검증 - 현재 5단계 설문조사에 맞게 수정
   */
  static validateMappedData(data: UserPreferences): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // 필수 필드: 테마와 책의 의미만 체크
    if (!data.themes || data.themes.length === 0) {
      errors.push('관심 주제가 선택되지 않았습니다.')
    }

    if (!data.bookMeaning || data.bookMeaning.trim() === '') {
      errors.push('책이 갖는 의미가 작성되지 않았습니다.')
    }

    // 매핑된 필드들은 기본값이 설정되므로 체크하지 않음
    // age, gender, favoriteGenres, readingHabits, fragrancePreference, personalityTraits는 자동 생성

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
