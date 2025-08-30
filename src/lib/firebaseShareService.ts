import { db } from './firebase'
import { collection, addDoc, doc, getDoc, Timestamp } from 'firebase/firestore'
import { RecommendationResult } from './recommendationService'

// Firebase 공유 데이터 타입
export interface FirebaseShareData {
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
  deepAnalysis?: {
    userPsychology: string
    emotionalResonance: string
    hiddenNeeds: string
    personalKeywords: string[]
  }
  // Firebase 메타데이터
  createdAt: Timestamp
  expiresAt: Timestamp
  version: string
}

/**
 * 추천 결과를 Firebase에 저장하고 공유 URL 생성
 */
export async function createFirebaseShareUrl(result: RecommendationResult): Promise<string> {
  try {
    console.log('=== Firebase 공유 URL 생성 시작 ===')
    
    // 30일 후 만료 시간 설정
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30일
    
    // Firebase 저장용 데이터 구성
    const shareData: Omit<FirebaseShareData, 'createdAt' | 'expiresAt'> = {
      book: result.book,
      fragrance: result.fragrance,
      matchReason: result.matchReason,
      confidence: result.confidence,
      deepAnalysis: result.deepAnalysis,
      version: '1.0'
    }
    
    // Firestore에 데이터 저장
    const docRef = await addDoc(collection(db, 'shares'), {
      ...shareData,
      createdAt: Timestamp.fromDate(now),
      expiresAt: Timestamp.fromDate(expiresAt)
    })
    
    // 공유 URL 생성
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000'
    
    const shareUrl = `${baseUrl}/share/${docRef.id}`
    
    console.log('=== Firebase 공유 완료 ===')
    console.log('Document ID:', docRef.id)
    console.log('공유 URL:', shareUrl)
    console.log('만료 시간:', expiresAt.toISOString())
    console.log('========================')
    
    return shareUrl
  } catch (error) {
    console.error('Firebase 공유 URL 생성 실패:', error)
    throw new Error('공유 링크를 생성할 수 없습니다.')
  }
}

/**
 * Firebase에서 공유 데이터 가져오기
 */
export async function getFirebaseShareData(shareId: string): Promise<RecommendationResult | null> {
  try {
    console.log('=== Firebase 공유 데이터 로딩 ===')
    console.log('Share ID:', shareId)
    
    // Firestore에서 문서 가져오기
    const docRef = doc(db, 'shares', shareId)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      console.error('공유 데이터를 찾을 수 없습니다')
      return null
    }
    
    const data = docSnap.data() as FirebaseShareData
    
    // 만료 시간 확인
    const now = new Date()
    const expiresAt = data.expiresAt.toDate()
    
    if (now > expiresAt) {
      console.error('공유 링크가 만료되었습니다')
      return null
    }
    
    // RecommendationResult 형태로 변환
    const result: RecommendationResult = {
      book: data.book,
      fragrance: data.fragrance,
      matchReason: data.matchReason,
      confidence: data.confidence,
      alternativeBooks: [], // 공유 시에는 대안 추천 제외
      alternativeFragrances: [],
      deepAnalysis: data.deepAnalysis
    }
    
    console.log('=== Firebase 데이터 로딩 성공 ===')
    console.log('책 제목:', result.book.title)
    console.log('향기 이름:', result.fragrance.literaryName)
    console.log('생성 시간:', data.createdAt.toDate().toISOString())
    console.log('==============================')
    
    return result
  } catch (error) {
    console.error('Firebase 공유 데이터 로딩 실패:', error)
    return null
  }
}

/**
 * 클립보드에 공유 URL 복사
 */
export async function copyFirebaseShareUrl(shareUrl: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareUrl)
      return true
    } else {
      // 폴백: 임시 textarea 생성해서 복사
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      return successful
    }
  } catch (error) {
    console.error('클립보드 복사 실패:', error)
    return false
  }
}
