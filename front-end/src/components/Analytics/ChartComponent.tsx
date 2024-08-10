// components/ChartComponent.tsx
import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";

interface ChartComponentProps {
  type: "bar" | "line" | "pie";
  data: any;
  options: any;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  type,
  data,
  options,
}) => {
  const ChartType = type === "bar" ? Bar : type === "line" ? Line : Pie;
  return <ChartType data={data} options={options} />;
};

export default ChartComponent;
