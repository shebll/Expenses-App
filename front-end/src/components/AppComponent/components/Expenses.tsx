import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { api, expensesQueryOption } from "@/lib/api";
import ExpenseItem from "./ExpenseItem";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExpenseType, ExpenseWithTagsType } from "@app/sharedType";

const Expenses = ({
  onEditExpense,
}: {
  onEditExpense: (expense: ExpenseType) => void;
}) => {
  const queryClient = useQueryClient();
  const { error, isPending, data } = useQuery(expensesQueryOption);

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: number) =>
      api.expenses[":id"].$delete({ param: { id: String(id) } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["total-expenses"] });
    },
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (isPending)
    return (
      <>
        <div className="flex flex-col w-full gap-4">
          <div className="flex justify-between">
            <span className="inline-block w-32 h-6 rounded-md bg-secondary animate-pulse"></span>
            <span className="inline-block w-24 h-6 rounded-md bg-secondary animate-pulse"></span>
          </div>
          <hr />
          {[0, 1, 2, 3].map((_, index) => (
            <div className="flex justify-between" key={index}>
              <div className="flex items-center gap-4">
                <span className="inline-block w-12 h-12 rounded-md bg-secondary animate-pulse"></span>
                <div className="flex flex-col gap-2">
                  <span className="inline-block w-24 h-4 rounded-md bg-secondary animate-pulse"></span>
                  <span className="inline-block h-3 rounded-md w-28 bg-secondary animate-pulse"></span>
                </div>
              </div>
              <span className="inline-block w-24 h-4 rounded-md bg-secondary animate-pulse"></span>
            </div>
          ))}
        </div>
      </>
    );

  const groupedExpenses =
    data &&
    data.expenses.reduce(
      (acc, expense) => {
        const date = format(new Date(expense.createdAt!), "MMMM d, yyyy");
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(expense);
        return acc;
      },
      {} as { [date: string]: ExpenseWithTagsType[] }
    );

  const handleEdit = (expense: ExpenseType) => {
    onEditExpense(expense);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      deleteExpenseMutation.mutate(id);
    }
  };

  const renderExpenses = () => {
    return Object.entries(groupedExpenses || {}).map(([date, expenses]) => {
      const total = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      );
      const isToday = date === format(new Date(), "MMMM d, yyyy");
      return (
        <div key={date} className="flex flex-col gap-1 ">
          <div className="flex justify-between">
            <div className="text-lg font-bold ">{isToday ? "Today" : date}</div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
              ${total.toFixed(2)}
            </div>
          </div>
          <hr />
          <div className="flex flex-col gap-8 py-4">
            {expenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onEdit={() => handleEdit(expense)}
                onDelete={() => handleDelete(expense.id)}
              />
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <section className="h-[50vh] overflow-y-auto flex flex-col gap-6 scrollbar-thin">
      {renderExpenses()}
    </section>
  );
};

export default Expenses;
