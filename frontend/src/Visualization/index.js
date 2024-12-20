import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Tab } from "@mui/material";
import _ from "lodash";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useCondition } from "../hooks/useCondition";
import { getBarChart, getLineChart, searchItem } from "../middleware";
import Aggregate from "./Aggregate";
import PeriodAnalysis from "./PeriodAnalysis";
import StoreBeverage from "./StoreBeverage";
import YearAnalysis from "./YearAnalysis";

export default function LabTabs() {
  const [value, setValue] = useState("1");
  const { condition, setSystemState, setLoading } = useCondition();
  const [result, setResult] = useState({});
  const [THEME, setTheme] = useState([]);
  const ref = useRef();

  useEffect(() => {
    setResult({});
  }, [condition]);

  const checkValidCondition = () => {
    if (
      Object.keys(condition.time).length === 0 ||
      condition.location.length === 0 ||
      condition.beverage.length === 0
    )
      return false;
    const level = condition.location?.[0]?.level;
    return level ? condition.location.every((e) => e.level === level) : true;
  };

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  const handleSearchClick = async () => {
    try {
      setLoading(true);
      if (
        Object.keys(condition.time).length === 0 ||
        condition.location.length === 0 ||
        condition.beverage.length === 0
      ) {
        console.log("不符合");
        return;
      }
      let temp = {
        start_date: moment(condition.time.date.start.toISOString()).format(
          "YYYY-MM-DD"
        ),
        end_date: moment(condition.time.date.end.toISOString()).format(
          "YYYY-MM-DD"
        ),
        drink: condition.beverage.map((b) => b.name),
        ices: condition.ice,
        sweets: condition.sweet,
        toppings: condition.topping,
        tastes: condition.flavor,
        part: condition.part,
      };
      if (
        moment(condition.time.time.end.toISOString()).format("HH:mm") !==
        "23:59"
      ) {
        temp.start_hour = condition.time.time.start.$H;
        temp.end_hour = condition.time.time.end.$H;
      }
      temp = ["counties", "districts", "regions", "stores"].reduce(
        (acc, curr) => {
          acc[curr] = curr.includes(
            condition.location?.[0].level.substring(0, 5)
          )
            ? condition.location.map((l) => l.name.replace(/店$/, ""))
            : [];
          return acc;
        },
        temp
      );
      setSystemState({
        locationLevel: condition.location?.[0]?.level,
        part: condition.part,
      });
      setTheme(
        _.range(condition.beverage.length * condition.location.length).map(
          () =>
            "#" +
            (0x1000000 + Math.random() * 0xffffff).toString(16).substring(1, 7)
        )
      );
      setValue("1");
      const data = await searchItem(temp);
      setResult((prev) => ({ ...prev, StoreBeverage: data }));
      const aggregateData = await getBarChart({ period: 1 });
      setResult((prev) => ({ ...prev, aggregateData }));
      const line = await getLineChart({ year: 3 });
      setResult((prev) => ({ ...prev, LineChart: line }));
      const bar = await getBarChart({ period: 3 });
      setResult((prev) => ({ ...prev, BarChart: bar }));
      // ref.current.scrollIntoView({
      //   behavior: "smooth",
      //   block: "end",
      // });
      setLoading(false);
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    } catch (error) {
      throw error;
    }
  };

  const TABS = [
    { label: "總表", Component: <StoreBeverage data={result.StoreBeverage} /> },
    {
      label: "數據統計",
      Component: <Aggregate data={result.aggregateData} />,
    },
    {
      label: "過去若干年趨勢",
      Component: (
        <YearAnalysis
          data={result.LineChart}
          THEME={THEME}
          setTheme={setTheme}
        />
      ),
    },
    {
      label: "過去若干時段趨勢",
      Component: (
        <PeriodAnalysis
          data={result.BarChart}
          THEME={THEME}
          setTheme={setTheme}
        />
      ),
    },
  ];

  return (
    <Box sx={{ ml: 3, width: "90%", typography: "body1" }}>
      <Button
        variant="contained"
        onClick={handleSearchClick}
        sx={{ mb: 2 }}
        disabled={!checkValidCondition()}
      >
        送出
      </Button>
      {Object.keys(result).length > 0 && (
        <div ref={ref}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange}>
                {TABS.map((m, index) => (
                  <Tab key={index} label={m.label} value={`${index + 1}`} />
                ))}
              </TabList>
            </Box>
            {TABS.map((m, index) => (
              <TabPanel
                value={String(index + 1)}
                key={index}
                sx={{ position: "relative" }}
              >
                {m.Component}
              </TabPanel>
            ))}
          </TabContext>
        </div>
      )}
    </Box>
  );
}
