"use client"

import Image from "next/image"
import * as React from "react"
import {
  ChevronDownIcon,
  DotIcon,
  HeartIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react"

import type { JupitermossPlace } from "@/lib/jupitermoss-places"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"

type JupitermossDetailProps = {
  place: JupitermossPlace
}

function PhotoWithSkeleton({ alt }: { alt: string }) {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <div className="relative aspect-[16/4.7] w-full overflow-hidden rounded-lg">
      {!loaded ? <Skeleton className="absolute inset-0" /> : null}
      <Image
        src="/placeholder.svg"
        alt={alt}
        fill
        priority
        className="object-cover"
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <Button
          variant="secondary"
          size="icon"
          className="size-8 rounded-full border border-[color:var(--jm-accent-soft)] bg-[color:var(--jm-info-soft)] transition-transform duration-[120ms] ease-[var(--easing-standard)] active:scale-95 motion-reduce:transition-none"
        >
          <HeartIcon className="size-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="size-8 rounded-full border border-[color:var(--jm-accent-soft)] bg-[color:var(--jm-info-soft)] transition-transform duration-[120ms] ease-[var(--easing-standard)] active:scale-95 motion-reduce:transition-none"
        >
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function ItemWithSkeleton({
  label,
  price,
}: {
  label: string
  price: string
}) {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <div className="min-w-40 flex-1">
      <div className="relative mb-1.5 aspect-[5/3] w-full overflow-hidden rounded-md border border-border">
        {!loaded ? <Skeleton className="absolute inset-0" /> : null}
        <Image
          src="/placeholder.svg"
          alt={label}
          fill
          className="object-cover"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <p className="line-clamp-1 text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{price}</p>
    </div>
  )
}

export function JupitermossDetail({ place }: JupitermossDetailProps) {
  const [entered, setEntered] = React.useState(false)

  React.useEffect(() => {
    const raf = window.requestAnimationFrame(() => setEntered(true))
    return () => window.cancelAnimationFrame(raf)
  }, [])

  const featuredItems = Array.from({ length: 5 }, (_, index) => ({
    label: place.menuHighlights[index % place.menuHighlights.length],
    price: `€${(14.5 + index * 1.25).toFixed(2)}`,
    badge: `#${index + 1} most liked`,
  }))

  const sectionClass = `transition-[opacity,transform] duration-[280ms] ease-[var(--easing-standard)] motion-reduce:transform-none motion-reduce:transition-none ${
    entered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
  }`

  const sectionDelay = (index: number) =>
    ({ transitionDelay: `${index * 75}ms` }) as React.CSSProperties

  return (
    <div data-slot="jupitermoss" className="flex w-full flex-1 flex-col">
      <div className="border-b border-border bg-background">
        <div className="container mx-auto flex h-10 items-center justify-between px-4 md:px-5">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-bold text-[color:var(--jm-accent)]">Jupitermoss</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 rounded-full bg-[color:var(--jm-info-soft)] px-2.5 text-[11px]"
            >
              <MapPinIcon className="size-3.5" />
              Enter delivery address
              <ChevronDownIcon className="size-3.5" />
            </Button>
          </div>
          <div className="hidden items-center gap-1.5 md:flex">
            <Button
              variant="outline"
              size="sm"
              className="h-7 rounded-full border-[color:var(--jm-accent-soft)] px-3 text-[11px] transition-transform duration-[120ms] ease-[var(--easing-standard)] active:scale-95 motion-reduce:transition-none"
            >
              Log in
            </Button>
            <Button
              size="sm"
              className="h-7 rounded-full bg-[color:var(--jm-accent)] px-3 text-[11px] text-white transition-transform duration-[120ms] ease-[var(--easing-standard)] hover:bg-[color:var(--jm-accent)]/92 active:scale-95 motion-reduce:transition-none"
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`container mx-auto flex w-full max-w-[1340px] flex-1 flex-col gap-3 px-4 py-3 transition-[opacity,transform] duration-[260ms] ease-[var(--easing-standard)] motion-reduce:transition-none md:px-5 ${
          entered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        <div className={sectionClass} style={sectionDelay(0)}>
          <PhotoWithSkeleton alt={`${place.name} hero`} />
        </div>

        <div
          className={`${sectionClass} grid items-start gap-2.5 lg:grid-cols-[minmax(0,1fr)_13.5rem]`}
          style={sectionDelay(1)}
        >
          <div className="space-y-1.5">
            <h1 className="text-[50px] leading-none font-bold tracking-tight">{place.name}</h1>
            <p className="inline-flex items-center text-xs text-muted-foreground">
              {place.rating} ({place.reviewCount})
              <DotIcon className="size-4" />
              {place.tags.slice(0, 2).join(" • ")}
            </p>
            <p className="text-xs text-muted-foreground">
              {place.neighborhood}, {place.city}
            </p>
          </div>
          <div className="flex justify-start pt-1 lg:justify-end">
            <Button
              variant="outline"
              className="h-7 rounded-full px-3 text-[11px] transition-transform duration-[120ms] ease-[var(--easing-standard)] active:scale-95 motion-reduce:transition-none"
            >
              Group order
            </Button>
          </div>
        </div>

        <div
          className={`${sectionClass} grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_13.5rem]`}
          style={sectionDelay(2)}
        >
          <div className="rounded-md bg-foreground p-1.5 text-background">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[34px] leading-none font-bold">Get it delivered to your door.</p>
              <Button
                variant="secondary"
                size="sm"
                className="h-7 rounded-full px-3 text-[11px] transition-transform duration-[120ms] ease-[var(--easing-standard)] active:scale-95 motion-reduce:transition-none"
              >
                Log in for saved address
              </Button>
            </div>
            <div className="rounded-[6px] bg-background/95 p-1">
              <div className="relative">
                <MapPinIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter your address"
                  className="h-8 border-0 bg-transparent pr-2 pl-8 text-[11px] text-foreground placeholder:text-muted-foreground transition-colors duration-[200ms] ease-[var(--easing-standard)] motion-reduce:transition-none"
                />
              </div>
            </div>
          </div>
          <div className="grid h-full grid-cols-2 overflow-hidden rounded-md border border-border bg-background">
            <div className="p-2.5 text-center">
              <p className="text-sm font-semibold">0,00 €</p>
              <p className="text-[11px] text-muted-foreground">Delivery fee</p>
            </div>
            <div className="border-l border-border p-2.5 text-center">
              <p className="text-sm font-semibold">{place.etaMinutes} min</p>
              <p className="text-[11px] text-muted-foreground">Pickup time</p>
            </div>
          </div>
        </div>

        <div
          className={`${sectionClass} grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_13.5rem]`}
          style={sectionDelay(3)}
        >
          <div className="relative h-[212px] overflow-hidden rounded-md border border-border bg-muted/35">
            <div className="absolute inset-0 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:2.2rem_2.2rem] opacity-45" />
            <Badge className="absolute top-1/2 left-[42%] -translate-x-1/2 -translate-y-1/2 bg-[color:var(--jm-accent)] text-white">
              {place.name}
            </Badge>
          </div>
          <div className="h-[212px] rounded-md border border-border bg-background shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <CardContent className="grid gap-3 p-4">
              <div>
                <p className="text-sm font-semibold">{place.neighborhood}</p>
                <p className="text-xs text-muted-foreground">{place.city}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Open</p>
                <p className="text-xs text-muted-foreground">
                  Open until {place.openUntil}
                </p>
              </div>
            </CardContent>
          </div>
        </div>

        <div className={`${sectionClass} space-y-2 pt-2`} style={sectionDelay(4)}>
          <div className="flex items-center justify-between">
            <h2 className="text-[42px] leading-none font-bold tracking-tight">Featured items</h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-5">
            {featuredItems.map((item, index) => (
              <div
                key={`${item.label}-${item.badge}`}
                className={`min-w-0 transition-[opacity,transform] duration-[260ms] ease-[var(--easing-standard)] hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none ${
                  entered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
                style={{ transitionDelay: `${340 + index * 70}ms` }}
              >
                <Badge className="mb-1 rounded-sm bg-[color:var(--jm-chip-bg)] px-1.5 py-0 text-[10px] font-medium text-[color:var(--jm-ref-rum-700)]">
                  {item.badge}
                </Badge>
                <ItemWithSkeleton label={item.label} price={item.price} />
              </div>
            ))}
          </div>
        </div>

        <div
          className={`${sectionClass} grid gap-2.5 pb-5 lg:grid-cols-[minmax(0,1fr)_13.5rem]`}
          style={sectionDelay(5)}
        >
          <div className="text-xs text-muted-foreground">
            <p>Menu</p>
            <p>12:00 PM - 9:30 PM</p>
          </div>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-9 rounded-full bg-[color:var(--jm-info-soft)] pl-9 text-sm transition-colors duration-[200ms] ease-[var(--easing-standard)] motion-reduce:transition-none"
              placeholder={`Search in ${place.name}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
