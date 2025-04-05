import Header from "@/components/Header"
import { HeroCarousel } from "@/components/HomePage/HeroCarousel"
// import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="bg-gray-100">
      <Header />
      <main>
        <section>
          <HeroCarousel />
          {/* <Button>Click me</Button> */}
        </section>
      </main>
    </div>
  )
}
