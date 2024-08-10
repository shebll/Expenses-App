import { useQuery } from "@tanstack/react-query";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  getHighestExpenseMonthly,
  getHighestExpenseWeekly,
  getMonthlyExpenses,
  getMostFrequentTagMonthly,
  getMostFrequentTagWeekly,
  getWeeklyDailyExpenses,
} from "./queries";

interface Expense {
  month?: string;
  week?: string;
  day?: string;
  totalAmount: string;
}

interface Tag {
  tagName: string;
  count: number;
}

interface HighestExpense {
  week?: string;
  month?: string;
  amount: string;
}
const Analytics = () => {
  const {
    data: monthlyExpenses,
    error: monthlyExpensesError,
    isPending: isMonthlyExpensesPending,
  } = useQuery({
    queryKey: ["monthlyExpenses"],
    queryFn: getMonthlyExpenses,
  });

  const {
    data: weeklyDailyExpenses,
    error: weeklyDailyExpensesError,
    isPending: isWeeklyDailyExpensesPending,
  } = useQuery({
    queryKey: ["weeklyDailyExpenses"],
    queryFn: getWeeklyDailyExpenses,
  });

  const {
    data: frequentTagWeekly,
    error: frequentTagWeeklyError,
    isPending: isFrequentTagWeeklyPending,
  } = useQuery({
    queryKey: ["frequentTagWeekly"],
    queryFn: getMostFrequentTagWeekly,
  });
  const {
    data: frequentTagMonthly,
    error: frequentTagMonthlyError,
    isPending: isFrequentTagMonthlyPending,
  } = useQuery({
    queryKey: ["frequentTagMonthly"],
    queryFn: getMostFrequentTagMonthly,
  });

  const {
    data: highestExpenseWeekly,
    error: highestExpenseWeeklyError,
    isPending: isHighestExpenseWeeklyPending,
  } = useQuery({
    queryKey: ["highestExpenseWeekly"],
    queryFn: getHighestExpenseWeekly,
  });

  const {
    data: highestExpenseMonthly,
    error: highestExpenseMonthlyError,
    isPending: isHighestExpenseMonthlyPending,
  } = useQuery({
    queryKey: ["highestExpenseMonthly"],
    queryFn: getHighestExpenseMonthly,
  });

  const renderLoading = () => <p>.....</p>;
  const renderError = (error: Error) => <div>Error: {error.message}</div>;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="p-4 rounded-lg shadow">
          <h2 className="mb-2 text-xl font-semibold">Monthly Expenses</h2>
          {isMonthlyExpensesPending ? (
            renderLoading()
          ) : monthlyExpensesError ? (
            renderError(monthlyExpensesError)
          ) : (
            <Bar
              data={{
                labels: (monthlyExpenses as Expense[]).map(
                  (expense) => expense.month
                ),
                datasets: [
                  {
                    label: "Monthly Expenses",
                    data: (monthlyExpenses as Expense[]).map(
                      (expense) => expense.totalAmount
                    ),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          )}
        </div>
        <div className="p-4 rounded-lg shadow">
          <h2 className="mb-2 text-xl font-semibold">
            Daily Expenses (Weekly)
          </h2>
          {isWeeklyDailyExpensesPending ? (
            renderLoading()
          ) : weeklyDailyExpensesError ? (
            renderError(weeklyDailyExpensesError)
          ) : (
            <Line
              data={{
                labels: (weeklyDailyExpenses as Expense[]).map(
                  (expense) => `${expense.week}-${expense.day}`
                ),
                datasets: [
                  {
                    label: "Daily Expenses",
                    data: (weeklyDailyExpenses as Expense[]).map(
                      (expense) => expense.totalAmount
                    ),
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          )}
        </div>
        <div className="p-4 rounded-lg shadow">
          <h2 className="mb-2 text-xl font-semibold">
            Most Frequent Tag (Weekly)
          </h2>
          {isFrequentTagWeeklyPending ? (
            renderLoading()
          ) : frequentTagWeeklyError ? (
            renderError(frequentTagWeeklyError)
          ) : (
            <Pie
              data={{
                labels: (frequentTagWeekly as Tag[]).map((tag) => tag.tagName),
                datasets: [
                  {
                    label: "Most Frequent Tag",
                    data: (frequentTagWeekly as Tag[]).map((tag) => tag.count),
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(255, 206, 86, 0.2)",
                      "rgba(75, 192, 192, 0.2)",
                      "rgba(153, 102, 255, 0.2)",
                      "rgba(255, 159, 64, 0.2)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          )}
        </div>
        <div className="p-4 rounded-lg shadow">
          <h2 className="mb-2 text-xl font-semibold">
            Most Frequent Tag (Monthly)
          </h2>
          {isFrequentTagMonthlyPending ? (
            renderLoading()
          ) : frequentTagMonthlyError ? (
            renderError(frequentTagMonthlyError)
          ) : (
            <Pie
              data={{
                labels: (frequentTagMonthly as Tag[]).map((tag) => tag.tagName),
                datasets: [
                  {
                    label: "Most Frequent Tag",
                    data: (frequentTagMonthly as Tag[]).map((tag) => tag.count),
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(255, 206, 86, 0.2)",
                      "rgba(75, 192, 192, 0.2)",
                      "rgba(153, 102, 255, 0.2)",
                      "rgba(255, 159, 64, 0.2)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          )}
        </div>
        <div className="p-4 rounded-lg shadow">
          <h2 className="mb-2 text-xl font-semibold">
            Highest Expense (Weekly)
          </h2>
          {isHighestExpenseWeeklyPending ? (
            renderLoading()
          ) : highestExpenseWeeklyError ? (
            renderError(highestExpenseWeeklyError)
          ) : (
            <Bar
              data={{
                labels: (highestExpenseWeekly as HighestExpense[]).map(
                  (expense) => expense.week
                ),
                datasets: [
                  {
                    label: "Highest Expense",
                    data: (highestExpenseWeekly as HighestExpense[]).map(
                      (expense) => expense.amount
                    ),
                    backgroundColor: "rgba(255, 159, 64, 0.2)",
                    borderColor: "rgba(255, 159, 64, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          )}
        </div>
        <div className="p-4 rounded-lg shadow">
          <h2 className="mb-2 text-xl font-semibold">
            Highest Expense (Monthly)
          </h2>
          {isHighestExpenseMonthlyPending ? (
            renderLoading()
          ) : highestExpenseMonthlyError ? (
            renderError(highestExpenseMonthlyError)
          ) : (
            <Bar
              data={{
                labels: (highestExpenseMonthly as HighestExpense[]).map(
                  (expense) => expense.month
                ),
                datasets: [
                  {
                    label: "Highest Expense",
                    data: (highestExpenseMonthly as HighestExpense[]).map(
                      (expense) => expense.amount
                    ),
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
