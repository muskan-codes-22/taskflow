export type Category = "Work" | "Personal" | "Health" | "Finance" | "Other";

export interface Task {
  id: string;
  name: string;
  date: string;
  startTime?: string;
  endTime?: string;
  category: Category;
  description: string;
  completed: boolean;
}

export interface User {
  name: string;
  email: string;
}
