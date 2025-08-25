import type { Metadata } from 'next'
import { Inter, Courier_Prime, Crimson_Text } from 'next/font/google'
import './globals.css'
import { CustomCursor } from '@/components/CustomCursor'

const inter = Inter({ subsets: ['latin'] })
const courierPrime = Courier_Prime({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-typewriter'
})
const crimsonText = Crimson_Text({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif'
})

export const metadata: Metadata = {
  title: 'BookFestival - AI 문학 & 향기 추천',
  description: 'AI가 당신의 문학적 취향을 분석하여 완벽한 책과 향기를 추천해드립니다.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} ${courierPrime.variable} ${crimsonText.variable}`}>
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
          {children}
          <CustomCursor />
        </div>
      </body>
    </html>
  )
}

