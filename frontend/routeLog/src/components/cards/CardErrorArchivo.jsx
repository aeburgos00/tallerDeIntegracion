import {
  Box,
  Typography,
  Divider
} from "@mui/material";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";


const colores = {
  rojo: "#dc2626",
  rojoClaro: "#fef2f2",
  borde: "#fecaca",
  texto: "#7f1d1d",
  fondo: "#fef2f2",
  blanco: "#fff",
  gris: "#374151"
};

export default function CardErrorArchivo({ errores = [] }) {

  if (!errores.length) return null;

  return (
    <Box
      sx={{
        backgroundColor: colores.rojoClaro,
        border: "1px solid",
        borderColor: colores.borde,
        borderRadius: 3,
        p: 3,
        overflow: "hidden"
      }}
    >
     {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
          backgroundColor: colores.fondo
        }}
      >
        <ErrorOutlineIcon
          sx={{
            color: colores.rojo,
            fontSize: 34
          }}
        />

        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 18,
              color: colores.texto
            }}
          >
            La importación no pudo realizarse
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: colores.texto
            }}
          >
            Se encontraron {errores.length} errores en el archivo.
            Corregilos y volvé a intentar.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Lista de errores */}
      <Box
        sx={{
          maxHeight: 320,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5
        }}
      >
        {errores.map((error, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              backgroundColor: colores.blanco,
              borderRadius: 2,
              border: "1px solid",
              borderColor: colores.borde,
              p: 1.5
            }}
          >
            <WarningAmberIcon
              sx={{
                color: colores.rojo,
                mt: "2px"
              }}
            />

            <Typography
              sx={{
                fontSize: 14,
                color: colores.gris
              }}
            >
              {error}
            </Typography>
          </Box>
        ))}
      </Box>

    </Box>
  );

}