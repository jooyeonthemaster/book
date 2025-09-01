import { NotebookBackground } from '@/components/NotebookBackground'
import { HeroSection } from '@/components/HeroSection'
import { SurveyStartButton } from '@/components/SurveyStartButton'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative h-screen-mobile xs:xs-optimized">
      <NotebookBackground />
      <div className="relative z-10 h-full flex flex-col xs:xs-hero">
        <HeroSection />
        <SurveyStartButton />
        <Footer />
      </div>
    </main>
  )
}

