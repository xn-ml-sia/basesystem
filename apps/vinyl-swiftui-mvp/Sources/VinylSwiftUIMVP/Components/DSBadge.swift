import SwiftUI

public struct DSBadge: View {
    public enum Variant {
        case outline
        case secondary
    }

    let label: String
    let variant: Variant

    public init(_ label: String, variant: Variant = .secondary) {
        self.label = label
        self.variant = variant
    }

    public var body: some View {
        Text(label)
            .font(DSTypography.badge)
            .foregroundStyle(variant == .outline ? Color.dsForeground : Color.dsMutedForeground)
            .padding(.horizontal, DSSpacing.sm)
            .padding(.vertical, 6)
            .background(variant == .outline ? Color.clear : Color.dsMuted.opacity(0.65))
            .clipShape(Capsule())
            .overlay(
                Capsule().stroke(variant == .outline ? Color.dsBorder : .clear, lineWidth: 1)
            )
    }
}
