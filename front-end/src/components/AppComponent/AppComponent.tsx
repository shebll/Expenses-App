import Expenses from "./components/Expenses";
import TotalExpenses from "./components/TotalExpenses";

const AppComponent = () => {
  return (
    <section>
      <TotalExpenses />
      <Expenses />
    </section>
  );
};

export default AppComponent;
