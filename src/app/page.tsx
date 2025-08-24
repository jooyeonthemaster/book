import { GridBackground } from '@/components/GridBackground'
import { HeroSection } from '@/components/HeroSection'
import { SurveyStartButton } from '@/components/SurveyStartButton'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10">
        <HeroSection />
        <SurveyStartButton />
      </div>
    </main>
  )
}

