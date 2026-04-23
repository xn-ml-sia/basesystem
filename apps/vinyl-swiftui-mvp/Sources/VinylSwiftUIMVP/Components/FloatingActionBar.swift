import SwiftUI

public struct FloatingActionBar: View {
    public init() {}

    public var body: some View {
        HStack(spacing: DSSpacing.xs) {
            DSButton("Save", variant: .ghost) {}
            DSButton("Listen", variant: .ghost) {}
            DSButton("Buy Now", variant: .primary, icon: "play.fill") {}
        }
        .padding(6)
        .background(Color.dsBackground.opacity(0.95))
        .clipShape(Capsule())
        .overlay(Capsule().stroke(Color.dsBorder.opacity(0.7), lineWidth: 1))
        .shadow(color: Color.black.opacity(0.12), radius: 12, x: 0, y: 4)
    }
}
