import React from "react";

import { Box } from "@mui/material";

import "../styles/neumorphism.css";

const Toggle = (props) => {
  const { onClick, value } = props;
  return (
    <Box className={`toggle ${value ? "active" : ""}`} onClick={onClick}>
      <input type="checkbox" className="toggle-state active" name="check" value="check" />
      <Box className={`indicator ${value ? "active" : ""}`} />
    </Box>
  );
};

export default Toggle;
