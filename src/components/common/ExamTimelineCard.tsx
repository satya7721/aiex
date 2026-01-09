import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, MoreHorizontal } from "lucide-react";

interface ExamTimelineCardProps {
    id: string;
    className: string;
    title: string;
    grade: string;
    participants: number;
    status: string;
    time: string;
    duration: string;
    color: string;
}

export function ExamTimelineCard({
    id,
    className: examClassName, // renamed to avoid conflict
    title,
    grade,
    participants,
    status,
    time,
    duration,
    color
}: ExamTimelineCardProps) {

    const getColorClasses = (c: string) => {
        const map: Record<string, { bg: string, text: string }> = {
            indigo: { bg: "bg-indigo-100", text: "text-indigo-700" },
            amber: { bg: "bg-amber-100", text: "text-amber-700" },
            rose: { bg: "bg-rose-100", text: "text-rose-700" },
            emerald: { bg: "bg-emerald-100", text: "text-emerald-700" },
        };
        return map[c] || map.indigo;
    };

    const colors = getColorClasses(color);

    return (
        <div
            className="bg-white rounded-xl p-0 shadow-sm border border-gray-100 hover:shadow-md transition-all group overflow-hidden flex flex-col sm:flex-row"
        >
            {/* Left Color Strip */}
            <div className={cn("w-full sm:w-2 h-2 sm:h-auto", colors.bg.replace('100', '500'))} />

            <div className="p-5 flex-1 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* Time Info */}
                <div className="min-w-[100px] flex flex-row sm:flex-col gap-4 sm:gap-1 items-center sm:items-start text-sm">
                    <div className="font-bold text-lg">{time}</div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs">{duration}</span>
                    </div>
                </div>

                {/* Exam Details */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide", colors.bg, colors.text)}>
                            {examClassName}
                        </span>
                        <h4 className="font-bold text-base">{title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{grade} • {participants} Participants</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                    <div className="flex items-center gap-1.5">
                        {status === "Confirmed" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-dashed border-gray-300" />
                        )}
                        <span className={cn(
                            "text-xs font-medium",
                            status === "Confirmed" ? "text-emerald-600" : "text-muted-foreground"
                        )}>
                            {status}
                        </span>
                    </div>

                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
