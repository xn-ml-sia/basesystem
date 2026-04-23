import SwiftUI

public struct DSSeparator: View {
    public init() {}

    public var body: some View {
        Rectangle()
            .fill(Color.dsBorder.opacity(0.6))
            .frame(height: 1)
    }
}
