const AppComponent = () => {
  return (
    <header className="flex flex-col justify-center items-center gap-10">
      <p className="text-7xl">💸</p>
      <div className=" text-center">
        <p className="text-destructive">Spent this month</p>
        <span className="text-primary- text-5xl font-bold">200.211 $</span>
      </div>
    </header>
  );
};

export default AppComponent;
