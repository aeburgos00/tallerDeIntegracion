import * as React from 'react'

import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar 
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex} />

      <Box sx={{ flexGrow: 1 }}>
        <Navbar 
          selectedIndex={selectedIndex} />

        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}