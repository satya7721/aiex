export type UserType = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  class?: string;
  division?: string;
  active?: boolean;
} 