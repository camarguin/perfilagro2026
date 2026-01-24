
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    description: string;
    badge: string;
    imageSrc?: string;
    align?: "center" | "left";
    className?: string;
}

export function PageHeader({
    title,
    description,
    badge,
    imageSrc = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop", // Default agriculture image
    align = "left",
    className,
}: PageHeaderProps) {
    return (
        <div className={cn("bg-primary pt-24 pb-20 px-4 md:pt-32 md:pb-28 relative overflow-hidden shadow-lg", className)}>
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay transition-transform duration-1000 hover:scale-105"
                style={{ backgroundImage: `url('${imageSrc}')` }}
            />

            {/* Content */}
            <div className={cn("container relative z-10 mx-auto", align === "center" ? "text-center" : "text-left")}>
                <div className={cn("inline-flex mb-6", align === "center" ? "mx-auto" : "")}>
                    <Badge className="bg-white/20 text-white hover:bg-white/30 border-none px-4 py-1.5 text-sm backdrop-blur-md uppercase tracking-wider font-medium">
                        {badge}
                    </Badge>
                </div>

                <h1 className={cn("font-heading text-4xl font-bold tracking-tight text-white md:text-6xl max-w-5xl mb-6 leading-tight", align === "center" ? "mx-auto" : "")}>
                    {title}
                </h1>

                <p className={cn("text-lg md:text-xl text-primary-foreground/90 max-w-2xl leading-relaxed", align === "center" ? "mx-auto" : "")}>
                    {description}
                </p>
            </div>
        </div>
    );
}
