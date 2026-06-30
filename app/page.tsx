import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Features from "./components/Features"
import BountyBanner from "./components/BountyBanner"

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar active="Home" />
      <Hero />
      <Features />
      <BountyBanner />
    </main>
  )
}