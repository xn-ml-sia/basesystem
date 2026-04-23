import SwiftUI

#Preview("Discover iPhone Light") {
    DiscoverView(records: VinylFixtures.records)
        .preferredColorScheme(.light)
}

#Preview("Discover iPhone Dark") {
    DiscoverView(records: VinylFixtures.records)
        .preferredColorScheme(.dark)
}

#Preview("Discover iPad Light") {
    DiscoverView(records: VinylFixtures.records)
        .preferredColorScheme(.light)
}

#Preview("Discover iPad Dark") {
    DiscoverView(records: VinylFixtures.records)
        .preferredColorScheme(.dark)
}

#Preview("Detail iPhone Light") {
    VinylDetailView(record: VinylFixtures.records[0])
        .preferredColorScheme(.light)
}

#Preview("Detail iPhone Dark") {
    VinylDetailView(record: VinylFixtures.records[0])
        .preferredColorScheme(.dark)
}

#Preview("Detail iPad Light") {
    VinylDetailView(record: VinylFixtures.records[0])
        .preferredColorScheme(.light)
}

#Preview("Detail iPad Dark") {
    VinylDetailView(record: VinylFixtures.records[0])
        .preferredColorScheme(.dark)
}
