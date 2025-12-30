'use client';

import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    ChevronLeft,
    Download,
    Trophy,
    Target,
    TrendingUp,
    Clock,
    CalendarDays,
    FileText,
    Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Submission } from '@/types';

export default function StudentReportPage() {
    const params = useParams();
    const router = useRouter();
    const studentId = params.studentId as string;
    const supabase = createClient();

    const [student, setStudent] = useState<User | null>(null);
    const [studentSubmissions, setStudentSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            // 1. Fetch Student Details
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', studentId)
                .single();

            if (userError) {
                console.error("Error fetching student:", userError);
                setIsLoading(false);
                return;
            }

            if (userData) {
                setStudent({
                    id: userData.id,
                    name: userData.full_name || 'Unknown',
                    email: userData.email || '',
                    type: userData.role as "student" | "admin",
                    class: userData.class_grade || undefined,
                    division: userData.division || undefined,
                    active: userData.is_active || false
                });
            }

            // 2. Fetch Submissions with Exam Title
            const { data: subData, error: subError } = await supabase
                .from('submissions')
                .select('*, exams(title)')
                .eq('student_id', studentId)
                .order('submitted_at', { ascending: false });

            if (subError) {
                console.error("Error fetching submissions:", subError);
            }

            if (subData) {
                const mappedSubmissions: Submission[] = subData.map((sub: any) => ({
                    id: sub.id,
                    examId: sub.exam_id,
                    examTitle: sub.exams?.title || 'Untitled Exam',
                    studentId: sub.student_id,
                    userName: userData?.full_name || '',
                    answers: [],
                    score: sub.score,
                    totalMarks: sub.total_marks,
                    status: sub.status as "pending" | "completed",
                    startedAt: sub.started_at,
                    submittedAt: sub.submitted_at,
                    feedback: sub.feedback_summary
                }));
                setStudentSubmissions(mappedSubmissions);
            }

            setIsLoading(false);
        };

        if (studentId) {
            fetchData();
        }
    }, [studentId]);

    // Calculate Stats
    const totalExams = studentSubmissions.length;
    const totalScore = studentSubmissions.reduce((acc, curr) => acc + curr.score, 0);
    const maxScore = studentSubmissions.reduce((acc, curr) => acc + curr.totalMarks, 0);
    const averagePercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    // Chart data
    const performanceData = studentSubmissions.map(sub => ({
        name: (sub.examTitle || 'Untitled').split(' ')[0],
        score: sub.score,
        total: sub.totalMarks
    })).reverse();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading student report...</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold">Student Not Found</h2>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title={`${student.name}'s Report`}
                description={`Performance analysis and exam history for Class ${student.class}-${student.division}`}
                breadcrumbs={[
                    { label: 'Admin', href: '/admin' },
                    { label: 'Students', href: '/admin/students' },
                    { label: 'Report', active: true },
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.back()}>
                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <Button className="bg-black hover:bg-black/90 text-white">
                            <Download className="w-4 h-4 mr-2" /> Export PDF
                        </Button>
                    </div>
                }
            />

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-indigo-100/50 rounded-xl text-indigo-600">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Avg Score</p>
                            <h3 className="text-2xl font-bold text-gray-900">{averagePercentage}%</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-emerald-100/50 rounded-xl text-emerald-600">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Exams Taken</p>
                            <h3 className="text-2xl font-bold text-gray-900">{totalExams}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100 shadow-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-amber-100/50 rounded-xl text-amber-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">Attendance</p>
                            <h3 className="text-2xl font-bold text-gray-900">92%</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-rose-50 to-white border-rose-100 shadow-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-rose-100/50 rounded-xl text-rose-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-rose-600 uppercase tracking-wider">Avg Time</p>
                            <h3 className="text-2xl font-bold text-gray-900">45m</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / List of Exams */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Exam History</CardTitle>
                            <CardDescription>Detailed breakdown of recent performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {studentSubmissions.length > 0 ? (
                                    studentSubmissions.map((sub) => (
                                        <div key={sub.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/50 transition-colors gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-gray-100 rounded-lg text-gray-600">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{sub.examTitle || 'Untitled Exam'}</h4>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                        <CalendarDays className="w-3.5 h-3.5" />
                                                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                                <div className="text-right">
                                                    <p className="text-xs font-medium text-muted-foreground uppercase">Score</p>
                                                    <p className="text-lg font-bold text-gray-900">{sub.score} <span className="text-xs font-medium text-gray-400">/ {sub.totalMarks}</span></p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-medium text-muted-foreground uppercase">Grade</p>
                                                    <Badge variant="outline" className={cn(
                                                        "mt-1",
                                                        (sub.score / sub.totalMarks) >= 0.8 ? "bg-green-50 text-green-700 border-green-200" :
                                                            (sub.score / sub.totalMarks) >= 0.6 ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                                "bg-red-50 text-red-700 border-red-200"
                                                    )}>
                                                        {(sub.score / sub.totalMarks) >= 0.9 ? 'A+' :
                                                            (sub.score / sub.totalMarks) >= 0.8 ? 'A' :
                                                                (sub.score / sub.totalMarks) >= 0.7 ? 'B' :
                                                                    (sub.score / sub.totalMarks) >= 0.6 ? 'C' : 'F'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-muted-foreground">
                                        No exam submissions found for this student.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info - Performance Chart maybe? */}
                <div className="space-y-6">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="bg-gray-900 text-white">
                            <CardTitle>Performance Trend</CardTitle>
                            <CardDescription className="text-gray-400">Scores over the last 5 exams</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[250px] w-full">
                                {performanceData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={performanceData}>
                                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                cursor={{ fill: '#f3f4f6' }}
                                            />
                                            <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                                        Not enough data for insights
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Teacher's Remarks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-900">
                                <p className="italic">"{student.name} is showing consistent improvement in Physics, but needs some extra attention in Chemistry theoretical concepts."</p>
                                <div className="mt-2 font-semibold text-xs text-yellow-700 text-right">- Mrs. Anderson, Class Teacher</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
