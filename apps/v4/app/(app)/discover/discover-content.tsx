"use client"

import Link from "next/link"
import * as React from "react"

import type { Recipe } from "@/lib/recipes"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/registry/new-york-v4/ui/toggle-group"

type DiscoverContentProps = {
  recipes: Recipe[]
}

export function DiscoverContent({ recipes }: DiscoverContentProps) {
  const [view, setView] = React.useState<"grid" | "swipe">("grid")
  const [swipeIndex, setSwipeIndex] = React.useState(0)
  const [dragX, setDragX] = React.useState(0)
  const [swipingOut, setSwipingOut] = React.useState<"left" | "right" | null>(null)
  const dragStartX = React.useRef<number | null>(null)

  const activeRecipe = recipes[swipeIndex]
  const stackRecipes = recipes.slice(swipeIndex, swipeIndex + 3)
  const reachedEnd = swipeIndex >= recipes.length

  const nextCard = React.useCallback(() => {
    setDragX(0)
    setSwipingOut(null)
    setSwipeIndex((index) => Math.min(index + 1, recipes.length))
  }, [recipes.length])

  const resetSwipe = React.useCallback(() => {
    setDragX(0)
    setSwipingOut(null)
    setSwipeIndex(0)
  }, [])

  const finishSwipe = React.useCallback(
    (direction: "left" | "right") => {
      setSwipingOut(direction)
      setDragX(direction === "left" ? -420 : 420)
      window.setTimeout(() => {
        nextCard()
      }, 180)
    },
    [nextCard]
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (swipingOut) {
      return
    }
    dragStartX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null || swipingOut) {
      return
    }
    const delta = event.clientX - dragStartX.current
    setDragX(delta)
  }

  const handlePointerEnd = () => {
    if (dragStartX.current === null || swipingOut) {
      return
    }
    const threshold = 110
    if (dragX > threshold) {
      finishSwipe("right")
    } else if (dragX < -threshold) {
      finishSwipe("left")
    } else {
      setDragX(0)
    }
    dragStartX.current = null
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Browse as grid or swipe deck</p>
        <ToggleGroup
          type="single"
          variant="outline"
          value={view}
          onValueChange={(value) => {
            if (value === "grid" || value === "swipe") {
              setView(value)
            }
          }}
        >
          <ToggleGroupItem value="grid" aria-label="Grid mode">
            Grid
          </ToggleGroupItem>
          <ToggleGroupItem value="swipe" aria-label="Swipe mode">
            Swipe
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
      ) : (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
          {reachedEnd ? (
            <Card className="pt-0">
              <div className="aspect-[4/3] w-full rounded-t-xl bg-gradient-to-br from-muted to-secondary/20" />
              <CardHeader>
                <CardTitle>No more records in the stack</CardTitle>
                <CardDescription>
                  You reached the end of this swipe deck.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={resetSwipe} variant="outline">
                  Start Over
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="relative h-[30rem]">
                {stackRecipes
                  .slice()
                  .reverse()
                  .map((recipe, reverseIndex) => {
                    const index = stackRecipes.length - 1 - reverseIndex
                    const isTop = index === 0
                    const currentTranslateX = isTop ? dragX : 0
                    const currentRotate = isTop ? dragX / 20 : 0

                    return (
                      <Card
                        key={recipe.id}
                        className="absolute inset-0 overflow-hidden pt-0 transition-transform duration-200"
                        onPointerDown={isTop ? handlePointerDown : undefined}
                        onPointerMove={isTop ? handlePointerMove : undefined}
                        onPointerUp={isTop ? handlePointerEnd : undefined}
                        onPointerCancel={isTop ? handlePointerEnd : undefined}
                        style={{
                          transform: `translateX(${currentTranslateX}px) translateY(${index * 10}px) rotate(${currentRotate}deg) scale(${1 - index * 0.03})`,
                          transitionDuration: isTop && !swipingOut ? "80ms" : "200ms",
                          touchAction: "none",
                        }}
                      >
                        <div className="h-60 w-full rounded-t-xl bg-gradient-to-br from-primary/20 via-muted to-secondary/30 md:h-64" />
                        <CardHeader>
                          <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {recipe.subtitle}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                          {recipe.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </CardContent>
                        <CardFooter className="mt-auto justify-between text-sm text-muted-foreground">
                          <span>{recipe.cookTime} runtime</span>
                          <span>{recipe.difficulty} grade</span>
                        </CardFooter>
                        {!isTop ? (
                          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-background/25" />
                        ) : null}
                      </Card>
                    )
                  })}
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={() => finishSwipe("left")}>
                  Pass
                </Button>
                {activeRecipe ? (
                  <Button asChild>
                    <Link href={`/days/${activeRecipe.day}/recipes/${activeRecipe.id}`}>
                      Open
                    </Link>
                  </Button>
                ) : null}
                <Button onClick={() => finishSwipe("right")}>Save</Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
