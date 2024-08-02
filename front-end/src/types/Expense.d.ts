export interface Tag {
  id: number;
  tagName: string;
  tagEmoji: string;
}

export interface Expense {
  id: number;
  amount: string;
  tagId: number;
  tag: Tag | null;
  userId: string;
  createdAt: string | null;
}
