import SwiftUI

public struct DSButton: View {
    public enum Variant {
        case primary
        case secondary
        case ghost
        case outline
    }

    let title: String
    let variant: Variant
    let icon: String?
    let action: () -> Void

    public init(
        _ title: String,
        variant: Variant = .primary,
        icon: String? = nil,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.variant = variant
        self.icon = icon
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: DSSpacing.xs) {
                if let icon {
                    Image(systemName: icon)
                        .font(.system(size: 12, weight: .semibold))
                }
                Text(title)
                    .font(DSTypography.badge)
            }
            .padding(.vertical, DSSpacing.xs)
            .padding(.horizontal, DSSpacing.md)
            .frame(minHeight: 36)
            .foregroundStyle(foreground)
            .background(background)
            .clipShape(Capsule())
            .overlay(
                Capsule()
                    .stroke(border, lineWidth: variant == .outline ? 1 : 0)
            )
        }
        .buttonStyle(.plain)
    }

    private var background: Color {
        switch variant {
        case .primary:
            return .dsPrimary
        case .secondary:
            return .dsMuted
        case .ghost, .outline:
            return .clear
        }
    }

    private var foreground: Color {
        switch variant {
        case .primary:
            return .dsPrimaryForeground
        default:
            return .dsForeground
        }
    }

    private var border: Color {
        variant == .outline ? .dsBorder : .clear
    }
}
