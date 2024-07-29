import Expenses from "./components/Expenses";
import TotalExpenses from "./components/TotalExpenses";
import CreateExpense from "./components/CreateExpense";

const AppComponent = () => {
  return (
    <section>
      <TotalExpenses />
      <Expenses /> <CreateExpense />
    </section>
  );
};

export default AppComponent;
