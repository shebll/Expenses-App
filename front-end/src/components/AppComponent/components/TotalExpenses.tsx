import { totalExpensesQueryOption } from "@/lib/api";

import { useQuery } from "@tanstack/react-query";

function TotalExpenses() {
  const { error, isPending, data } = useQuery(totalExpensesQueryOption);

  if (error) return "an error according " + error.message;
  return (
    <section className="flex flex-col items-center justify-center gap-6">
      <p className="text-7xl">💸</p>
      <div className="text-center ">
        <p className="text-destructive">Spent this month</p>
        {isPending ? (
          <span className="inline-block w-24 h-10 mt-2 rounded-md bg-secondary animate-pulse" />
        ) : (
          <span className="text-5xl font-bold text-primary">
            {data.totalExpenses || 0}$
          </span>
        )}
      </div>
    </section>
  );
}

export default TotalExpenses;
