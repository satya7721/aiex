import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, CircleDashed, Clock, AlertCircle } from "lucide-react";

type StatusType = "published" | "draft" | "pending" | "confirmed" | "archived" | "active" | string;

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
    showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase();

    const config: Record<string, { bg: string, text: string, border: string, icon: any }> = {
        published: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: CheckCircle2 },
        confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 },
        active: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: CheckCircle2 },
        draft: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: CircleDashed },
        pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
        archived: { bg: "bg-zinc-50", text: "text-zinc-500", border: "border-zinc-200", icon: AlertCircle },
    };

    const style = config[normalizedStatus] || config.draft;
    const Icon = style.icon;

    return (
        <Badge
            variant="outline"
            className={cn(
                "rounded-md px-2 py-0.5 pointer-events-none capitalize border",
                style.bg,
                style.text,
                style.border,
                className
            )}
        >
            {showIcon && <Icon className="mr-1.5 h-3.5 w-3.5" />}
            {status}
        </Badge>
    );
}
