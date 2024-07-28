import { useQuery } from "@tanstack/react-query";
import ExpenseItem from "./ExpenseItem";
import { api } from "@/lib/api";

const getTotal = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const res = await api.expenses.$get();
  if (!res.ok) throw new Error("Server Error");
  const data = await res.json();
  return data;
};

const Expenses = () => {
  const { error, isPending, data } = useQuery({
    queryKey: ["expenses"],
    queryFn: getTotal,
  });

  if (error) return "An error occurred: " + error.message;

  if (isPending) return <div>Loading...</div>;

  const groupedExpenses = data.expenses.reduce((acc, expense) => {
    const date = new Date(expense.id).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {});

  const renderExpenses = () => {
    return Object.keys(groupedExpenses).map((date) => {
      const expenses = groupedExpenses[date];
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      return (
        <div
          key={date}
          className="flex flex-col gap-1 h-[50vh] overflow-y-auto"
        >
          <div className="flex justify-between">
            <div className="text-lg font-bold ">
              {date === new Date().toDateString() ? "Today" : date}
            </div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
              ${total.toFixed(2)}
            </div>
          </div>
          <hr />
          <div className="flex flex-col gap-4">
            {expenses.map((expense) => (
              <ExpenseItem key={expense.id} expense={expense} />
            ))}
          </div>
          <hr />
        </div>
      );
    });
  };

  return <section className="">{renderExpenses()}</section>;
};

export default Expenses;
