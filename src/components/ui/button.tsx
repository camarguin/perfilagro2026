import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95 hover:shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 active:bg-destructive/80",
        outline:
          "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-white shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline shadow-none hover:shadow-none",
        cta: "bg-secondary text-secondary-foreground font-black hover:bg-secondary/90 shadow-xl hover:shadow-secondary/20 hover:-translate-y-0.5",
        "cta-primary": "bg-primary text-primary-foreground font-black hover:bg-primary/90 shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg gap-1.5 px-4",
        lg: "h-14 rounded-2xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg",
        "2xl": "h-20 rounded-3xl px-12 text-xl",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
