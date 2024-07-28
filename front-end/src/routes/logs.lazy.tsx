import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/logs")({
  component: About,
});

const getTotal = async () => {
  const res = await api.expenses["total-expenses"].$get();
  if (!res.ok) throw new Error("Server Error");
  const data = await res.json();

  return data;
};
function About() {
  const { error, isPending, data } = useQuery({
    queryKey: ["total-expenses"],
    queryFn: getTotal,
  });

  if (error) return "an error accordaing " + error.message;
  return (
    <section className="flex flex-col items-center justify-center gap-10">
      <p className="text-7xl">💸</p>
      <div className="text-center ">
        <p className="text-destructive">Spent this month</p>
        <span className="text-5xl font-bold text-primary-">
          {isPending ? "....." : data.totalExpenses} $
        </span>
      </div>
    </section>
  );
}
