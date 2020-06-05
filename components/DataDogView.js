import React from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "./Title";

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData("00:00", 0),
  createData("03:00", 300),
  createData("06:00", 600),
  createData("09:00", 800),
  createData("12:00", 1500),
  createData("15:00", 2000),
  createData("18:00", 2400),
  createData("21:00", 2400),
  createData("24:00", undefined),
];

export default function DataDogView() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <iframe
        src="https://toshiba.datadoghq.com/graph/embed?token=943fe1608221ba8d067d8881ce48add08063a470ea7e3592cb788302e3f07056&height=300&width=600&legend=true"
        width="600" height="300" frameBorder="0">

      </iframe>
    </React.Fragment>
  );
}
