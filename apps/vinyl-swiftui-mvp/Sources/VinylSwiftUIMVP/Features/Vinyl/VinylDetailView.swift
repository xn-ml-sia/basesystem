import SwiftUI

public struct VinylDetailView: View {
    let record: VinylRecord
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.dismiss) private var dismiss
    @State private var pullDownOffset: CGFloat = 0
    private var backIconOpacity: Double {
        let progress = min(1, max(0, pullDownOffset / 120))
        return 1 - Double(progress)
    }

    private var detailRows: [[(String, String)]] {
        [
            [
                ("Condition", record.condition),
                ("Runtime", "\(record.runtime) runtime"),
                ("Format", "LP / 12 inch")
            ],
            [
                ("Catalog", "RSV-1983"),
                ("Region", "JP / EU / US"),
                ("Media", record.condition)
            ],
            [
                ("Pressing", "First Press"),
                ("Stock", "1 copy"),
                ("Est. Price", "$95 - $240")
            ]
        ]
    }

    public init(record: VinylRecord) {
        self.record = record
    }

    public var body: some View {
        ZStack(alignment: .bottom) {
            if horizontalSizeClass == .regular {
                regularLayout
            } else {
                compactLayout
            }

            FloatingActionBar()
                .padding(.bottom, DSSpacing.md)
        }
        .offset(y: pullDownOffset)
        .gesture(
            DragGesture(minimumDistance: 10)
                .onChanged { value in
                    guard value.translation.height > 0 else { return }
                    pullDownOffset = value.translation.height * 0.7
                }
                .onEnded { value in
                    if value.translation.height > 140 && abs(value.translation.width) < 120 {
                        dismiss()
                    }
                    pullDownOffset = 0
                }
        )
        .background(Color.dsMuted.opacity(0.2))
        .animation(.spring(response: 0.24, dampingFraction: 0.86), value: pullDownOffset)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .automatic) {
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(Color.dsForeground)
                        .frame(width: 34, height: 34)
                        .background(Color.dsBackground.opacity(0.9))
                        .clipShape(Circle())
                        .overlay(
                            Circle()
                                .stroke(Color.dsBorder.opacity(0.6), lineWidth: 1)
                        )
                        .opacity(backIconOpacity)
                }
                .buttonStyle(.plain)
            }
        }
    }

    private var regularLayout: some View {
        HStack(spacing: DSSpacing.xl) {
            heroVisual
                .frame(maxWidth: .infinity, maxHeight: .infinity)

            ScrollView {
                detailContent
                    .padding(.vertical, DSSpacing.lg)
            }
            .frame(maxWidth: .infinity)
        }
        .padding(.horizontal, DSSpacing.xl)
    }

    private var compactLayout: some View {
        ScrollView {
            VStack(spacing: DSSpacing.lg) {
                heroVisual
                    .frame(height: 360)
                detailContent
                    .padding(.bottom, 96)
            }
            .padding(.horizontal, DSSpacing.md)
            .padding(.top, DSSpacing.sm)
        }
    }

    private var heroVisual: some View {
        ZStack {
            Circle()
                .fill(Color.dsBackground)
                .overlay(Circle().stroke(Color.dsBorder.opacity(0.35), lineWidth: 1))
            Circle()
                .inset(by: 28)
                .fill(Color.dsMuted.opacity(0.3))
            Circle()
                .inset(by: 64)
                .fill(
                    LinearGradient(
                        colors: [Color.dsPrimary.opacity(0.55), Color.dsMuted.opacity(0.2)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
            Circle()
                .inset(by: 110)
                .fill(Color.dsCard.opacity(0.9))
                .overlay(Circle().stroke(Color.dsBorder.opacity(0.4), lineWidth: 1))
        }
        .frame(maxWidth: 560, maxHeight: 560)
        .aspectRatio(1, contentMode: .fit)
        .shadow(color: Color.black.opacity(0.15), radius: 28, x: 0, y: 10)
    }

    private var detailContent: some View {
        VStack(alignment: .leading, spacing: DSSpacing.lg) {
            breadcrumb

            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text(record.title)
                    .font(DSTypography.display)
                    .lineSpacing(2)
                    .fixedSize(horizontal: false, vertical: true)

                tagRow

                Text("\(record.subtitle) \(record.description)")
                    .font(DSTypography.body)
                    .foregroundStyle(Color.dsMutedForeground)
            }

            DSSeparator()

            detailsTable
            tracklistSection
            notesSection
        }
    }

    private var breadcrumb: some View {
        HStack(spacing: 4) {
            Text("Home")
            Image(systemName: "chevron.right")
                .font(.system(size: 10, weight: .bold))
            Text("Vinyl")
            Image(systemName: "chevron.right")
                .font(.system(size: 10, weight: .bold))
            Text("Rare Finds")
        }
        .font(DSTypography.caption)
        .foregroundStyle(Color.dsMutedForeground)
    }

    private var tagRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: DSSpacing.xs) {
                DSBadge(record.condition, variant: .outline)
                DSBadge("\(record.runtime) runtime", variant: .outline)
                DSBadge("1 copy", variant: .outline)
                ForEach(record.tags, id: \.self) { tag in
                    DSBadge(tag, variant: .secondary)
                }
            }
        }
    }

    private var detailsTable: some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            Text("Details")
                .font(DSTypography.title)

            VStack(spacing: 0) {
                ForEach(Array(detailRows.enumerated()), id: \.offset) { rowIndex, row in
                    LazyVGrid(
                        columns: Array(repeating: GridItem(.flexible(), spacing: 0), count: row.count),
                        spacing: 0
                    ) {
                        ForEach(Array(row.enumerated()), id: \.offset) { _, item in
                            MetadataGridCell(label: item.0, value: item.1)
                                .overlay(alignment: .trailing) {
                                    Rectangle()
                                        .fill(Color.dsBorder.opacity(0.6))
                                        .frame(width: 1)
                                }
                        }
                    }
                    if rowIndex == 0 {
                        Rectangle()
                            .fill(Color.dsBorder.opacity(0.6))
                            .frame(height: 1)
                    }
                }
            }
            .background(Color.dsBackground)
            .overlay(
                RoundedRectangle(cornerRadius: DSRadius.sm)
                    .stroke(Color.dsBorder.opacity(0.6), lineWidth: 1)
            )

            Text("*Inventory and condition notes are updated after each play-test.")
                .font(DSTypography.caption)
                .foregroundStyle(Color.dsMutedForeground)
        }
    }

    private var tracklistSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            Text("Tracklist")
                .font(DSTypography.section)
            VStack(spacing: DSSpacing.xs) {
                ForEach(record.tracklist, id: \.self) { track in
                    Text(track)
                        .font(DSTypography.body)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal, DSSpacing.sm)
                        .padding(.vertical, DSSpacing.xs)
                        .background(
                            RoundedRectangle(cornerRadius: DSRadius.sm)
                                .fill(Color.dsMuted.opacity(0.35))
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: DSRadius.sm)
                                .stroke(Color.dsBorder.opacity(0.5), lineWidth: 1)
                        )
                }
            }
        }
    }

    private var notesSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            Text("Collector Notes")
                .font(DSTypography.section)
            VStack(alignment: .leading, spacing: DSSpacing.md) {
                ForEach(Array(record.notes.enumerated()), id: \.offset) { index, note in
                    HStack(alignment: .top, spacing: DSSpacing.sm) {
                        DSBadge("\(index + 1)", variant: .secondary)
                        Text(note)
                            .font(DSTypography.body)
                            .foregroundStyle(Color.dsForeground)
                    }
                }
            }
            .padding(.bottom, 96)
        }
    }
}
