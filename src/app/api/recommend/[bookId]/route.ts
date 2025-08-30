import { NextRequest, NextResponse } from 'next/server'
import { UserPreferences } from '@/types'
import { SurveyDataMapper } from '@/lib/surveyDataMapper'
import verifiedBooks from '@/data/verified_books.json'
import verifiedFragrances from '@/data/verified_fragrances.json'

export async function POST(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const bookId = parseInt(params.bookId)
    const rawPreferences = await request.json()
    
    console.log('=== Book-specific recommendation API ===')
    console.log('요청된 Book ID:', bookId)
    console.log('Raw preferences:', rawPreferences)
    
    // 지정된 책 찾기
    const selectedBook = verifiedBooks.books.find(book => book.id === bookId)
    console.log('찾은 책:', selectedBook ? `${selectedBook.title} (${selectedBook.author})` : '책을 찾을 수 없음')
    
    if (!selectedBook) {
      console.error(`책 ID ${bookId}를 데이터베이스에서 찾을 수 없습니다.`)
      return NextResponse.json(
        { error: `해당 책(ID: ${bookId})을 찾을 수 없습니다.` },
        { status: 404 }
      )
    }
    
    // 해당 책과 매칭된 향기 찾기
    const matchedFragrance = verifiedFragrances.fragrances.find(
      fragrance => fragrance.bookId === bookId
    )
    if (!matchedFragrance) {
      return NextResponse.json(
        { error: '해당 책에 매칭된 향기를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 사용자 설문 데이터 변환
    const preferences = SurveyDataMapper.mapToUserPreferences(rawPreferences)
    
    // 변환된 데이터 유효성 검증
    const validation = SurveyDataMapper.validateMappedData(preferences)
    if (!validation.isValid) {
      console.error('Validation errors:', validation.errors)
      return NextResponse.json(
        { 
          error: '설문 데이터가 불완전합니다.',
          details: validation.errors.join(', ')
        },
        { status: 400 }
      )
    }

    // 기본 추천 결과 생성 (Gemini API 호출 없이)
    const result = {
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
        id: matchedFragrance.id,
        literaryName: matchedFragrance.literaryName,
        baseScent: matchedFragrance.baseScent,
        description: matchedFragrance.description,
        mood: matchedFragrance.mood || [],
        intensity: matchedFragrance.intensity,
        category: matchedFragrance.category,
        characteristics: matchedFragrance.characteristics || {
          citrus: 0, floral: 0, woody: 0, musk: 0, fruity: 0, spicy: 0
        }
      },
      matchReason: generatePersonalizedReason(selectedBook, matchedFragrance, preferences),
      confidence: 90, // 사용자가 직접 선택한 책이므로 높은 신뢰도
      alternativeBooks: [], // 대안 추천은 제공하지 않음 (무한 루프 방지)
      alternativeFragrances: []
    }
    
    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Book-specific recommendation error:', error)
    return NextResponse.json(
      { 
        error: '추천 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  }
}

// 개인화된 추천 이유 생성 함수
function generatePersonalizedReason(
  book: any, 
  fragrance: any, 
  preferences: UserPreferences
): string {
  const reasons = []

  // 현재 기분과 책의 연관성
  if (preferences.currentMood) {
    const moodBookMapping: { [key: string]: string } = {
      'peaceful': '평온한 마음',
      'curious': '호기심 가득한 상태',
      'melancholy': '사색적인 기분',
      'energetic': '활기찬 에너지',
      'romantic': '로맨틱한 감성',
      'philosophical': '철학적 사고'
    }
    
    const moodText = moodBookMapping[preferences.currentMood] || preferences.currentMood
    reasons.push(`현재 ${moodText}에 있는 당신에게 '${book.title}'은 완벽한 선택입니다`)
  }

  // 인생 단계와 책의 연관성
  if (preferences.lifeStage) {
    const lifeStageMapping: { [key: string]: string } = {
      'youth_growth': '성장의 시기',
      'love_relationship': '사랑과 관계를 고민하는 시기',
      'career_success': '커리어 성공을 추구하는 시기',
      'family_responsibility': '가족에 대한 책임감을 느끼는 시기',
      'stability_maturity': '안정과 성숙을 추구하는 시기',
      'freedom_exploration': '자유와 탐험을 원하는 시기',
      'reflection_wisdom': '성찰과 지혜를 구하는 시기'
    }
    
    const stageText = lifeStageMapping[preferences.lifeStage] || preferences.lifeStage
    reasons.push(`${stageText}에 있는 당신의 마음과 깊이 공명할 것입니다`)
  }

  // 향기와의 조화
  if (fragrance.mood && fragrance.mood.length > 0) {
    const fragranceMood = fragrance.mood.slice(0, 2).join(', ')
    reasons.push(`${fragranceMood} 향기는 이 작품의 정서와 완벽하게 어우러져 더욱 몰입감 있는 독서 경험을 선사할 것입니다`)
  }

  // 책의 테마와 개인적 관심사
  if (preferences.themes && preferences.themes.length > 0 && book.themes) {
    const commonThemes = preferences.themes.filter(theme => 
      book.themes.some((bookTheme: string) => 
        bookTheme.toLowerCase().includes(theme.toLowerCase()) ||
        theme.toLowerCase().includes(bookTheme.toLowerCase())
      )
    )
    
    if (commonThemes.length > 0) {
      reasons.push(`특히 관심을 보이신 ${commonThemes.join(', ')} 주제를 깊이 있게 다루고 있어 더욱 의미 있는 독서가 될 것입니다`)
    }
  }

  // 기본 추천 이유
  if (reasons.length === 0) {
    reasons.push(`'${book.title}'의 독특한 세계관과 ${fragrance.literaryName}의 섬세한 향기가 만나 당신만의 특별한 문학적 경험을 만들어낼 것입니다`)
  }

  return reasons.join('. ') + '.'
}
