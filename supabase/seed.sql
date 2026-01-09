
-- Seed Users
INSERT INTO public.users (id, full_name, email, role, class_grade, division) VALUES
('00000000-0000-0000-0000-000000000001', 'John Doe', 'john@example.com', 'student', '11', 'A'),
('00000000-0000-0000-0000-000000000002', 'Jane Smith', 'jane@example.com', 'student', '11', 'B'),
('00000000-0000-0000-0000-000000000003', 'Alice Johnson', 'alice@example.com', 'student', '12', 'A'),
('00000000-0000-0000-0000-000000000004', 'Bob Brown', 'bob@example.com', 'student', '12', 'B'),
('00000000-0000-0000-0000-000000000005', 'Charlie Davis', 'charlie@example.com', 'student', '10', 'A'),
('00000000-0000-0000-0000-000000000006', 'Diana Evans', 'diana@example.com', 'student', '10', 'A'),
('00000000-0000-0000-0000-000000000007', 'Evan Fisher', 'evan@example.com', 'student', '11', 'C'),
('00000000-0000-0000-0000-000000000000', 'Admin User', 'admin@example.com', 'admin', NULL, NULL);

-- Seed Exams
INSERT INTO public.exams (id, title, subject, class_grade, division, duration_minutes, total_marks, status, created_by, created_at) VALUES
('10000000-0000-0000-0000-000000000001', 'Physics Midterm', 'Physics', '11', 'A', 60, 100, 'published', '00000000-0000-0000-0000-000000000000', '2024-03-15 10:00:00+00'),
('10000000-0000-0000-0000-000000000002', 'Chemistry Final', 'Chemistry', '11', 'B', 90, 50, 'published', '00000000-0000-0000-0000-000000000000', '2024-03-16 10:00:00+00'),
('10000000-0000-0000-0000-000000000003', 'Mathematics Quiz', 'Mathematics', '12', 'A', 45, 25, 'published', '00000000-0000-0000-0000-000000000000', '2024-03-17 10:00:00+00'),
('10000000-0000-0000-0000-000000000004', 'Biology Test', 'Biology', '12', 'C', 30, 20, 'published', '00000000-0000-0000-0000-000000000000', '2024-03-18 10:00:00+00');

-- Seed Questions
-- Exam 1: Physics
INSERT INTO public.questions (id, exam_id, text, type, marks, order_index) VALUES
('20000000-0000-0000-0000-000000001001', '10000000-0000-0000-0000-000000000001', 'What is Newton''s First Law?', 'subjective', 10, 1),
('20000000-0000-0000-0000-000000001002', '10000000-0000-0000-0000-000000000001', 'Calculate the force required to accelerate a 2kg mass at 5m/s²', 'subjective', 10, 2);

-- Exam 2: Chemistry
INSERT INTO public.questions (id, exam_id, text, type, marks, order_index) VALUES
('20000000-0000-0000-0000-000000002001', '10000000-0000-0000-0000-000000000002', 'What is the chemical formula for water?', 'subjective', 10, 1);

-- Exam 3: Math
INSERT INTO public.questions (id, exam_id, text, type, marks, order_index) VALUES
('20000000-0000-0000-0000-000000003001', '10000000-0000-0000-0000-000000000003', 'Solve the quadratic equation: x² + 5x + 6 = 0', 'subjective', 10, 1);

-- Exam 4: Biology
INSERT INTO public.questions (id, exam_id, text, type, marks, order_index) VALUES
('20000000-0000-0000-0000-000000004001', '10000000-0000-0000-0000-000000000004', 'What is the powerhouse of the cell?', 'subjective', 10, 1);


-- Seed Submissions
-- Submission 1: John Doe on Physics
INSERT INTO public.submissions (id, exam_id, student_id, status, score, total_marks, feedback_summary, started_at, submitted_at) VALUES
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'completed', 85, 100,
'{"comments": "Good understanding of fundamental physics concepts. Could improve explanations of Newton''s laws with more specific details about force calculations.", "score": 85, "actionItems": ["Review kinetic energy calculations", "Practice more problems on Newton''s laws", "Focus on mathematical expressions of physical laws"]}',
'2024-03-15 10:45:30+00', '2024-03-15 11:45:30+00');

-- Answers for Submission 1
INSERT INTO public.submission_answers (id, submission_id, question_id, student_answer) VALUES
('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000001001', 'An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.'),
('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000001002', '10N');

-- Submission 2: Jane Smith on Chemistry
INSERT INTO public.submissions (id, exam_id, student_id, status, score, total_marks, feedback_summary, started_at, submitted_at) VALUES
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'completed', 92, 50,
'{"comments": "Excellent understanding of chemistry concepts. Your explanations are clear and demonstrate deep knowledge of the subject.", "score": 92, "actionItems": ["Explore advanced topics in organic chemistry", "Consider studying reaction kinetics in more detail", "Practice more complex stoichiometry problems"]}',
'2024-04-20 15:10:45+00', '2024-04-20 16:10:45+00');

-- Answers for Submission 2
INSERT INTO public.submission_answers (id, submission_id, question_id, student_answer) VALUES
('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000002001', 'H2O');
