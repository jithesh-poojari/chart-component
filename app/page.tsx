"use client";

import { Minimize2, CirclePlus } from "lucide-react";
import { useState } from "react";
import chart_data from "@/chart-data/stock_data.json";
import {
  Area,
  AreaChart,
  CartesianGrid,
  CartesianAxis,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function Home() {
  const data = {
    price: "63,179.71",
    currency: "USD",
    increased_price: "2,161.42",
    increased_price_percentage: "3.54",
  };

  const [selected, setSelected] = useState("Chart");
  const buttons = ["Summary", "Chart", "Statistics", "Analysis", "Settings"];
  const timeFrames = ["1d", "3d", "1w", "1m", "6m", "1y", "max"];
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1w");
  const [labelPoint, setLabelPoint] = useState();

  const getFilteredData = () => {
    const endDate = new Date();
    let startDate: Date;

    switch (selectedTimeFrame) {
      case "1d":
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 1);
        break;
      case "3d":
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 3);
        break;
      case "1w":
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "1m":
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "6m":
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case "1y":
        startDate = new Date(endDate);
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case "max":
      default:
        return chart_data;
    }

    return chart_data.filter(
      (entry) =>
        new Date(entry.date) >= startDate && new Date(entry.date) <= endDate
    );
  };

  const dataFormatter = (value: number | string): string => {
    if (typeof value === "number") {
      return `$${Intl.NumberFormat("us").format(value)}`;
    }
    // Handle cases where value is not a number (optional)
    return String(value); // or handle differently based on your needs
  };

  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const verticalPoints = [0, 100, 200, 300, 400, 500, 600, 700, 800];

  function CustomTooltip({ active, payload, label, ...args }) {
    setLabelPoint(args.viewBox.width);

    if (active) {
      return (
        <div className="bg-[#1A243A] p-2 text-[#FFFFFF] rounded-md text-lg">
          <h3>{dataFormatter(payload[0].value)}</h3>
        </div>
      );
    }
    return null;
  }

  const ticks = [
    { value: 10, coordinate: 50 },
    { value: 1000, coordinate: 100 },
    { value: 20, coordinate: 150 },
    { value: 40, coordinate: 200 },
    { value: 90, coordinate: 250 },
  ];

  return (
    <main className="flex flex-col items-center justify-between p-2 bg-black min-h-screen">
      <div className="bg-white flex flex-col text-black p-6 md:p-10 lg:p-14 lg:pb-4 rounded-2xl w-full max-w-4xl">
        <div className="flex flex-col items-start">
          <div className="flex items-start">
            <span className="font-semibold text-[#1A243A] text-3xl md:text-5xl">
              {data.price}
            </span>
            <span className="ml-2 text-[#BDBEBF] text-lg md:text-xl font-medium">
              {data.currency}
            </span>
          </div>
          <p className="text-[#67BF6B] text-sm md:text-base">
            <span className="mr-1">+{data.increased_price}</span>
            <span>{`(${data.increased_price_percentage})%`}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4 mt-5 md:mt-10 -ml-[10px] border-b">
          {buttons.map((button) => (
            <button
              key={button}
              className={`hover:text-[#1A243A] px-[10px] border-b-[3px] pb-3 transition-colors duration-300 ${
                selected === button
                  ? "text-[#1A243A] border-[#4B40EE]"
                  : "text-[#6F7177] border-[#FFFFFF]"
              }`}
              onClick={() => setSelected(button)}
            >
              {button}
            </button>
          ))}
        </div>
        <div className="text-[#6F7177] mt-5 md:mt-10 flex flex-wrap justify-between items-center gap-2 md:gap-5 min-h-[34px]">
          {selected === "Chart" && (
            <>
              <div className="flex gap-5">
                <button className="hover:text-[#1A243A] flex items-center transition-colors duration-300">
                  <Minimize2 className="h-6 w-6 mr-2" />
                  <span>Fullscreen</span>
                </button>
                <button className="hover:text-[#1A243A] flex items-center transition-colors duration-300">
                  <CirclePlus className="h-6 w-6 mr-2" />
                  <span>Compare</span>
                </button>
              </div>
              <div className="flex gap-2 md:gap-4 flex-wrap">
                {timeFrames.map((frame) => (
                  <button
                    key={frame}
                    className={`px-3 py-1 md:px-4 md:py-2 rounded-md transition-all duration-300 ${
                      selectedTimeFrame === frame
                        ? "bg-[#4B40EE] border-[#4B40EE] text-white"
                        : "text-[#6F7177] hover:bg-[#4B40EE] hover:text-white"
                    }`}
                    onClick={() => setSelectedTimeFrame(frame)}
                  >
                    {frame}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {selected === "Chart" ? (
          <ChartContainer config={chartConfig} className="mr-10">
            <AreaChart
              accessibilityLayer
              data={getFilteredData()}
              margin={{
                top: 20,
                left: -60,
              }}
              width={500}
            >
              <CartesianGrid
                horizontal={false}
                verticalPoints={verticalPoints}
                strokeWidth={2}
                stroke="#E2E4E7"
              />
              {/* <CartesianAxis x={150} y={0} /> */}
              {/* <CartesianAxis
                orientation="left"
                y={10}
                width={400}
                height={50}
                viewBox={{ x: 0, y: 0, width: 500, height: 500 }}
                ticks={ticks}
                // label="test"
              /> */}
              <XAxis
                dataKey="time"
                tickLine={false}
                tickMargin={8}
                tickFormatter={() => ""}
                stroke="#E2E4E7"
              />
              <YAxis
                dataKey="price"
                tickLine={false}
                axisLine={false}
                domain={["dataMin", "dataMax"]}
                tickFormatter={() => ""}
              />
              {/* <ChartTooltip
                // cursor={false}
                position={{ x: 740 }}
                cursor={{
                  stroke: "#999999",
                  fill: "#4B40EE",
                  strokeDasharray: "5 5",
                  strokeWidth: 2,
                }}
                content={
                  <ChartTooltipContent
                    hideLabel={true}
                    hideIndicator
                    formatter={dataFormatter}
                    
                  />
                }
              /> */}
              <Tooltip
                cursor={{
                  stroke: "#999999",
                  fill: "#999999",
                  strokeDasharray: "5 5",
                  strokeWidth: 2,
                  
                }}
                position={{ x: labelPoint }}
                content={<CustomTooltip />}
              />
              <defs>
                <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4B40EE" stopOpacity="0.4" />
                  <stop offset="75%" stopColor="#4B40EE" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <Area
                dataKey="price"
                type="linear"
                fill="url(#chart-area)"
                fillOpacity={0.4}
                stroke="#4B40EE"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="mt-4 h-72 flex items-center justify-center text-[#1A243A]">
            <div className="w-full h-full text-center pt-10 bg-gray-100 rounded-lg">
              <p className="text-2xl">Welcome to the {selected} section!</p>
              <p className="text-lg">
                Here we display awesome content related to <b>{selected}</b>.
                Stay tuned for more updates!
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
