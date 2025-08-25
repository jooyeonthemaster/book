import { NotebookBackground } from '@/components/NotebookBackground'
import { HeroSection } from '@/components/HeroSection'
import { SurveyStartButton } from '@/components/SurveyStartButton'

export default function Home() {
  return (
    <main className="relative h-screen overflow-hidden">
      <NotebookBackground />
      <div className="relative z-10 h-full flex flex-col">
        <HeroSection />
        <SurveyStartButton />
      </div>
    </main>
  )
}

