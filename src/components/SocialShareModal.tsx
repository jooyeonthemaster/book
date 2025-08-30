'use client'

import { useState } from 'react'
import { RecommendationResult } from '@/lib/recommendationService'

interface SocialShareModalProps {
  isOpen: boolean
  onClose: () => void
  shareUrl: string
  result: RecommendationResult
}

export default function SocialShareModal({ 
  isOpen, 
  onClose, 
  shareUrl, 
  result 
}: SocialShareModalProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success'>('idle')

  if (!isOpen) return null

  // 공유 텍스트 생성
  const shareText = `📚 AI가 추천해준 나만의 책과 향기! 
"${result.book.title}" by ${result.book.author}
🌸 ${result.fragrance.literaryName}

BookFestival에서 당신만의 추천도 받아보세요!`

  // URL 복사
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyStatus('success')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch (error) {
      console.error('복사 실패:', error)
    }
  }

  // 네이티브 공유 (모바일에서 카카오톡, 인스타그램 등 자동 지원)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BookFestival 추천 결과',
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.error('네이티브 공유 실패:', error)
        // 실패 시 링크 복사로 폴백
        handleCopyUrl()
      }
    } else {
      // Web Share API 미지원 시 링크 복사
      handleCopyUrl()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-black/10">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-black font-serif">공유하기</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 공유 버튼들 */}
        <div className="space-y-3">
          {/* 네이티브 공유 (모바일에서 카카오톡 등 자동 지원) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-3 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl transition-all duration-300 font-typewriter font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              카카오톡, 인스타그램 등으로 공유
            </button>
          )}

          {/* 링크 복사 */}
          <button
            onClick={handleCopyUrl}
            className={`w-full flex items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-300 font-typewriter font-medium ${
              copyStatus === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-black'
            }`}
          >
            {copyStatus === 'success' ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                복사 완료!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                링크 복사해서 공유하기
              </>
            )}
          </button>
        </div>

        {/* 공유 안내 */}
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-xs text-blue-700 font-typewriter leading-relaxed text-center">
            {typeof navigator !== 'undefined' && 'share' in navigator 
              ? '💡 모바일에서 위 버튼을 누르면 카카오톡, 인스타그램 등 설치된 앱으로 바로 공유할 수 있어요!'
              : '💡 링크를 복사해서 카카오톡, 인스타그램 등에 붙여넣기 해주세요!'
            }
          </p>
        </div>
      </div>
    </div>
  )
}