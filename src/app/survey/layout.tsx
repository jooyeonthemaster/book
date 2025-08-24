import { SurveyProvider } from '@/contexts/SurveyContext'
import { GridBackground } from '@/components/GridBackground'

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SurveyProvider>
      <main className="relative min-h-screen">
        <GridBackground />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </SurveyProvider>
  )
}
