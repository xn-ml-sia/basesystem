export type Recipe = {
  id: string
  slug: string
  day: string
  title: string
  subtitle: string
  cookTime: string
  difficulty: "Mint" | "Near Mint" | "VG+"
  servings: number
  tags: string[]
  description: string
  ingredients: string[]
  steps: string[]
}

export const recipes: Recipe[] = [
  {
    id: "E8A1BDD8-9F2A-4781-B655-42555B4CFB74",
    slug: "midnight-aurora-live-1978",
    day: "3_26_2026",
    title: "Midnight Aurora - Kyoto Live '78",
    subtitle: "First Japanese pressing on translucent smoke vinyl.",
    cookTime: "44 min",
    difficulty: "Mint",
    servings: 1,
    tags: ["Rare Pressing", "Jazz Fusion", "Japan Import"],
    description:
      "Archivist-grade copy sourced from Osaka with original obi strip and lyric insert.",
    ingredients: [
      "A1 - City Lights Overture",
      "A2 - Neon Harbor",
      "A3 - 3AM Monorail",
      "B1 - Static Rain",
      "B2 - Night Bloom",
      "B3 - Last Train Home",
    ],
    steps: [
      "Verified matrix: KJ-78-A1 / KJ-78-B1 hand-etched.",
      "Sleeve grade: NM-, minimal corner wear, no seam split.",
      "Ultrasonic cleaned and play-tested on Ortofon Bronze.",
      "Ships in anti-static inner + Whiplash mailer with insurance.",
    ],
  },
  {
    id: "B21E43D3-2BE0-4E2D-8E43-5AB5CC7C62F1",
    slug: "satin-engine-dream-house",
    day: "3_26_2026",
    title: "Satin Engine - Dream House",
    subtitle: "Limited 500-copy run in marbled violet wax.",
    cookTime: "38 min",
    difficulty: "Near Mint",
    servings: 1,
    tags: ["Synth Pop", "Limited Run", "Colored Vinyl"],
    description:
      "Numbered sleeve (#184/500) with foil-stamped jacket and photo booklet.",
    ingredients: [
      "A1 - Glass Elevator",
      "A2 - Soft Collision",
      "A3 - Honey Static",
      "B1 - Dream House",
      "B2 - 12th Floor Lights",
      "B3 - Dawn Exit",
    ],
    steps: [
      "Verified variant: violet marble, no color bleed.",
      "Sleeve grade: VG++, faint ringwear only under direct light.",
      "Runout confirms original plant pressing, not 2024 repress.",
      "Includes protective outer sleeve and moisture barrier liner.",
    ],
  },
  {
    id: "81D13AFB-DC52-4B6A-9B71-69BC5223AFA8",
    slug: "sable-choir-broadcast-archives",
    day: "3_27_2026",
    title: "Sable Choir - Broadcast Archives",
    subtitle: "Unofficial 1983 radio sessions pressed on heavyweight 180g.",
    cookTime: "52 min",
    difficulty: "VG+",
    servings: 1,
    tags: ["Post Punk", "Live Sessions", "Collector Grade"],
    description:
      "Hard-to-find fan club issue with textured sleeve and stamped center labels.",
    ingredients: [
      "A1 - Inland Static",
      "A2 - Broken Cathedral",
      "A3 - Ash Signal",
      "B1 - Wire Hymn",
      "B2 - Winter Receiver",
      "B3 - Exit Frequency",
    ],
    steps: [
      "Conservative grading after full audition on both channels.",
      "Minor paper scuffs do not affect playback quality.",
      "Center hole calibrated; no spindle crack or warping.",
      "Packed with corner guards and double-boxed for overseas transit.",
    ],
  },
]

export function getRecipeById(recipeId: string) {
  return recipes.find((recipe) => recipe.id === recipeId)
}
