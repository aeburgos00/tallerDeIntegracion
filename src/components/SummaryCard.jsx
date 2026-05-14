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

  //TAMAÑOS
  //width: 360,
  width = "100%",
  height = 112,

  // CUSTOM STYLES
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
        gap: 3,
       width,
       height,
       ...sx
      }}
    >
      {/* ICONO */}
      <Box
        sx={{
          width: height/2,
          height: height/2,
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
            fontSize: height/4,
            ...iconSx
          }}
        />
      </Box>

      {/* CONTENIDO */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent:"center",
        ...contentSx
      }}>
        <Box>
            <Typography
            sx={{
                fontSize: 16,
                color: "#6b7280",
                lineHeight: 1.2
            }}
            >
            {titulo}
            </Typography>

            <Typography
            sx={{
                fontSize: 32,
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#111827"
            }}
            >
            {cantidad}
            </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 14,
            color: "#6b7280",
            lineHeight: 1.2
          }}
        >
          {descripcion}
        </Typography>

      </Box>
    </Paper>
  );
}