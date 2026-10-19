export interface Book {
  id: number;
  title: string;
  is_lent: boolean;
  bar_code: string;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Lending {
  id: number;
  rating: number | null;
  return_date: string | null;
  due_date: string | null;
  is_late: boolean;
  member_id: number;
  book_id: number;
  created_at: string;
  updated_at: string;
}

export interface LendingWithDetails extends Lending {
  book: Book;
  member: Member;
  is_overdue: boolean;
}

export interface MemberStats {
  member: Member;
  returned_count: number;
  unreturned_count: number;
  max_rating: number | null;
  avg_rating: number | null;
  ever_late: boolean;
}

export interface DashboardStats {
  total_books: number;
  lent_books: number;
  overdue_count: number;
  total_members: number;
}
