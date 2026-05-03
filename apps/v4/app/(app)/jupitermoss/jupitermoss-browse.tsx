"use client"

import Link from "next/link"
import Image from "next/image"
import * as React from "react"
import {
  ChevronDownIcon,
  MapPinIcon,
  MenuIcon,
  MinusIcon,
  PlusIcon,
  StarIcon,
} from "lucide-react"

import type { JupitermossPlace } from "@/lib/jupitermoss-places"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york-v4/ui/toggle-group"

type JupitermossBrowseProps = {
  places: JupitermossPlace[]
}

export function JupitermossBrowse({ places }: JupitermossBrowseProps) {
  const [priceTier, setPriceTier] = React.useState<"all" | "$" | "$$" | "$$$">("all")
  const [serviceMode, setServiceMode] = React.useState<"delivery" | "pickup">(
    "delivery"
  )

  const filtered = React.useMemo(() => {
    return places.filter((place) => {
      const matchesPrice = priceTier === "all" || place.priceTier === priceTier

      return matchesPrice
    })
  }, [places, priceTier])

  return (
    <div data-slot="jupitermoss" className="flex w-full flex-1 flex-col">
      <div className="border-b border-border bg-background">
        <div className="container mx-auto flex h-11 items-center justify-between gap-2 px-3 md:px-4">
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 rounded-full transition-transform duration-[120ms] ease-[var(--easing-standard)] active:scale-95 motion-reduce:transition-none"
            >
              <MenuIcon className="size-4" />
            </Button>
            <p className="text-[15px] font-bold text-[color:var(--jm-accent)]">Jupitermoss</p>
            <ToggleGroup
              type="single"
              value={serviceMode}
              onValueChange={(value) => {
                if (value === "delivery" || value === "pickup") {
                  setServiceMode(value)
                }
              }}
              variant="default"
              spacing={1}
              className="ml-1 hidden rounded-full bg-[color:var(--jm-chip-bg)] p-0.5 transition-colors duration-[200ms] ease-[var(--easing-standard)] motion-reduce:transition-none md:flex"
            >
              <ToggleGroupItem
                value="delivery"
                className="h-7 rounded-full px-2.5 text-[11px] transition-transform duration-[120ms] ease-[var(--easing-standard)] data-[state=on]:bg-background data-[state=on]:text-[color:var(--jm-accent)] active:scale-[0.98] motion-reduce:transition-none"
              >
                Delivery
              </ToggleGroupItem>
              <ToggleGroupItem
                value="pickup"
                className="h-7 rounded-full px-2.5 text-[11px] transition-transform duration-[120ms] ease-[var(--easing-standard)] data-[state=on]:bg-background data-[state=on]:text-[color:var(--jm-accent)] active:scale-[0.98] motion-reduce:transition-none"
              >
                Pickup
              </ToggleGroupItem>
            </ToggleGroup>
            <Button
              variant="ghost"
              size="sm"
              className="hidden h-7 gap-1.5 rounded-full bg-[color:var(--jm-info-soft)] px-2.5 text-[11px] transition-transform duration-[120ms] ease-[var(--easing-standard)] active:scale-[0.98] motion-reduce:transition-none md:inline-flex"
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

      <div className="container mx-auto flex w-full flex-1 flex-col px-3 py-3 md:px-4">
        <div className="mb-2.5 flex flex-wrap items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-[color:var(--jm-accent-soft)] bg-[color:var(--jm-info-soft)] px-3 transition-transform duration-[120ms] ease-[var(--easing-standard)] active:scale-[0.98] motion-reduce:transition-none"
          >
            Highest rated
          </Button>
          <Select
            value={priceTier}
            onValueChange={(value) =>
              setPriceTier(value as "all" | "$" | "$$" | "$$$")
            }
          >
            <SelectTrigger
              size="sm"
              className="h-9 rounded-full border-[color:var(--jm-accent-soft)] bg-[color:var(--jm-info-soft)] px-3 transition-transform duration-[120ms] ease-[var(--easing-standard)] active:scale-[0.98] motion-reduce:transition-none"
            >
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Price</SelectItem>
              <SelectItem value="$">$</SelectItem>
              <SelectItem value="$$">$$</SelectItem>
              <SelectItem value="$$$">$$$</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-[color:var(--jm-accent-soft)] bg-[color:var(--jm-info-soft)] px-3 transition-transform duration-[120ms] ease-[var(--easing-standard)] active:scale-[0.98] motion-reduce:transition-none"
          >
            Sort
            <ChevronDownIcon className="size-4" />
          </Button>
        </div>

        <div className="grid flex-1 gap-2.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.34fr)]">
          <div className="grid h-fit grid-cols-1 gap-2 md:grid-cols-2">
            {filtered.map((place) => (
              <Link key={place.id} href={`/jupitermoss/${place.id}`} className="group">
                <Card
                  className="gap-1 overflow-hidden py-0 transition-[transform,opacity] duration-[200ms] ease-[var(--easing-standard)] hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border">
                    <Image
                      src="/placeholder.svg"
                      alt={`${place.name} preview`}
                      fill
                      className="object-cover transition-transform duration-[220ms] ease-[var(--easing-standard)] group-hover:scale-[1.02] motion-reduce:transition-none"
                    />
                    <Badge
                      variant="secondary"
                      className="absolute top-1.5 left-1.5 bg-[color:var(--jm-chip-bg)] px-1.5 py-0.5 text-[10px]"
                    >
                      {place.tags[0]}
                    </Badge>
                  </div>
                  <CardHeader className="gap-0.5 px-3 pt-2 pb-0">
                    <CardTitle className="line-clamp-1 text-sm font-semibold">
                      {place.name}
                    </CardTitle>
                    <CardDescription className="text-[10px]">
                      {place.etaMinutes} min • {place.distanceKm} km
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between px-3 pt-1 pb-2">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPinIcon className="size-3" />
                      {place.neighborhood}
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-[color:var(--jm-success-soft)] px-1.5 py-0.5 text-[10px] text-[color:var(--jm-success-strong)]">
                      <StarIcon className="size-2.5" />
                      {place.rating}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="sticky top-14 hidden max-h-[calc(100svh-6rem)] overflow-hidden rounded-xl border border-[color:var(--jm-accent-soft)] bg-[color:var(--jm-map-surface)] lg:flex">
            <div className="relative min-h-0 flex-1">
              <div className="absolute inset-0 bg-[color:var(--jm-map-surface)]/70" />
              <div className="absolute inset-0 bg-[linear-gradient(var(--jm-map-grid)_1px,transparent_1px),linear-gradient(90deg,var(--jm-map-grid)_1px,transparent_1px)] bg-[size:2.4rem_2.4rem] opacity-45" />
              <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7 rounded-full bg-background transition-transform duration-[120ms] ease-[var(--easing-standard)] active:scale-95 motion-reduce:transition-none"
                >
                  <PlusIcon className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7 rounded-full bg-background transition-transform duration-[120ms] ease-[var(--easing-standard)] active:scale-95 motion-reduce:transition-none"
                >
                  <MinusIcon className="size-3.5" />
                </Button>
              </div>
              {filtered.map((place) => (
                <Link
                  key={place.id}
                  href={`/jupitermoss/${place.id}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-[150ms] ease-[var(--easing-standard)] hover:scale-105 motion-reduce:transition-none"
                  style={{ left: `${place.mapX}%`, top: `${place.mapY}%` }}
                >
                  <div className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-[color:var(--jm-accent)] bg-[color:var(--jm-accent)] px-1.5 text-[11px] font-medium text-white shadow-sm">
                    {place.rating}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
