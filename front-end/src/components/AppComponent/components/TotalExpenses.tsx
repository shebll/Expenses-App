import { api } from "@/lib/api";

import { useQuery } from "@tanstack/react-query";

const getTotal = async () => {
  const res = await api.expenses["total-expenses"].$get();
  if (!res.ok) throw new Error("Server Error");
  const data = await res.json();

  return data;
};
function TotalExpenses() {
  const { error, isPending, data } = useQuery({
    queryKey: ["total-expenses"],
    queryFn: getTotal,
  });

  if (error) return "an error accordaing " + error.message;
  return (
    <section className="flex flex-col items-center justify-center gap-6">
      <p className="text-7xl">💸</p>
      <div className="text-center ">
        <p className="text-destructive">Spent this month</p>
        {isPending ? (
          <span className="inline-block w-24 h-10 rounded-md bg-secondary animate-pulse" />
        ) : (
          <span className="text-5xl font-bold text-primary-">
            {data.totalExpenses}$
          </span>
        )}
      </div>
    </section>
  );
}

export default TotalExpenses;
