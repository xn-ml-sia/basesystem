export const TableSemanticStyleMap = {
  "component": "table-semantic",
  "variants": [
    {
      "variantId": "dark-default",
      "theme": "dark",
      "captureSource": "ssr",
      "selectors": {
        ".css-etJQGw:hover": "background-color:#292929",
        ".css-iSzYmm": "-webkit-overflow-scrolling:touch;background-color:#161616;overflow:auto;position:relative;transform:scale(1)",
        ".css-jkqalI": "border-spacing:0;box-sizing:border-box;min-width:100%"
      }
    },
    {
      "variantId": "light-default",
      "theme": "light",
      "captureSource": "ssr",
      "selectors": {
        ".css-ffiBQt": "-webkit-overflow-scrolling:touch;background-color:#FFFFFF;overflow:auto;position:relative;transform:scale(1)",
        ".css-jkqalI": "border-spacing:0;box-sizing:border-box;min-width:100%",
        ".css-krNSPm:hover": "background-color:#F3F3F3"
      }
    }
  ]
} as const
