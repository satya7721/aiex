"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Home,
    BookOpen,
    CalendarDays,
    FileText,
    Clock,
    Users,
    Settings,
    Hexagon,
    LogOut
} from "lucide-react";

interface SidebarItem {
    icon: any;
    label: string;
    href: string;
    badge?: number;
    activeColor: string; // Tailwind classes for active state
}

const mainItems: SidebarItem[] = [
    {
        icon: Home,
        label: "Overview",
        href: "/admin/overview",
        activeColor: "bg-zinc-100 text-zinc-900"
    },
];

const classroomItems: SidebarItem[] = [
    {
        icon: BookOpen,
        label: "Class Preparation",
        href: "/admin/prep",
        activeColor: "bg-orange-50 text-orange-700"
    },
    {
        icon: CalendarDays,
        label: "Schedule",
        href: "/admin/schedule",
        activeColor: "bg-emerald-50 text-emerald-700"
    },
    {
        icon: Clock,
        label: "Attendance",
        href: "/admin/attendance",
        activeColor: "bg-blue-50 text-blue-700"
    },
];

const examItems: SidebarItem[] = [
    {
        icon: FileText,
        label: "Exams",
        href: "/admin",
        activeColor: "bg-violet-50 text-violet-700"
    },
    {
        icon: Users,
        label: "Students",
        href: "/admin/students",
        activeColor: "bg-amber-50 text-amber-700"
    },
];

export function Sidebar() {
    const pathname = usePathname();

    const renderNavGroup = (title: string | null, items: SidebarItem[]) => (
        <div className="mb-6">
            {title && <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2 uppercase tracking-wider">{title}</h3>}
            <nav className="space-y-1">
                {items.map((item) => {
                    const isExams = item.label === "Exams";
                    const isActive = isExams
                        ? (pathname === "/admin" || pathname.startsWith("/admin/exam"))
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                                isActive
                                    ? cn("shadow-sm font-medium", item.activeColor)
                                    : "text-muted-foreground hover:bg-white/50 hover:text-black"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("h-4 w-4", isActive && "stroke-[2.5px]")} />
                                <span>{item.label}</span>
                            </div>
                            {item.badge && (
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full",
                                    isActive ? "bg-black/10 text-black" : "bg-black text-white"
                                )}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );

    return (
        <div className="w-64 h-screen bg-gray-50/50 backdrop-blur-3xl border-r border-white/20 p-6 flex flex-col hidden md:flex sticky top-0 relative overflow-hidden">
            {/* Gradient Background Effect */}
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[60%] bg-purple-200/40 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-indigo-100/40 rounded-full blur-[60px] pointer-events-none" />

            {/* Content Content - Relative to keep above gradients */}
            <div className="relative z-10 flex flex-col h-full bg-transparent">
                <div className="flex items-center gap-2 mb-10 px-2 mt-2">
                    <div className="bg-black text-white p-1.5 rounded-xl shadow-lg shadow-black/20">
                        <Hexagon className="h-5 w-5 fill-current" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                    {/* Custom Rendering for Nav Groups to match image style exactly */}
                    {[
                        { title: "Main menu", items: mainItems },
                        { title: "Classroom", items: classroomItems },
                        // Merging Management into main flow or keeping separate if needed, 
                        // but user image shows flattened lists. I'll stick to our groups but style them.
                        { title: "Management", items: examItems }
                    ].map((group) => (
                        <div key={group.title}>
                            <h3 className="text-xs font-semibold text-gray-400 mb-3 px-3">{group.title}</h3>
                            <nav className="space-y-1">
                                {group.items.map((item) => {
                                    const isExams = item.label === "Exams";
                                    const isActive = isExams
                                        ? (pathname === "/admin" || pathname.startsWith("/admin/exam"))
                                        : pathname.startsWith(item.href);

                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-300 group",
                                                isActive
                                                    ? "bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] text-black font-semibold scale-[1.02]"
                                                    : "text-gray-600 hover:bg-white/40 hover:text-black font-medium"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-black" : "text-gray-500 group-hover:text-black")} />
                                                <span>{item.label}</span>
                                            </div>
                                            {item.badge && (
                                                <span className={cn(
                                                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                                                    isActive ? "bg-black text-white" : "bg-gray-200 text-gray-700"
                                                )}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200/30">
                    <h3 className="text-xs font-semibold text-gray-400 mb-3 px-3">Settings and news</h3>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-white/40 hover:text-black transition-all mb-6 font-medium"
                    >
                        <Settings className="h-4 w-4 text-gray-500" />
                        <span>Settings</span>
                    </Link>

                    <h3 className="text-xs font-semibold text-gray-400 mb-3 px-3">Account</h3>
                    <div className="flex items-center gap-3 px-2 py-1">
                        <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white shadow-sm">
                            <img
                                src="https://github.com/shadcn.png"
                                alt="User"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 leading-none">Amirbaqian</p>
                            <p className="text-xs font-medium text-gray-500 mt-1">Teacher</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
