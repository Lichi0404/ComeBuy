import React from "react";
import { Box, Chip } from "@mui/material";
import styled from "styled-components";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { useCondition } from "../hooks/useCondition";
import moment from "moment";

const CustomToolBar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport
        csvOptions={{
          fileName: "各門市杯數及佔比",
          utf8WithBom: true,
        }}
      />
    </GridToolbarContainer>
  );
};

const ConstraintsContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.5vmin;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const levelMap = {
  region: "區域",
  county: "縣市",
  district: "地方區域",
  store: "門市",
};

const StoreBeverage = ({ data }) => {
  const { systemState } = useCondition();

  const DATA = {
    label: [
      "序號",
      `${levelMap[systemState?.locationLevel]}名稱`,
      "飲品",
      "總杯數",
      "飲品杯數",
      "杯數佔比",
      "總金額",
      "飲品金額",
      "金額佔比",
      "交易日期",
      "額外條件",
    ],
    data,
  };

  const TEST = DATA.data
    ? {
        column: DATA?.label
          .filter((l) => l !== "額外條件" || data?.[0]?.constraints)
          .map((m) => ({
            field: m,
            headerName: m,
            flex: m.includes("額外條件") ? 1.8 : 1,
            type: m.includes("日期") && "dateTime",
            renderCell: ({ value }) =>
              m === "額外條件" ? (
                <ConstraintsContainer>
                  {value.split(",").map((i, index) => (
                    <Chip
                      key={index}
                      label={i}
                      // color="primary"
                      // variant="outlined"
                    />
                  ))}
                </ConstraintsContainer>
              ) : m.includes("日期") ? (
                moment(value).format("YYYY-MM-DD")
              ) : value < 1 ? (
                `${(value * 100).toFixed(2)}%`
              ) : (
                value
              ),
            valueGetter: ({ value }) =>
              m.includes("日期")
                ? new Date(value)
                : m === "額外條件"
                ? value.join(",")
                : value,
          })),
        row: DATA?.data.map((m, index) => ({
          序號: index + 1,
          [`${levelMap[systemState?.locationLevel]}名稱`]: m.location,
          飲品: m.drink,
          總杯數: m.total_amount,
          飲品杯數: m.amount,
          杯數佔比: m.amount_proportion,
          總金額: m.total_price,
          飲品金額: m.price,
          金額佔比: m.price_proportion,
          交易日期: m.date,
          額外條件: m.constraints,
        })),
      }
    : "";

  return (
    <Box sx={{ width: "100%" }}>
      {TEST && (
        <DataGrid
          autoHeight
          rows={TEST.row}
          columns={TEST.column}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          slots={{ toolbar: CustomToolBar }}
          getRowId={(row) => row.序號}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
        />
      )}
    </Box>
  );
};

export default StoreBeverage;
