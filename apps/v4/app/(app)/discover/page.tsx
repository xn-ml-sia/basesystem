import Link from "next/link"

import { Badge } from "@/registry/new-york-v4/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { recipes } from "@/lib/recipes"

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

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/days/${recipe.day}/recipes/${recipe.id}`}
            className="group"
          >
            <Card className="h-full pt-0 transition-colors group-hover:border-primary/40">
              <div className="aspect-[4/3] w-full rounded-t-xl bg-gradient-to-br from-primary/15 via-muted to-secondary/20" />
              <CardHeader>
                <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {recipe.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </CardContent>
              <CardFooter className="justify-between text-sm text-muted-foreground">
                <span>{recipe.cookTime} runtime</span>
                <span>{recipe.difficulty} grade</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
