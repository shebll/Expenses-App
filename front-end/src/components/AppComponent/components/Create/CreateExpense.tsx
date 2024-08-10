import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TagsSelection from "../Tag/TagsSelection";
import { useEffect, useState } from "react";
import { CreateExpenseSchema, ExpenseType } from "@app/sharedType";
import { Calendar } from "@/components/ui/calendar";

export type ExpenseFormValues = z.infer<typeof CreateExpenseSchema>;

interface CreateExpenseProps {
  expense?: ExpenseType | null;
  onClose: () => void;
  openModel: boolean;
}

const CreateExpense = ({ expense, onClose, openModel }: CreateExpenseProps) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(CreateExpenseSchema),
  });

  useEffect(() => {
    if (expense) {
      reset({
        amount: expense.amount,
        tagId: expense.tagId,
        date: expense.date,
      });
    } else {
      reset({ amount: "", tagId: 0, date: new Date().toISOString() });
    }
  }, [expense, reset]);

  const selectedTagId = watch("tagId");
  const date = watch("date");

  console.log(date);

  const expenseMutation = useMutation({
    mutationFn: async (data: ExpenseFormValues) => {
      if (expense) {
        return await api.expenses[":id"].$patch({
          json: {
            tagId: data.tagId,
          },
          param: { id: String(expense.id) },
        });
      } else {
        return await api.expenses.$post({ json: data });
      }
    },
    onSuccess: (data) => {
      if (data.ok) {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        queryClient.invalidateQueries({ queryKey: ["total-expenses"] });
        reset();
        onClose();
      }
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
            {...register("amount", { valueAsNumber: false })}
            placeholder="0"
            type="number"
            step="0.001"
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
        <div className="flex flex-col gap-2">
          <p
            className="text-sm text-center text-gray-400"
            onClick={() => setShowCalendar(true)}
          >
            Select specific date !
          </p>
          {showCalendar && (
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Calendar
                  mode="single"
                  selected={new Date(field.value!)}
                  onSelect={(selectedDate) => {
                    field.onChange((selectedDate ?? new Date()).toISOString());
                  }}
                  className="border rounded-md"
                />
              )}
            />
          )}
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
