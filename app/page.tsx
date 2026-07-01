import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Features from "./components/Features"
import BountyBanner from "./components/BountyBanner"
import Sparkles from "./components/Sparkles"

export default function HomePage() {
  return (
    <main className="relative">
      <Sparkles />
      <Navbar active="Home" />
      <Hero />
      <Features />
      <BountyBanner />
    </main>
  )
}