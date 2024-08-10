import { api } from "@/lib/api";

export const getMonthlyExpenses = async () => {
  const res = await api.analytics["monthly-expenses"].$get();
  if (!res.ok) throw new Error("Server Error");
  return res.json();
};

export const getWeeklyDailyExpenses = async () => {
  const res = await api.analytics["weekly-daily-expenses"].$get();
  if (!res.ok) throw new Error("Server Error");
  return res.json();
};

export const getMostFrequentTagWeekly = async () => {
  const res = await api.analytics["most-frequent-tag-weekly"].$get();
  if (!res.ok) throw new Error("Server Error");
  return res.json();
};

export const getMostFrequentTagMonthly = async () => {
  const res = await api.analytics["most-frequent-tag-monthly"].$get();
  if (!res.ok) throw new Error("Server Error");
  return res.json();
};

export const getHighestExpenseWeekly = async () => {
  const res = await api.analytics["highest-expense-weekly"].$get();
  if (!res.ok) throw new Error("Server Error");
  return res.json();
};

export const getHighestExpenseMonthly = async () => {
  const res = await api.analytics["highest-expense-monthly"].$get();
  if (!res.ok) throw new Error("Server Error");
  return res.json();
};
