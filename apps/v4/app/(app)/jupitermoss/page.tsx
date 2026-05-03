import { jupitermossPlaces } from "@/lib/jupitermoss-places"

import { JupitermossBrowse } from "./jupitermoss-browse"

export default function JupitermossPage() {
  return <JupitermossBrowse places={jupitermossPlaces} />
}
