import { notFound } from "next/navigation"

import { getJupitermossPlace, jupitermossPlaces } from "@/lib/jupitermoss-places"

import { JupitermossDetail } from "./jupitermoss-detail"

type PlaceDetailPageProps = {
  params: Promise<{
    placeId: string
  }>
}

export function generateStaticParams() {
  return jupitermossPlaces.map((place) => ({ placeId: place.id }))
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { placeId } = await params
  const place = getJupitermossPlace(placeId)

  if (!place) {
    notFound()
  }

  return <JupitermossDetail place={place} />
}
