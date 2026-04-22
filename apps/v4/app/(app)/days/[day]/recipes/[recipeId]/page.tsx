import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRightIcon, PlayIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { getRecipeById } from "@/lib/recipes"

type RecipeDetailPageProps = {
  params: Promise<{
    day: string
    recipeId: string
  }>
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { day, recipeId } = await params
  const recipe = getRecipeById(recipeId)

  if (!recipe || recipe.day !== day) {
    notFound()
  }

  const detailRows = [
    [
      { label: "Condition", value: recipe.difficulty },
      { label: "Runtime", value: recipe.cookTime },
      { label: "Format", value: "LP / 12 inch" },
      { label: "Pressing", value: "First Press" },
      { label: "Est. Price", value: "$95 - $240" },
    ],
    [
      { label: "Catalog", value: "RSV-1983" },
      { label: "Region", value: "JP / EU / US" },
      { label: "Sleeve", value: "Original Print" },
      { label: "Media", value: recipe.difficulty },
      { label: "Stock", value: "1 copy" },
    ],
  ]

  return (
    <div className="relative flex w-full flex-1 flex-col bg-muted/20 px-4 py-5 md:px-6 lg:h-[calc(100svh-4rem)] lg:flex-row lg:overflow-hidden lg:px-12 lg:py-5">
      <aside className="lg:sticky lg:top-0 lg:flex lg:h-full lg:w-[50%] lg:items-center lg:justify-center">
        <div className="relative mx-auto flex size-[min(80vw,35rem)] items-center justify-center rounded-full border border-border/35 bg-background shadow-[0_30px_100px_-60px_hsl(var(--foreground)/0.45)]">
          <div className="absolute size-[86%] rounded-full border border-border/20 bg-muted/20" />
          <div className="absolute size-[73%] rounded-full bg-gradient-to-br from-primary/35 via-primary/10 to-secondary/30" />
          <div className="absolute size-[54%] rounded-full border border-border/25 bg-background/80" />
        </div>
      </aside>

      <section className="mt-8 flex flex-col gap-6 lg:mt-0 lg:h-full lg:w-[50%] lg:overflow-y-auto lg:pr-6">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground/90">
          <Link href="/discover" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRightIcon className="size-3" />
          <span>Vinyl</span>
          <ChevronRightIcon className="size-3" />
          <span>Rare Finds</span>
        </div>

        <div className="flex flex-col gap-3 pt-1">
          <h1 className="max-w-[14ch] text-balance text-4xl leading-[1.03] font-medium tracking-tight md:text-[3.45rem]">
            <span className="font-serif">{recipe.title}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{recipe.difficulty}</Badge>
            <Badge variant="outline">{recipe.cookTime} runtime</Badge>
            <Badge variant="outline">1 copy</Badge>
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="max-w-[58ch] text-[14px] leading-relaxed text-muted-foreground">
            {recipe.subtitle} {recipe.description}
          </p>
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <h2 className="text-[2rem] leading-tight font-medium tracking-tight font-serif">Details</h2>
          <div className="overflow-hidden rounded-sm border border-border/50 bg-background">
            {detailRows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-2 md:grid-cols-5">
                {row.map((item, itemIndex) => (
                  <div
                    key={item.label}
                    className={cn(
                      "flex min-h-20 flex-col justify-center gap-1 border-border/50 px-3 py-3 md:min-h-[6.25rem] md:px-4",
                      itemIndex !== row.length - 1 && "border-r",
                      rowIndex !== 0 && "border-t"
                    )}
                  >
                    <p className="text-[11px] text-muted-foreground">{item.label}</p>
                    <p className="text-[14px] font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            *Inventory and condition notes are updated after each play-test.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-[1.75rem] leading-tight font-medium tracking-tight">Tracklist</h2>
          <div className="grid gap-2">
            {recipe.ingredients.map((item) => (
              <div key={item} className="rounded-md border border-border/50 bg-muted/20 px-3 py-2 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pb-4">
          <h2 className="text-[1.75rem] leading-tight font-medium tracking-tight">Collector Notes</h2>
          <div className="flex flex-col gap-4">
            {recipe.steps.map((step, index) => (
              <div key={step} className="flex items-start gap-3">
                <Badge className="mt-0.5" variant="secondary">
                  {index + 1}
                </Badge>
                <p className="text-sm leading-relaxed md:text-base">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-24 lg:hidden" />
      </section>

      <div className="fixed right-1/2 bottom-4 z-20 translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/95 p-1.5 shadow-lg backdrop-blur">
          <Button size="sm" variant="ghost" className="rounded-full px-4 text-[13px]">
            Qty 1
          </Button>
          <Button size="sm" variant="ghost" className="rounded-full px-3 text-[13px]">
            Save
          </Button>
          <Button size="sm" variant="ghost" className="rounded-full px-3 text-[13px]">
            Listen
          </Button>
          <Button size="sm" className="rounded-full px-4 text-[13px]">
            <PlayIcon data-icon="inline-start" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  )
}
