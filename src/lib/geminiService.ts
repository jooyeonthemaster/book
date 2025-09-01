import { UserPreferences } from '@/types'
import { GeminiResponse } from '@/types'
import { toKoreanMood } from './valueNormalizer'

// Gemini API 서비스 클래스
export class GeminiService {
  private apiKey: string
  private apiUrl: string

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || ''
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'
    
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.')
    }
  }

  // Gemini API 호출
  private async callGeminiAPI(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Gemini API 오류: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const data: GeminiResponse = await response.json()
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('Gemini API에서 응답을 받지 못했습니다.')
      }

      return data.candidates[0].content.parts[0].text
    } catch (error) {
      console.error('Gemini API 호출 오류:', error)
      throw error
    }
  }

  // 사용자 설문 데이터를 바탕으로 책과 향기 추천
  public async generateRecommendation(
    preferences: UserPreferences,
    booksData: any[],
    fragrancesData: any[]
  ): Promise<any> {
    
    // Gemini에게 전달할 프롬프트 생성
    const prompt = this.createRecommendationPrompt(preferences, booksData, fragrancesData)
    
    try {
      // Gemini API 호출
      const response = await this.callGeminiAPI(prompt)
      
      // JSON 파싱 시도
      const cleanResponse = this.cleanJsonResponse(response)
      const recommendation = JSON.parse(cleanResponse)
      
      return recommendation
    } catch (error) {
      console.error('추천 생성 오류:', error)
      throw new Error('AI 추천 생성 중 오류가 발생했습니다.')
    }
  }

  // JSON 응답 정리 (마크다운 제거)
  private cleanJsonResponse(response: string): string {
    // 마크다운 코드 블록 제거
    let cleaned = response.replace(/```json\s*/g, '').replace(/```\s*/g, '')
    
    // 앞뒤 공백 제거
    cleaned = cleaned.trim()
    
    // JSON 시작과 끝 찾기
    const jsonStart = cleaned.indexOf('{')
    const jsonEnd = cleaned.lastIndexOf('}')
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleaned = cleaned.substring(jsonStart, jsonEnd + 1)
    }
    
    return cleaned
  }

  // 책 데이터 요약 생성 - 전체 정보 포함
  private summarizeBooks(books: any[]): string {
    return books.map(book => 
      `ID:${book.id} "${book.title}" by ${book.author} [${book.genre}]
Description: ${book.description}
Quote: "${book.quote}"
Speaker: ${book.speaker}
Themes: ${book.themes?.join(', ') || 'N/A'}
Keywords: ${book.keywords?.join(', ') || 'N/A'}
---`
    ).join('\n')
  }

  // 향기 데이터 요약 생성
  private summarizeFragrances(fragrances: any[]): string {
    return fragrances.map(fragrance => 
      `ID:${fragrance.id} BookID:${fragrance.bookId} "${fragrance.literaryName}" (${fragrance.baseScent}) [${fragrance.category}] - ${fragrance.description.substring(0, 80)}...`
    ).join('\n')
  }

  // 추천 프롬프트 생성 - 완전 개인화된 심층 분석
  private createRecommendationPrompt(
    preferences: UserPreferences,
    booksData: any[],
    fragrancesData: any[]
  ): string {
    // 한국어 표현으로 정규화해 프롬프트에 사용
    const moodKo = toKoreanMood(preferences.currentMood)
    const booksSummary = this.summarizeBooks(booksData)
    const fragrancesSummary = this.summarizeFragrances(fragrancesData)

    return `당신은 인간의 내면을 꿰뚫어보는 심리학자이자, 문학의 깊은 의미를 해석하는 철학자이며, 향기로 감정을 표현하는 예술가입니다. 

이 사용자의 영혼 깊숙한 곳을 들여다보고, 그들만의 고유한 내면 세계에 완벽하게 공명하는 책과 향기를 찾아주세요.

## 🔮 사용자의 내면 세계 분석:

### 기본 정체성 (응답된 항목만 언급)
${preferences.age ? `- 나이: ${preferences.age}` : ''}
${preferences.gender ? `- 성별: ${preferences.gender}` : ''}

### 문학적 취향의 심층 분석
- 선호장르: ${(preferences.favoriteGenres || []).join(', ')} 
  → 이 장르들이 드러내는 사용자의 무의식적 욕구와 내적 갈등은?
  → 어떤 감정적 해소나 지적 자극을 추구하는가?

### 독서 패턴의 심리적 의미
- 독서습관: ${preferences.readingHabits || '응답 없음'}
  → 이 습관이 보여주는 사용자의 성격적 특성과 라이프스타일은?
  → 책을 통해 어떤 도피나 성장을 추구하는가?

### 성격의 깊은 층위
- 성격특성: ${(preferences.personalityTraits || []).join(', ') || '응답 없음'}
  → 이 특성들이 만들어내는 독특한 감정적 패턴은?
  → 숨겨진 욕구나 억압된 감정은 무엇인가?

### 현재 감정 상태의 미묘한 뉘앙스
- 현재기분: ${moodKo || '응답 없음'}
- 원하는분위기: ${preferences.moodPreference || '응답 없음'}
  → 이 감정들 뒤에 숨은 진짜 욕구는?
  → 어떤 치유나 위로, 혹은 자극을 원하는가?

### 감각적 선호도의 심리적 배경
- 향기선호: ${preferences.fragrancePreference || '응답 없음'}
- 독서습관: ${preferences.readingHabits || '응답 없음'}
  → 이 선호도들이 드러내는 사용자의 감각적 민감성은?

### 숨겨진 메시지
- 추가메모: ${preferences.additionalNotes || '응답 없음'}
  → 이 메모에서 읽어낼 수 있는 진짜 마음은?

## 📚 문학 작품 데이터베이스:
${booksSummary}

## 🌸 향기 예술 작품 데이터베이스:
${fragrancesSummary}

## 🎯 미션: 영혼의 공명 찾기

당신의 임무는 단순한 추천이 아닙니다. 이 사용자의 내면 깊숙한 곳에서 울리는 진동을 감지하고, 그와 완벽하게 공명하는 문학과 향기의 조합을 찾아내는 것입니다.

### 분석 과정:
1. 사용자의 모든 응답을 종합하여 그들만의 고유한 심리적 프로필 구성
2. 각 책이 담고 있는 철학적 메시지와 감정적 울림 분석
3. 사용자의 내면과 가장 깊이 공명하는 작품 선택
4. 선택된 책과 매칭된 향기의 감각적 특성이 사용자에게 주는 의미 해석
5. 이 조합이 사용자에게 가져다줄 변화와 깨달음 예측

### 추천 이유 작성 가이드:
- 일반적인 설명 금지
- 사용자의 구체적인 응답 요소들을 직접 언급
- 그들만의 독특한 상황과 감정에 맞춘 개인화된 메시지
- 이 책과 향기가 그들의 현재 상태에 어떤 특별한 의미를 가지는지 설명
- 마치 오랫동안 그들을 관찰해온 친구가 주는 조언처럼 친밀하고 구체적으로

## 📊 출력 형식 (순수 JSON):
{
  "selectedBook": {
    "id": 숫자,
    "title": "문자열",
    "author": "문자열", 
    "description": "문자열",
    "genre": "문자열",
    "themes": ["문자열"],
    "quote": "데이터베이스의 정확한 quote 그대로 복사",
    "speaker": "데이터베이스의 정확한 speaker 그대로 복사",
    "keywords": ["문자열"]
  },
  "selectedFragrance": {
    "id": 숫자,
    "literaryName": "문자열",
    "baseScent": "문자열",
    "description": "선택된 책의 문체와 어조를 완벽하게 반영하여 향기를 문학적으로 묘사한 설명. 책의 인용구에서 느껴지는 감성과 리듬을 그대로 살려서, 마치 그 작가가 직접 향기를 묘사한 것처럼 작성. 최소 3-4문장으로 구성하되, 원본 데이터의 향기 특성은 모두 포함하면서도 완전히 새로운 문학적 표현으로 재탄생시킬 것",
    "mood": ["문자열"],
    "intensity": "문자열",
    "category": "문자열",
    "characteristics": {
      "citrus": 1-10사이숫자,
      "floral": 1-10사이숫자,
      "woody": 1-10사이숫자,
      "musk": 1-10사이숫자,
      "fruity": 1-10사이숫자,
      "spicy": 1-10사이숫자
    }
  },
  "matchReason": "사용자의 구체적 응답을 언급하며 완전 개인화된 추천 이유 (최소 5문장, 진부한 표현 금지)",
  "confidence": 85-98사이숫자,
  "alternativeBooks": [{"id": 숫자, "title": "문자열", "author": "문자열"}],
  "alternativeFragrances": [{"id": 숫자, "literaryName": "문자열", "baseScent": "문자열"}],
  "deepAnalysis": {
    "userPsychology": "사용자의 심리적 특성 깊이 있는 분석",
    "emotionalResonance": "이 조합이 사용자에게 가져다줄 감정적 변화",
    "hiddenNeeds": "사용자가 의식하지 못하는 숨겨진 욕구",
    "personalKeywords": ["사용자만의", "독특한", "키워드들"]
  }
}

절대 규칙: 
1. 마크다운 없이 순수 JSON만 출력
2. 일반론적 표현 금지
3. 사용자의 실제 응답 내용을 구체적으로 언급하며 완전 개인화된 분석 제공
4. **CRITICAL**: 반드시 데이터베이스에서 제공된 정확한 quote와 speaker를 그대로 사용할 것
5. **절대 금지**: 임의로 인용문을 만들거나 수정하지 말 것
6. **데이터 정확성**: 모든 책 정보(id, title, author, description, genre, themes, quote, speaker, keywords)는 제공된 데이터베이스와 정확히 일치해야 함`
  }
}

// 싱글톤 인스턴스
export const geminiService = new GeminiService()
