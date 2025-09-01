// 값 정규화 유틸 - 설문 코드 값을 한국어 표현으로 변환

export function toKoreanMood(code?: string): string {
  switch (code) {
    case 'peaceful':
      return '평온한'
    case 'curious':
      return '호기심'
    case 'melancholy':
      return '사색적인'
    case 'energetic':
      return '활기찬'
    case 'romantic':
      return '로맨틱'
    case 'philosophical':
      return '사색적인'
    default:
      return code || ''
  }
}

export function toKoreanLifeStage(code?: string): string {
  switch (code) {
    case 'youth_growth':
      return '성장의 시기'
    case 'love_relationship':
      return '사랑과 관계를 고민하는 시기'
    case 'career_challenge':
      return '도전과 성취를 추구하는 시기'
    case 'family_responsibility':
      return '가족에 대한 책임감을 느끼는 시기'
    case 'stability_maturity':
      return '안정과 성숙을 추구하는 시기'
    case 'freedom_exploration':
      return '자유와 탐험을 원하는 시기'
    case 'reflection_wisdom':
      return '성찰과 지혜를 구하는 시기'
    default:
      return code || ''
  }
}


