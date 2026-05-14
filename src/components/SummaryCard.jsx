import {
  Paper,
  Box,
  Typography
} from "@mui/material";

export default function SummaryCard({
  titulo,
  cantidad,
  descripcion,
  icono,
  color
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
       // width: "calc(25% - 16px)",
        width: 384,
        height: 112,
      }}
    >
      {/* ICONO */}
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 3,
          backgroundColor: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}
      >
        <Icono
          sx={{
            color: color,
            fontSize: 32
          }}
        />
      </Box>

      {/* TEXTO */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        height: 64
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
                fontSize: 42,
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