import { HeroCarousel } from "@/components/HomePage/HeroCarousel"
import { PackageSearchIcon } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import ProductCard from "@/components/ProductCard"
import { Button } from "@/components/ui/button"

const data = Array.from({ length: 21 }, (_, i) => {
  return {
    id: i + "1o",
    name: "Vij" + i,
    image: "/dummy/products/Laptop.webp",
    price: i % 3 ? 100 * (i % 10) + 100 + (i % 10) * 10 : null,
    mrp: 100 * (i % 10) + 100 + (i % 10) * 10 + 50
  }
})

export default function Home() {

  return (
    <main className="mt-16">
      <section className="border-b-2">
        <HeroCarousel />
      </section>
      <section className="mb-16">
        <div className="h-16 bg-white flex items-center px-4 gap-4">
          <PackageSearchIcon size={24} />
          <span className="text-sm">
            Select from wide range of products
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          {data.map(e => <ProductCard mrp={e.mrp} price={e.price} key={e.id} image={e.image} name={e.name} />
          )}
        </div>
        <div className="flex justify-center items-center">
          <Button>Load More</Button>
        </div>
      </section>
    </main>
  )
}
