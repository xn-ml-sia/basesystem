import SwiftUI

public struct MetadataGridCell: View {
    let label: String
    let value: String

    public init(label: String, value: String) {
        self.label = label
        self.value = value
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xxs) {
            Text(label)
                .font(DSTypography.caption)
                .foregroundStyle(Color.dsMutedForeground)
            Text(value)
                .font(DSTypography.bodyStrong)
                .foregroundStyle(Color.dsForeground)
                .lineLimit(2)
        }
        .frame(maxWidth: .infinity, minHeight: 88, alignment: .topLeading)
        .padding(.horizontal, DSSpacing.sm)
        .padding(.vertical, DSSpacing.sm)
    }
}
