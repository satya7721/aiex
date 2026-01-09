import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: "indigo" | "purple" | "amber" | "emerald" | "rose" | "blue" | "gray";
}

export function InfoCard({ label, value, icon: Icon, color = "gray" }: InfoCardProps) {
    const colorMap = {
        indigo: "text-indigo-600",
        purple: "text-purple-600",
        amber: "text-amber-600",
        emerald: "text-emerald-600",
        rose: "text-rose-600",
        blue: "text-blue-600",
        gray: "text-gray-600",
    };

    return (
        <div className="flex items-center gap-3 text-sm min-w-[140px]">
            <div className={cn("w-8 h-8 rounded-full bg-white flex items-center justify-center border shadow-sm", colorMap[color])}>
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{label}</p>
                <p className="font-semibold">{value}</p>
            </div>
        </div>
    );
}
