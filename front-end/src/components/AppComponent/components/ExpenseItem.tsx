import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ExpenseWithTagsType } from "@app/sharedType";

interface ExpenseItemProps {
  expense: ExpenseWithTagsType;
  onEdit: () => void;
  onDelete: () => void;
}

const ExpenseItem = ({ expense, onEdit, onDelete }: ExpenseItemProps) => {
  const timeDate = new Date(String(expense.createdAt));

  return (
    <div className="flex items-center justify-between ">
      <div className="flex items-center">
        <span className="text-4xl">{expense.tag?.tagEmoji}</span>
        <div className="ml-4">
          <div className="text-lg font-bold text-black dark:text-white">
            {expense.tag?.tagName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {format(timeDate, "HH:mm")} / {expense.date}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="font-bold text-destructive">
          -${Number(expense.amount).toFixed(2)}
        </div>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ExpenseItem;
