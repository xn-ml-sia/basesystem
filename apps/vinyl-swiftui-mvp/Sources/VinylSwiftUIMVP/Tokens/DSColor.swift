import SwiftUI
#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

public enum DSColor {
    public static let background = Color.dynamic(light: 1.0, dark: 0.12)
    public static let foreground = Color.dynamic(light: 0.16, dark: 0.96)
    public static let muted = Color.dynamic(light: 0.965, dark: 0.21)
    public static let mutedForeground = Color.dynamic(light: 0.58, dark: 0.72)
    public static let card = Color.dynamic(light: 0.99, dark: 0.16)
    public static let border = Color.dynamic(light: 0.9, dark: 0.28)
    public static let primary = Color(red: 0.77, green: 0.63, blue: 0.39)
    public static let primaryForeground = Color.dynamic(light: 0.99, dark: 0.14)
}

public extension Color {
    static let dsBackground = DSColor.background
    static let dsForeground = DSColor.foreground
    static let dsMuted = DSColor.muted
    static let dsMutedForeground = DSColor.mutedForeground
    static let dsCard = DSColor.card
    static let dsBorder = DSColor.border
    static let dsPrimary = DSColor.primary
    static let dsPrimaryForeground = DSColor.primaryForeground

    static func dynamic(light: Double, dark: Double) -> Color {
#if canImport(UIKit)
        Color(UIColor { traits in
            let value = traits.userInterfaceStyle == .dark ? dark : light
            return UIColor(white: value, alpha: 1.0)
        })
#elseif canImport(AppKit)
        Color(NSColor(name: nil) { appearance in
            let darkName = appearance.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua
            let value = darkName ? dark : light
            return NSColor(white: value, alpha: 1.0)
        })
#else
        Color(white: light)
#endif
    }
}
