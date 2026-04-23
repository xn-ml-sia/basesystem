import { Badge } from "@/registry/new-york-v4/ui/badge"
import { recipes } from "@/lib/recipes"
import { DiscoverContent } from "@/app/(app)/discover/discover-content"

export default function DiscoverPage() {
  return (
    <div className="container mx-auto flex w-full flex-1 flex-col px-4 py-10 md:px-6">
      <div className="flex max-w-2xl flex-col gap-4">
        <Badge variant="outline">Rare Vinyl Marketplace</Badge>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Find special pressings worth owning forever.
        </h1>
        <p className="text-muted-foreground">
          Curated first-press, archive-grade, and limited-run records from
          trusted global collectors.
        </p>
      </div>

      <DiscoverContent recipes={recipes} />
    </div>
  )
}
