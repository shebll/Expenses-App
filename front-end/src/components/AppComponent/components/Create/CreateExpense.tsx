import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TagsSelection from "../Tag/TagsSelection";
import { Expense } from "@/types/Expense";
import { useEffect } from "react";

const expenseSchema = z.object({
  amount: z
    .number()
    .positive()
    .min(0.1)
    .transform((val) => val.toString()),
  tagId: z
    .string()
    .min(1, "Please select a tag")
    .transform((val) => parseInt(val, 10)),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface CreateExpenseProps {
  expense?: Expense | null;
  onClose: () => void;
  openModel: boolean;
}

const CreateExpense = ({ expense, onClose, openModel }: CreateExpenseProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
  });

  useEffect(() => {
    if (expense) {
      reset({ amount: expense.amount, tagId: expense.tagId });
    } else {
      reset({ amount: "", tagId: 0 });
    }
  }, [expense, reset]);

  const selectedTagId = watch("tagId");

  const expenseMutation = useMutation({
    mutationFn: async (data: ExpenseFormValues) => {
      if (expense) {
        return await api.expenses[":id"].$patch({
          json: {
            tagId: data.tagId,
            amount: data.amount,
          },
          param: { id: String(expense.id) },
        });
      } else {
        return await api.expenses.$post({ json: data });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["total-expenses"] });
      reset();
      onClose();
    },
  });

  const onSubmit: SubmitHandler<ExpenseFormValues> = (data) => {
    expenseMutation.mutate(data);
  };
  return (
    <section
      className={`absolute ${
        openModel ? "bottom-0 " : "bottom-[-100%]"
      } transition-all duration-500 ease-in-out left-0 flex flex-col items-center justify-center w-full h-full gap-20 p-6 bg-transparent backdrop-blur-xl z-[1]`}
    >
      <form
        className={`flex flex-col items-center justify-center w-full gap-6 transition-all duration-700 ease-in-out relative left-0`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <h2 className="mb-4 text-2xl font-bold">
            {expense ? "Edit Expense" : "Create Expense"}
          </h2>
          <input
            {...register("amount", { valueAsNumber: true })}
            placeholder="0"
            type="number"
            min="0"
            step="0.01"
            className="text-5xl font-bold text-center bg-transparent border-b outline-none border-zinc-200 w-52"
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-sm text-center text-gray-400">Select The Tag</h1>
          <TagsSelection
            register={register}
            error={errors.tagId}
            value={selectedTagId}
          />
        </div>
        <div className="flex w-full gap-2">
          <Button
            className="w-[30%]"
            variant={"ghost"}
            onClick={() => onClose()}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="w-[70%]"
            variant={"default"}
            type="submit"
            disabled={expenseMutation.isPending}
          >
            {expenseMutation.isPending
              ? "Submitting..."
              : expense
                ? "Update"
                : "Create"}
          </Button>
        </div>
      </form>
    </section>
  );
};

{
  /* <form
className={`flex flex-col items-center justify-center w-full gap-6 transition-all duration-700 ease-in-out relative left-0`}
onSubmit={handleSubmit(onSubmit)}
>
<div className="flex flex-col gap-2">
        <h2 className="mb-4 text-2xl font-bold">
          {expense ? "Edit Expense" : "Create Expense"}
        </h2>
  <input
    {...register("amount", { valueAsNumber: true })}
    placeholder="0"
    type="number"
    min="0"
    step="0.01"
    className="text-5xl font-bold text-center bg-transparent border-b outline-none border-zinc-200 w-52"
  />
  {errors.amount && (
    <p className="text-sm text-red-500">{errors.amount.message}</p>
  )}
</div>
<div className="flex flex-col gap-2">
  <h1 className="text-sm text-center text-gray-400">Select The Tag</h1>
  <TagsSelection
    register={register}
    error={errors.tagId}
    value={selectedTagId}
  />
</div>
<div className="flex w-full gap-2">
  <Button
    className="w-[30%]"
    variant={"ghost"}
    onClick={() => setOpenModel()}
    type="button"
  >
    Cancel
  </Button>
  <Button
    className="w-[70%]"
    variant={"default"}
    type="submit"
    disabled={createExpenseMutation.isPending}
  >
    {createExpenseMutation.isPending ? "Submitting..." : "Confirm"}
  </Button>
</div>
</form> */
}
export default CreateExpense;
