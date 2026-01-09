export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            exams: {
                Row: {
                    class_grade: string | null
                    created_at: string
                    created_by: string | null
                    division: string | null
                    duration_minutes: number | null
                    id: string
                    status: string | null
                    subject: string
                    title: string
                    total_marks: number | null
                }
                Insert: {
                    class_grade?: string | null
                    created_at?: string
                    created_by?: string | null
                    division?: string | null
                    duration_minutes?: number | null
                    id?: string
                    status?: string | null
                    subject: string
                    title: string
                    total_marks?: number | null
                }
                Update: {
                    class_grade?: string | null
                    created_at?: string
                    created_by?: string | null
                    division?: string | null
                    duration_minutes?: number | null
                    id?: string
                    status?: string | null
                    subject?: string
                    title?: string
                    total_marks?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "exams_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            questions: {
                Row: {
                    correct_option_id: string | null
                    exam_id: string
                    id: string
                    marks: number
                    model_answer: string | null
                    options: Json | null
                    order_index: number | null
                    text: string
                    type: string
                }
                Insert: {
                    correct_option_id?: string | null
                    exam_id: string
                    id?: string
                    marks: number
                    model_answer?: string | null
                    options?: Json | null
                    order_index?: number | null
                    text: string
                    type: string
                }
                Update: {
                    correct_option_id?: string | null
                    exam_id?: string
                    id?: string
                    marks?: number
                    model_answer?: string | null
                    options?: Json | null
                    order_index?: number | null
                    text?: string
                    type?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "questions_exam_id_fkey"
                        columns: ["exam_id"]
                        isOneToOne: false
                        referencedRelation: "exams"
                        referencedColumns: ["id"]
                    }
                ]
            }
            submission_answers: {
                Row: {
                    feedback: string | null
                    id: string
                    marks_awarded: number | null
                    question_id: string
                    student_answer: string | null
                    submission_id: string
                }
                Insert: {
                    feedback?: string | null
                    id?: string
                    marks_awarded?: number | null
                    question_id: string
                    student_answer?: string | null
                    submission_id: string
                }
                Update: {
                    feedback?: string | null
                    id?: string
                    marks_awarded?: number | null
                    question_id?: string
                    student_answer?: string | null
                    submission_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "submission_answers_question_id_fkey"
                        columns: ["question_id"]
                        isOneToOne: false
                        referencedRelation: "questions"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "submission_answers_submission_id_fkey"
                        columns: ["submission_id"]
                        isOneToOne: false
                        referencedRelation: "submissions"
                        referencedColumns: ["id"]
                    }
                ]
            }
            submissions: {
                Row: {
                    exam_id: string
                    feedback_summary: Json | null
                    id: string
                    score: number | null
                    started_at: string | null
                    status: string | null
                    student_id: string
                    submitted_at: string | null
                    total_marks: number | null
                }
                Insert: {
                    exam_id: string
                    feedback_summary?: Json | null
                    id?: string
                    score?: number | null
                    started_at?: string | null
                    status?: string | null
                    student_id: string
                    submitted_at?: string | null
                    total_marks?: number | null
                }
                Update: {
                    exam_id?: string
                    feedback_summary?: Json | null
                    id?: string
                    score?: number | null
                    started_at?: string | null
                    status?: string | null
                    student_id?: string
                    submitted_at?: string | null
                    total_marks?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "submissions_exam_id_fkey"
                        columns: ["exam_id"]
                        isOneToOne: false
                        referencedRelation: "exams"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "submissions_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            users: {
                Row: {
                    class_grade: string | null
                    created_at: string
                    division: string | null
                    email: string | null
                    full_name: string | null
                    id: string
                    is_active: boolean | null
                    role: string | null
                    updated_at: string
                }
                Insert: {
                    class_grade?: string | null
                    created_at?: string
                    division?: string | null
                    email?: string | null
                    full_name?: string | null
                    id: string
                    is_active?: boolean | null
                    role?: string | null
                    updated_at?: string
                }
                Update: {
                    class_grade?: string | null
                    created_at?: string
                    division?: string | null
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    is_active?: boolean | null
                    role?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
