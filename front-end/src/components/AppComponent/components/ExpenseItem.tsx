const ExpenseItem = ({ expense }: any) => {
  const date = new Date(expense.id);
  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <div className="flex items-center justify-between ">
      <div className="flex items-center">
        <span className="text-2xl">{expense.tag.emoji}</span>
        <div className="ml-4">
          <div className="text-lg font-bold text-black dark:text-white">
            {expense.tag.tagName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {date.toLocaleTimeString()}
          </div>
        </div>
      </div>
      <div className="text-lg font-bold text-red-500 dark:text-red-400">
        - {expense.amount}$
      </div>
    </div>
  );
};

export default ExpenseItem;
