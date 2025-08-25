import { NextRequest, NextResponse } from 'next/server'
import { recommendationEngine } from '@/lib/recommendationService'
import { UserPreferences } from '@/types'
import { SurveyDataMapper } from '@/lib/surveyDataMapper'

export async function POST(request: NextRequest) {
  try {
    const rawPreferences = await request.json()
    console.log('Raw preferences received:', rawPreferences)
    
    // 새로운 5단계 설문 데이터를 기존 형식으로 변환
    const preferences = SurveyDataMapper.mapToUserPreferences(rawPreferences)
    console.log('Mapped preferences:', preferences)
    
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

    // 디버그 정보 출력 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      SurveyDataMapper.debugMapping(rawPreferences, preferences)
    }

    // AI 추천 생성
    const recommendation = await recommendationEngine.generateRecommendation(preferences)
    
    return NextResponse.json({
      success: true,
      data: recommendation
    })

  } catch (error) {
    console.error('Recommendation error:', error)
    return NextResponse.json(
      { 
        error: '추천 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  }
}

// 통계 조회 API
export async function GET() {
  try {
    const stats = recommendationEngine.getStats()
    return NextResponse.json({
      success: true,
      stats,
      totalRecommendations: Object.values(stats).reduce((a, b) => a + b, 0)
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: '통계 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}


