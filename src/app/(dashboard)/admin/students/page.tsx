'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/common/PageHeader';
import { FileBarChart, Search, Filter, Loader2 } from 'lucide-react';
import { User } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function StudentsListPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [divisionFilter, setDivisionFilter] = useState('all');
    const [students, setStudents] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'student');

            if (data) {
                // Map Supabase DB shape to App User shape
                const mappedUsers: User[] = data.map(user => ({
                    id: user.id,
                    name: user.full_name || 'Unknown',
                    email: user.email || '',
                    type: 'student',
                    class: user.class_grade || undefined,
                    division: user.division || undefined,
                    active: user.is_active || false
                }));
                setStudents(mappedUsers);
            } else if (error) {
                console.error("Error fetching students:", error);
            }
            setIsLoading(false);
        };

        fetchStudents();
    }, []);

    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = classFilter === 'all' || student.class === classFilter;
        const matchesDivision = divisionFilter === 'all' || student.division === divisionFilter;

        return matchesSearch && matchesClass && matchesDivision;
    });

    // Get unique classes and divisions for filters
    const classes = Array.from(new Set(students.map((s) => s.class).filter((c): c is string => !!c))).sort();
    const divisions = Array.from(new Set(students.map((s) => s.division).filter((d): d is string => !!d))).sort();

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="Student Management"
                description="View all students, filter by class/division, and access individual performance reports."
                breadcrumbs={[
                    { label: 'Admin', href: '/admin' },
                    { label: 'Students', active: true },
                ]}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Students Directory</CardTitle>
                    <CardDescription>
                        {isLoading ? 'Loading students...' : `${filteredStudents.length} students found`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <div className="flex gap-4">
                            <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={divisionFilter} onValueChange={setDivisionFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Division" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Divs</SelectItem>
                                    {divisions.map((div) => (
                                        <SelectItem key={div} value={div}>Div {div}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Division</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <div className="flex justify-center items-center gap-2 text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading data...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredStudents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No students found matching filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                    Class {student.class}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                    Div {student.division}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/admin/students/report/${student.id}`}>
                                                    <Button size="sm" variant="outline" className="gap-2">
                                                        <FileBarChart className="h-4 w-4 text-indigo-600" />
                                                        View Report
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
