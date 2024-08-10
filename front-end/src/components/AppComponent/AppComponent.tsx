// AppComponent.tsx
import { useState } from "react";
import Expenses from "./components/Expenses";
import TotalExpenses from "./components/TotalExpenses";
import CreateExpense from "./components/Create/CreateExpense";
import { useCreateExpense } from "@/hooks/CreateExpense";
import { ExpenseType } from "@app/sharedType";

const AppComponent = () => {
  const { openModel, setOpenModel } = useCreateExpense((state) => state);
  const [editingExpense, setEditingExpense] = useState<ExpenseType | null>(
    null
  );

  const handleCloseCreateModal = () => {
    setOpenModel();
    setEditingExpense(null);
  };

  const handleEditExpense = (expense: ExpenseType) => {
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
