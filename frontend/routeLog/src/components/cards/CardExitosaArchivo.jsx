import {
    Box,
    Typography,
    Divider
} from "@mui/material";

import CheckIcon from "@mui/icons-material/CheckCircle";

const colores = {
  verde: "#16a34a",
  fondo: "#ecfdf5",
  borde: "#bbf7d0",
  texto: "#166534",
  textoSec: "#15803d"
};

export default function CardExitosaArchivo({ resultado }) {
  if (!resultado) return null;

  return (
    <Box
      sx={{
        backgroundColor: colores.fondo,
        border: "1px solid",
        borderColor: colores.borde,
        borderRadius: 3,
        p: 3,
        overflow: "hidden"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2
        }}
      >
        <CheckIcon
          sx={{
            color: colores.verde,
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
            Importación finalizada
          </Typography>

          <Typography
            sx={{
                fontSize: 14,
                color: colores.textoSec
            }}
          >
            {resultado.mensaje}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          p: 3,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
          gap: 2
        }}
      >
        <Dato
          titulo="Envíos importados"
          valor={resultado.resumen.enviosImportados || 0}
        />

        <Dato
          titulo="Clientes creados"
          valor={resultado.resumen.clientesCreados || 0}
        />

        <Dato
          titulo="Direcciones creadas"
          valor={resultado.resumen.direccionesCreadas || 0 }
        />

        <Dato
          titulo="Tiempo"
          valor={`${Number(resultado.resumen.tiempoProcesamientoSegundos).toFixed(2)} segundos`}
        />
      </Box>

    </Box>
  );
}

function Dato({ titulo, valor }) {
  return (
    <Box
    sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        border: "1px solid #d1fae5",
        p: 2,
        textAlign: "center"
    }}
    >
      <Typography
        sx={{
          fontSize: 13,
          color: "text.secondary"
        }}
      >
        {titulo}
      </Typography>

      <Typography
        sx={{
          mt: 1,
          fontSize: 26,
          fontWeight: 700,
          color: "#166534"
        }}
      >
        {valor}
      </Typography>
    </Box>
  );
}


