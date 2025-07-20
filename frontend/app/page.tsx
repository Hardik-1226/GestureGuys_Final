import Hero from "@/components/Hero"
import About from "@/components/About"
import Features from "@/components/Features"
import GestureElements from "@/components/GestureElements"
import Demo from "@/components/Demo"
import Contact from "@/components/Contact"
import StarBackground from "@/components/StarBackground"
import Navbar from "@/components/Navbar"
import ChatWindow from "@/components/ChatWindow";
import FloatingControls from "@/components/FloatingControls";

export default function Home() {
  return (
    <div className="relative min-h-screen text-white dark:bg-gray-950 light:bg-peach-50">
      <Navbar />
      <StarBackground fallSpeed={0.08} />
      <FloatingControls />
      <div id="resume-content">
        <Hero />
        <GestureElements />
        <About />
        <Features />
        <Demo />
        <Contact />
      </div>
      <ChatWindow />
      <footer className="relative z-10 py-8 text-center text-gray-500 dark:text-gray-500 light:text-gray-700 text-sm bg-black/40 dark:bg-black/40 light:bg-white/60">
        <p>&copy; {new Date().getFullYear()} GestureGuy. All rights reserved.</p>
        <p className="mt-2">Powered by Next.js, React, Three.js, and Tailwind CSS</p> {/* Moved text here */}
      </footer>
    </div>
  )
}
