import { User } from '@/types/user';

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Group students by class and division
 */
export function groupStudentsByClass(students: User[]) {
  return students.reduce((acc, student) => {
    if (student.type !== 'student') return acc;
    
    const batch = student.class || '12';
    const division = student.division || 'A';
    
    if (!acc[batch]) {
      acc[batch] = {};
    }
    if (!acc[batch][division]) {
      acc[batch][division] = [];
    }
    acc[batch][division].push(student);
    return acc;
  }, {} as { [key: string]: { [key: string]: User[] } });
}

/**
 * Filter students by active status
 */
export function filterStudentsByStatus(students: User[], active: boolean): User[] {
  return students.filter(student => 
    student.type === 'student' && student.active === active
  );
}

/**
 * Search students by name or email
 */
export function searchStudents(students: User[], searchTerm: string): User[] {
  const term = searchTerm.toLowerCase();
  return students.filter(student =>
    student.type === 'student' &&
    (student.name.toLowerCase().includes(term) ||
     student.email.toLowerCase().includes(term))
  );
}

/**
 * Get class and division options
 */
export function getClassAndDivisionOptions() {
  return {
    classes: ['11', '12'],
    divisions: ['A', 'B', 'C']
  };
}

/**
 * Validate student data
 */
export function validateStudentData(data: Partial<User>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Invalid email address');
  }

  if (!data.class || !['11', '12'].includes(data.class)) {
    errors.push('Invalid class selection');
  }

  if (!data.division || !['A', 'B', 'C'].includes(data.division)) {
    errors.push('Invalid division selection');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sort students by various criteria
 */
export function sortStudents(
  students: User[],
  sortBy: 'name' | 'class' | 'division' | 'status' = 'name',
  ascending = true
): User[] {
  return [...students].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'class':
        comparison = (a.class || '').localeCompare(b.class || '');
        break;
      case 'division':
        comparison = (a.division || '').localeCompare(b.division || '');
        break;
      case 'status':
        comparison = Number(a.active) - Number(b.active);
        break;
    }
    return ascending ? comparison : -comparison;
  });
}

/**
 * Get student statistics
 */
export function getStudentStatistics(students: User[]) {
  const activeStudents = students.filter(s => s.active).length;
  const totalStudents = students.length;
  
  const classCounts = students.reduce((acc, student) => {
    const batch = student.class || '12';
    acc[batch] = (acc[batch] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  return {
    totalStudents,
    activeStudents,
    inactiveStudents: totalStudents - activeStudents,
    activeRate: totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0,
    classCounts
  };
} 