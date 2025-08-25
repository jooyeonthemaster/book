import { SurveyProvider } from '@/contexts/SurveyContext'
import { NotebookBackground } from '@/components/NotebookBackground'

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SurveyProvider>
      <main className="relative min-h-screen">
        <NotebookBackground />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </SurveyProvider>
  )
}
