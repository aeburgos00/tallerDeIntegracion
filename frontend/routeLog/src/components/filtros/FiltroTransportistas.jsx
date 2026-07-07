import {
  Box,
  TextField,
  MenuItem,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { obtenerTransportistas } from "../../services/api";

import "dayjs/locale/es";

export default function FiltroTransportistas({
  filtros,
  setFiltros
}) {
  const [estados, setEstados] = useState([]);
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuesta = await obtenerTransportistas();
        const transportistas = respuesta.data;

        const estadosUnicos = [
          ...new Set(
            transportistas
              .map((t) => t.estado)
              .filter(Boolean)
          ),
        ];

        setEstados(estadosUnicos);
      } catch (error) {
        console.error(error);
      }
    };

    obtenerDatos();
  }, []);

  const handleChange = (campo) => (e) => {
    setFiltros({
      ...filtros,
      [campo]: e.target.value
    });
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "170px 1fr 180px 170px 160px"
        },
        gap: 2,
        alignItems: "center"
      }}
    >

      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="es"
      >
        <DatePicker
          label="Fecha Alta"
          value={filtros.fechaAlta}
          onChange={(newValue) =>
            setFiltros({
              ...filtros,
              fechaAlta: newValue
            })
          }
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              size: "small"
            }
          }}
        />
      </LocalizationProvider>

      <TextField
        fullWidth
        label="Nombre"
        value={filtros.nombre}
        onChange={handleChange("nombre")}
        size="small"
      />

      <TextField
        fullWidth
        label="Usuario"
        value={filtros.usuario}
        onChange={handleChange("usuario")}
        size="small"
      />

      <TextField
        fullWidth
        label="DNI"
        value={filtros.dni}
        onChange={handleChange("dni")}
        size="small"
      />

      <TextField
        fullWidth
        select
        label="Estado"
        value={filtros.estado}
        onChange={handleChange("estado")}
        size="small"
      >
        <MenuItem value="">
          Todos
        </MenuItem>

        {estados.map((estado) => (
          <MenuItem key={estado} value={estado}>
            {estado}
          </MenuItem>
        ))}

      </TextField>

    </Box>
  );
}