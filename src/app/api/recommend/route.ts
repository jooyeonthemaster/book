import { NextRequest, NextResponse } from 'next/server'
import { recommendationEngine } from '@/lib/recommendationService'
import { UserPreferences } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const preferences: UserPreferences = await request.json()
    
    // 입력 데이터 검증
    if (!preferences.age || !preferences.gender) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    if (!preferences.favoriteGenres || preferences.favoriteGenres.length === 0) {
      return NextResponse.json(
        { error: '선호 장르를 선택해주세요.' },
        { status: 400 }
      )
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
