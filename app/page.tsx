import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Video Player Test App</h1>

        <Button asChild>
          <Link href="/video">View Test Video</Link>
        </Button>
      </div>
    </main>
  )
}
