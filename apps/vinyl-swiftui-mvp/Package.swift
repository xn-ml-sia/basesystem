// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "VinylSwiftUIMVP",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "VinylSwiftUIMVP",
            targets: ["VinylSwiftUIMVP"]
        )
    ],
    targets: [
        .target(
            name: "VinylSwiftUIMVP"
        )
    ]
)
