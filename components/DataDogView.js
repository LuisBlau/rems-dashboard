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
