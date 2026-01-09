import { Sidebar } from '@/components/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50/50 dark:bg-zinc-900/50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
