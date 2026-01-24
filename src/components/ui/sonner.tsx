"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-[1.5rem] group-[.toaster]:p-6 group-[.toaster]:border-none group-[.toaster]:ring-1 group-[.toaster]:ring-black/5",
                    description: "group-[.toast]:text-muted-foreground group-[.toast]:font-medium",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl group-[.toast]:font-bold",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl group-[.toast]:font-bold",
                    success: "group-[.toast]:text-green-600 group-[.toast]:bg-green-50",
                    error: "group-[.toast]:text-red-600 group-[.toast]:bg-red-50",
                    title: "group-[.toast]:font-black group-[.toast]:text-lg group-[.toast]:tracking-tight",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
