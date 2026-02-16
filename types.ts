export type Category = "Work" | "Personal" | "Health" | "Finance" | "Other";

export interface Task {
  id: string;
  name: string;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  due_time?: string | null;
  category: Category;
  description: string;
  completed: boolean;
  user_id?: string;
}

export interface User {
  name: string;
  email: string;
}
