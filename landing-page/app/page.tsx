import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SocialProof from '@/components/SocialProof'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Mockup from '@/components/Mockup'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Mockup />
      <FinalCTA />
      <Footer />
    </main>
  )
}
