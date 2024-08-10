// components/MonthlyExpensesChart.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import ChartComponent from "./ChartComponent";
import { getMonthlyExpenses } from "./queries";

const MonthlyExpensesChart: React.FC = () => {
  const {
    data: monthlyExpenses,
    error,
    isPending,
  } = useQuery({
    queryKey: ["monthlyExpenses"],
    queryFn: getMonthlyExpenses,
  });

  if (isPending) return <p>Loading...</p>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  const chartData = {
    labels: monthlyExpenses.map((expense: any) => expense.month),
    datasets: [
      {
        label: "Monthly Expenses",
        data: monthlyExpenses.map((expense: any) => expense.totalAmount),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 rounded-lg shadow">
      <h2 className="mb-2 text-xl font-semibold">Monthly Expenses</h2>
      <ChartComponent
        type="bar"
        data={chartData}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  );
};

export default MonthlyExpensesChart;
