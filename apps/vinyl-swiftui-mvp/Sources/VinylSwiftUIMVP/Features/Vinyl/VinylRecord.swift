import Foundation

public struct VinylRecord: Identifiable, Hashable, Sendable {
    public let id: String
    public let day: String
    public let title: String
    public let subtitle: String
    public let runtime: String
    public let condition: String
    public let tags: [String]
    public let description: String
    public let tracklist: [String]
    public let notes: [String]

    public init(
        id: String,
        day: String,
        title: String,
        subtitle: String,
        runtime: String,
        condition: String,
        tags: [String],
        description: String,
        tracklist: [String],
        notes: [String]
    ) {
        self.id = id
        self.day = day
        self.title = title
        self.subtitle = subtitle
        self.runtime = runtime
        self.condition = condition
        self.tags = tags
        self.description = description
        self.tracklist = tracklist
        self.notes = notes
    }
}

public enum VinylFixtures {
    public static let records: [VinylRecord] = [
        VinylRecord(
            id: "E8A1BDD8-9F2A-4781-B655-42555B4CFB74",
            day: "3_26_2026",
            title: "Midnight Aurora - Kyoto Live '78",
            subtitle: "First Japanese pressing on translucent smoke vinyl.",
            runtime: "44 min",
            condition: "Mint",
            tags: ["Rare Pressing", "Jazz Fusion", "Japan Import"],
            description: "Archivist-grade copy sourced from Osaka with original obi strip and lyric insert.",
            tracklist: [
                "A1 - City Lights Overture",
                "A2 - Neon Harbor",
                "A3 - 3AM Monorail",
                "B1 - Static Rain",
                "B2 - Night Bloom",
                "B3 - Last Train Home"
            ],
            notes: [
                "Verified matrix: KJ-78-A1 / KJ-78-B1 hand-etched.",
                "Sleeve grade: NM-, minimal corner wear, no seam split.",
                "Ultrasonic cleaned and play-tested on Ortofon Bronze.",
                "Ships in anti-static inner + Whiplash mailer with insurance."
            ]
        ),
        VinylRecord(
            id: "B21E43D3-2BE0-4E2D-8E43-5AB5CC7C62F1",
            day: "3_26_2026",
            title: "Satin Engine - Dream House",
            subtitle: "Limited 500-copy run in marbled violet wax.",
            runtime: "38 min",
            condition: "Near Mint",
            tags: ["Synth Pop", "Limited Run", "Colored Vinyl"],
            description: "Numbered sleeve (#184/500) with foil-stamped jacket and photo booklet.",
            tracklist: [
                "A1 - Glass Elevator",
                "A2 - Soft Collision",
                "A3 - Honey Static",
                "B1 - Dream House",
                "B2 - 12th Floor Lights",
                "B3 - Dawn Exit"
            ],
            notes: [
                "Verified variant: violet marble, no color bleed.",
                "Sleeve grade: VG++, faint ringwear only under direct light.",
                "Runout confirms original plant pressing, not 2024 repress.",
                "Includes protective outer sleeve and moisture barrier liner."
            ]
        ),
        VinylRecord(
            id: "81D13AFB-DC52-4B6A-9B71-69BC5223AFA8",
            day: "3_27_2026",
            title: "Sable Choir - Broadcast Archives",
            subtitle: "Unofficial 1983 radio sessions on heavyweight 180g.",
            runtime: "52 min",
            condition: "VG+",
            tags: ["Post Punk", "Live Sessions", "Collector Grade"],
            description: "Hard-to-find fan club issue with textured sleeve and stamped center labels.",
            tracklist: [
                "A1 - Inland Static",
                "A2 - Broken Cathedral",
                "A3 - Ash Signal",
                "B1 - Wire Hymn",
                "B2 - Winter Receiver",
                "B3 - Exit Frequency"
            ],
            notes: [
                "Conservative grading after full audition on both channels.",
                "Minor paper scuffs do not affect playback quality.",
                "Center hole calibrated; no spindle crack or warping.",
                "Packed with corner guards and double-boxed for overseas transit."
            ]
        ),
        VinylRecord(
            id: "D4425B21-1A55-4A1C-9B55-29D0D6A51129",
            day: "3_27_2026",
            title: "Blue Meridian - Nocturne Tapes",
            subtitle: "Late-night ambient suite on cloudy cobalt vinyl.",
            runtime: "47 min",
            condition: "Near Mint",
            tags: ["Ambient", "Blue Vinyl", "Limited Press"],
            description: "Private press from 1982 with hand-numbered insert and original inner sleeve.",
            tracklist: [
                "A1 - Harbor Tone",
                "A2 - Parallel Tide",
                "A3 - Tideglass",
                "B1 - Night Current",
                "B2 - Distant Buoy",
                "B3 - Morning Fade"
            ],
            notes: [
                "Stamped deadwax confirms original run.",
                "Sleeve corners clean, very light shelf wear.",
                "Quiet playback with no repeating clicks.",
                "Stored in smoke-free archive since acquisition."
            ]
        ),
        VinylRecord(
            id: "F03C9E42-7AEE-4B48-A33E-C1D3A0EAD701",
            day: "3_28_2026",
            title: "The Silver Arc - Futures in Mono",
            subtitle: "Rare UK mono mix with alt mastering.",
            runtime: "41 min",
            condition: "Mint",
            tags: ["UK Press", "Mono Mix", "Archive Copy"],
            description: "Collectors note this as the definitive mono cut with wider bass stage and quieter floor.",
            tracklist: [
                "A1 - Night Relay",
                "A2 - Carbon Signal",
                "A3 - Signal Bloom",
                "B1 - Flight Path",
                "B2 - Low Orbit",
                "B3 - Return Channel"
            ],
            notes: [
                "Matrix and stamper match first-month UK issue.",
                "No spindle wear visible under magnification.",
                "Pressing is flat, centered, and glossy.",
                "Insured shipping with reinforced LP mailer."
            ]
        ),
        VinylRecord(
            id: "4E2A6E3E-2B22-4E5A-98DD-937AAB66A8EE",
            day: "3_28_2026",
            title: "Glass District - Night Economy",
            subtitle: "City-pop crossover LP with obi and lyric card.",
            runtime: "49 min",
            condition: "VG+",
            tags: ["City Pop", "Japan Import", "Obi Included"],
            description: "Original pressing sourced from Yokohama estate lot with complete inserts.",
            tracklist: [
                "A1 - Metro Bloom",
                "A2 - Blue Avenue",
                "A3 - Satin Transit",
                "B1 - Lunar Taxi",
                "B2 - Last Platform",
                "B3 - Neon Quiet"
            ],
            notes: [
                "Playback graded VG+ with minor lead-in noise only.",
                "Obi intact and unfaded.",
                "Label print crisp with no writing or stamps.",
                "Shipped in anti-static sleeve and outer protector."
            ]
        )
    ]
}
