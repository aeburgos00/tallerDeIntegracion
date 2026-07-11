import {
  BottomNavigation,
  BottomNavigationAction
} from "@mui/material";

import React from "react";

import { Link } from "react-router-dom";

import { menuTransportista } from "./datos/data"

const NavbarMobile = () => {
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      sx={{
        height: 64,
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: "#fff",
        borderTop: "1px solid #e0e0e0",
      }}
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
    >
      {menuTransportista.map((e) => {
        const Icono = e.icono;
        return (
          <BottomNavigationAction
            key={e.id}
            label={e.descripcion}
            icon={<Icono />}
            component={Link}
            to={e.ruta}
          />
        );
      })
      }
    </BottomNavigation>
  );
};


export default NavbarMobile