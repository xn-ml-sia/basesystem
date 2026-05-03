import * as React from "react"

import { cn } from "../lib/utils"

type ButtonVariant = "default" | "outline" | "secondary"
type ButtonSize = "default" | "sm" | "lg"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-foreground/90",
  outline: "border border-border bg-background text-foreground hover:bg-accent",
  secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
}

const sizeStyles: Record<ButtonSize, string> = {
  default: "h-11 px-5",
  sm: "h-9 px-4 text-xs",
  lg: "h-12 px-6 text-base",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
)

Button.displayName = "Button"
