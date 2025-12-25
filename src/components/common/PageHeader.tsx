import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div>
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        {breadcrumbs.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className={item.active ? "text-foreground font-medium" : ""}>
                                    {item.label}
                                </span>
                                {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4" />}
                            </div>
                        ))}
                    </div>
                )}
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description && <p className="text-muted-foreground mt-1">{description}</p>}
            </div>

            {actions && <div className="flex gap-2">{actions}</div>}
        </div>
    );
}
