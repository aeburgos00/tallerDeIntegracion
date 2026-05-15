import {
  Paper,
  Box,
  Typography
} from "@mui/material";

export default function SummaryCard({
  //CONTENIDO
  titulo,
  cantidad,
  descripcion,
  //VISUAL
  icono,
  color = "#27272a",
  //PERSONALIZACIÓN
  sx = {},
  iconContainerSx = {},
  iconSx = {},
  contentSx = {}
}) {

  const Icono = icono;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 4,
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: 2,
       width: "100%",
       minWidth: 0,
       ...sx
      }}
    >
      {/* ICONO */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 3,
          backgroundColor: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
           ...iconContainerSx
        }}
      >
        <Icono
          sx={{
            color: color,
            fontSize: 28,
            ...iconSx
          }}
        />
      </Box>

      {/* CONTENIDO */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent:"center",
        minWidth: 0,
        flexGrow: 1,
        ...contentSx
      }}>
        {/* TÍTULO */}
        <Typography
        sx={{
          fontSize: 14,
          color: "#6b7280",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        >
          {titulo}
        </Typography>

        {/* CANTIDAD */}
        <Typography
        sx={{
          fontSize: {
            xs: 24,
            md: 32
          },
          fontWeight: 700,
          lineHeight: 1.1,
          color: "#111827",
          whiteSpace: "nowrap"
        }}
        >
          {cantidad}
        </Typography>

        {/* DESCRIPCIÓN */}
         {descripcion && (

          <Typography
            sx={{
              fontSize: 13,
              color: "#6b7280",
              lineHeight: 1.2,
              mt: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {descripcion}
          </Typography>
          )}
          
      </Box>
    </Paper>
  );
}