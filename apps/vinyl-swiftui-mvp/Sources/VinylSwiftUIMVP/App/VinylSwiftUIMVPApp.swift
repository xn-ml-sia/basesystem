import SwiftUI

@main
struct VinylSwiftUIMVPApp: App {
    var body: some Scene {
        WindowGroup {
            DiscoverView(records: VinylFixtures.records)
                .background(Color.dsBackground)
        }
    }
}
