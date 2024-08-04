export type Tag = {
  id: number;
  tagName: string;
  tagEmoji: string;
  userId: string;
};

export interface Expense {
  id: number;
  amount: string;
  tagId: string;
  tag: Tag | null;
  userId: string;
  createdAt: string | null;
}
