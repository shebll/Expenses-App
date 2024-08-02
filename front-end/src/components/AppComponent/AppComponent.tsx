// AppComponent.tsx
import { useState } from "react";
import Expenses from "./components/Expenses";
import TotalExpenses from "./components/TotalExpenses";
import CreateExpense from "./components/Create/CreateExpense";
import { Expense } from "@/types/Expense";
import { useCreateExpense } from "@/hooks/CreateExpense";

const AppComponent = () => {
  const { openModel, setOpenModel } = useCreateExpense((state) => state);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleCloseCreateModal = () => {
    setOpenModel();
    setEditingExpense(null);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setOpenModel();
  };

  return (
    <section className="container p-4 mx-auto">
      <TotalExpenses />
      <Expenses onEditExpense={handleEditExpense} />

      <CreateExpense
        openModel={openModel}
        expense={editingExpense}
        onClose={handleCloseCreateModal}
      />
    </section>
  );
};

export default AppComponent;
