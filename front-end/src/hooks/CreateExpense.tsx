import { create } from "zustand";

type UseCreateExpenseType = {
  openModel: boolean;
  setOpenModel: () => void;
};

export const useCreateExpense = create<UseCreateExpenseType>((set) => ({
  openModel: false,
  setOpenModel: () => set((state) => ({ openModel: !state.openModel })),
}));
