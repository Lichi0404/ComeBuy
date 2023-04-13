import React, { useState } from "react";
import {
  ListSubheader,
  List,
  ListItemButton,
  ListItem,
  ListItemText,
  Collapse,
  Button,
} from "@mui/material";
import { useCondition } from "../hooks/useCondition";
import Location from "./Location";
import Time from "./Time";
import Beverage from "./Beverage";
import Ice from "./Ice";
import Sweet from "./Sweet";

const SieveType = () => {
  const [sieveType, setSieveType] = useState({
    時間: { focused: false, child: <Time />, image: "time" },
    地區: {
      focused: false,
      child: <Location />,
      image: "location",
    },
    購買方式: { focused: false },
    品項: { focused: false, child: <Beverage />, image: "drink" },
    // 口味: { focused: false },
    甜度: { focused: false, child: <Sweet /> },
    冰塊: { focused: false, child: <Ice /> },
    加料: { focused: false },
  });
  const { condition } = useCondition();

  // useEffect(() => {
  //   setSieveType((prev) => ({
  //     ...prev,
  //     品項: {
  //       ...prev.品項,
  //       child: (
  //         <Beverage
  //           open={prev.品項.focused}
  //           handleModalClose={handleBeverageClose()}
  //         />
  //       ),
  //     },
  //   }));
  // }, [sieveType.品項.focused]);

  const handleSieveClick = (name) => () => {
    setSieveType((prev) => ({
      ...prev,
      [name]: { ...prev[name], focused: !prev[name].focused },
    }));
  };

  // const handleBeverageClose =
  //   (name = "品項") =>
  //   () => {
  //     setSieveType((prev) => ({
  //       ...prev,
  //       [name]: { ...prev[name], focused: !prev[name].focused },
  //     }));
  //   };

  return (
    <>
      <List
        sx={{
          ml: 1,
          mt: 1,
          width: "90%",
          // maxWidth: 360,
          bgcolor: "background.paper",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            篩選條件
          </ListSubheader>
        }
      >
        {Object.keys(sieveType).map((s, index) => (
          <div key={index}>
            <ListItemButton
              key={index}
              onClick={handleSieveClick(s)}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {sieveType[s].image && (
                <img
                  src={require(`./assets/${sieveType[s].image}.${
                    sieveType[s].focused ? "gif" : "png"
                  }`)}
                  alt=""
                  width={sieveType[s].focused ? 32 : 28}
                />
              )}
              <ListItemText sx={{ ml: 1 }}>{s}</ListItemText>
            </ListItemButton>
            <Collapse
              in={Boolean(sieveType[s].focused && sieveType[s].child)}
              unmountOnExit
              sx={{ width: "100%" }}
            >
              <List component="div" disablePadding>
                <ListItem>{sieveType[s].child}</ListItem>
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    </>
  );
};

export default SieveType;
