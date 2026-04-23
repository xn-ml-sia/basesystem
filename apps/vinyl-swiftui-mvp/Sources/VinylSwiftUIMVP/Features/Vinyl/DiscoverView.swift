import SwiftUI

public struct DiscoverView: View {
    let records: [VinylRecord]
    @State private var swipeIndex = 0
    @State private var path: [VinylRecord] = []
    @Namespace private var transitionNamespace

    public init(records: [VinylRecord] = VinylFixtures.records) {
        self.records = records
    }

    public var body: some View {
        NavigationStack(path: $path) {
            SwipeDeck(
                records: records,
                swipeIndex: $swipeIndex,
                transitionNamespace: transitionNamespace,
                openRecord: { record in path.append(record) }
            )
            .background(Color.dsBackground.ignoresSafeArea())
            .navigationDestination(for: VinylRecord.self) { record in
                VinylDetailView(record: record)
                    .applyZoomNavigationTransition(id: record.id, namespace: transitionNamespace)
            }
        }
    }
}

private struct SwipeDeck: View {
    let records: [VinylRecord]
    @Binding var swipeIndex: Int
    let transitionNamespace: Namespace.ID
    let openRecord: (VinylRecord) -> Void

    @State private var dragOffset: CGSize = .zero
    @State private var swipingOut = false

    private var reachedEnd: Bool { swipeIndex >= records.count }
    private var activeRecord: VinylRecord? {
        guard swipeIndex < records.count else { return nil }
        return records[swipeIndex]
    }
    private var stackRecords: [VinylRecord] {
        Array(records.dropFirst(swipeIndex).prefix(5))
    }

    var body: some View {
        GeometryReader { proxy in
            let totalHeight = proxy.size.height
            let cardHeight = max(520, totalHeight - 110)

            VStack(spacing: DSSpacing.md) {
                if reachedEnd {
                    VStack(alignment: .leading, spacing: DSSpacing.md) {
                        Text("No more records in the stack")
                            .font(.system(size: 24, weight: .medium, design: .default))
                        Text("You reached the end of this swipe deck.")
                            .font(DSTypography.body)
                            .foregroundStyle(Color.dsMutedForeground)
                        DSButton("Start Over", variant: .outline) {
                            swipeIndex = 0
                        }
                    }
                    .padding(DSSpacing.lg)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                    .background(Color.dsCard)
                    .overlay(
                        RoundedRectangle(cornerRadius: DSRadius.lg)
                            .stroke(Color.dsBorder.opacity(0.6), lineWidth: 1)
                    )
                    .clipShape(RoundedRectangle(cornerRadius: DSRadius.lg))
                } else {
                    ZStack {
                        ForEach(Array(stackRecords.enumerated()), id: \.element.id) { index, record in
                            let reverseIndex = stackRecords.count - 1 - index
                            let isTop = index == 0

                            RecordCard(record: record, isSwipeMode: true)
                                .applyMatchedTransitionSource(id: record.id, namespace: transitionNamespace)
                                .overlay {
                                    if !isTop {
                                        RoundedRectangle(cornerRadius: DSRadius.lg)
                                            .fill(Color.dsBackground.opacity(0.2))
                                    }
                                }
                                .overlay(alignment: .topLeading) {
                                    if isTop {
                                        SwipeOverlayBadge(
                                            title: "PASS",
                                            color: .red,
                                            opacity: leftBadgeOpacity
                                        )
                                        .padding(DSSpacing.md)
                                    }
                                }
                                .overlay(alignment: .topTrailing) {
                                    if isTop {
                                        SwipeOverlayBadge(
                                            title: "LIKE",
                                            color: .green,
                                            opacity: rightBadgeOpacity
                                        )
                                        .padding(DSSpacing.md)
                                    }
                                }
                                .offset(
                                    x: isTop ? dragOffset.width : 0,
                                    y: CGFloat(reverseIndex) * 10
                                )
                                .rotationEffect(.degrees(isTop ? Double(dragOffset.width / 20) : 0))
                                .scaleEffect(1 - CGFloat(reverseIndex) * 0.03)
                                .zIndex(Double(stackRecords.count - index))
                                .shadow(
                                    color: Color.black.opacity(0.06 + Double(index) * 0.02),
                                    radius: CGFloat(10 + index * 3),
                                    x: 0,
                                    y: CGFloat(4 + index * 2)
                                )
                                .contentShape(Rectangle())
                                .allowsHitTesting(isTop)
                                .onTapGesture {
                                    if isTop {
                                        openRecord(record)
                                    }
                                }
                                .highPriorityGesture(swipeGesture)
                        }
                    }
                    .frame(height: cardHeight)

                    HStack(spacing: DSSpacing.sm) {
                        SwipeActionIconButton(symbol: "trash", tint: .red) { finishSwipe(.left) }
                        if let activeRecord {
                            Button {
                                openRecord(activeRecord)
                            } label: {
                                Image(systemName: "arrow.up.forward.app")
                                    .font(.system(size: 15, weight: .semibold))
                                    .foregroundStyle(Color.dsPrimaryForeground)
                                    .frame(width: 44, height: 44)
                                    .background(Color.dsPrimary)
                                    .clipShape(Circle())
                            }
                            .buttonStyle(.plain)
                        }
                        SwipeActionIconButton(symbol: "heart.fill", tint: .green) { finishSwipe(.right) }
                    }
                }
            }
            .padding(.horizontal, DSSpacing.md)
            .padding(.top, DSSpacing.md)
            .padding(.bottom, DSSpacing.xs)
        }
    }

    private var swipeGesture: some Gesture {
        DragGesture(minimumDistance: 8)
            .onChanged { value in
                guard !swipingOut else { return }
                dragOffset = value.translation
            }
            .onEnded { value in
                guard !swipingOut else { return }
                let threshold: CGFloat = 110
                let projectedX = value.predictedEndTranslation.width
                if projectedX > threshold {
                    finishSwipe(.right)
                } else if projectedX < -threshold {
                    finishSwipe(.left)
                } else {
                    withAnimation(.spring(response: 0.26, dampingFraction: 0.82)) {
                        dragOffset = .zero
                    }
                }
            }
    }

    private enum SwipeDirection {
        case left
        case right
    }

    private var rightBadgeOpacity: Double {
        let threshold: CGFloat = 110
        let progress = max(0, dragOffset.width) / threshold
        return min(1, Double(progress))
    }

    private var leftBadgeOpacity: Double {
        let threshold: CGFloat = 110
        let progress = max(0, -dragOffset.width) / threshold
        return min(1, Double(progress))
    }

    private func finishSwipe(_ direction: SwipeDirection) {
        guard !swipingOut else { return }
        swipingOut = true
        withAnimation(.easeIn(duration: 0.2)) {
            dragOffset = CGSize(width: direction == .left ? -800 : 800, height: 0)
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.18) {
            swipeIndex = min(swipeIndex + 1, records.count)
            dragOffset = .zero
            swipingOut = false
        }
    }
}

private struct SwipeOverlayBadge: View {
    let title: String
    let color: Color
    let opacity: Double

    var body: some View {
        Text(title)
            .font(.system(size: 14, weight: .bold, design: .default))
            .foregroundStyle(color)
            .padding(.horizontal, DSSpacing.sm)
            .padding(.vertical, DSSpacing.xs)
            .overlay(
                RoundedRectangle(cornerRadius: DSRadius.sm)
                    .stroke(color, lineWidth: 2)
            )
            .rotationEffect(.degrees(title == "LIKE" ? 10 : -10))
            .opacity(opacity)
    }
}

private struct RecordCard: View {
    let record: VinylRecord
    var isSwipeMode: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            Rectangle()
                .fill(
                    LinearGradient(
                        colors: [Color.dsPrimary.opacity(0.2), Color.dsMuted, Color.dsPrimary.opacity(0.1)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(height: isSwipeMode ? 380 : 220)
                .clipShape(RoundedRectangle(cornerRadius: DSRadius.md))

            Text(record.title)
                .font(.system(size: 22, weight: .medium, design: .default))
                .foregroundStyle(Color.dsForeground)
                .lineLimit(2)

            Text(record.subtitle)
                .font(DSTypography.body)
                .foregroundStyle(Color.dsMutedForeground)
                .lineLimit(2)

            HStack(spacing: DSSpacing.xs) {
                ForEach(record.tags.prefix(3), id: \.self) { tag in
                    DSBadge(tag, variant: .secondary)
                }
            }

            HStack {
                Text("\(record.runtime) runtime")
                Spacer()
                Text("\(record.condition) grade")
            }
            .font(DSTypography.body)
            .foregroundStyle(Color.dsMutedForeground)
        }
        .padding(DSSpacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.dsCard)
        .overlay(
            RoundedRectangle(cornerRadius: DSRadius.lg)
                .stroke(Color.dsBorder.opacity(0.6), lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: DSRadius.lg))
    }
}

private struct SwipeActionIconButton: View {
    let symbol: String
    let tint: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: symbol)
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(tint)
                .frame(width: 44, height: 44)
                .background(Color.dsCard)
                .clipShape(Circle())
                .overlay(Circle().stroke(Color.dsBorder.opacity(0.6), lineWidth: 1))
        }
        .buttonStyle(.plain)
    }
}

private extension View {
    @ViewBuilder
    func applyMatchedTransitionSource(id: String, namespace: Namespace.ID) -> some View {
#if os(iOS)
        if #available(iOS 18.0, *) {
            self.matchedTransitionSource(id: id, in: namespace)
        } else {
            self
        }
#else
        self
#endif
    }

    @ViewBuilder
    func applyZoomNavigationTransition(id: String, namespace: Namespace.ID) -> some View {
#if os(iOS)
        if #available(iOS 18.0, *) {
            self.navigationTransition(.zoom(sourceID: id, in: namespace))
        } else {
            self
        }
#else
        self
#endif
    }
}
