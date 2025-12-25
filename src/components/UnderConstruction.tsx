import { Construction } from "lucide-react";

interface UnderConstructionProps {
    title: string;
    description?: string;
}

export default function UnderConstruction({ title, description }: UnderConstructionProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white/50 rounded-2xl border border-dashed border-gray-200">
            <div className="bg-orange-100 p-4 rounded-full mb-6 text-orange-600">
                <Construction className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground max-w-md">
                {description || "This feature is currently under development. Check back soon for updates."}
            </p>
        </div>
    );
}
