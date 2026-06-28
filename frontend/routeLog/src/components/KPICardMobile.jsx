import { Box, Typography } from "@mui/material"

export default function KPICardMobile({ titulo, cantidad, icono: Icono, color, esUltimo }) {
    return (
        <Box sx={{
            background: "#fff",
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            gridColumn: esUltimo ? "1 / -1" : "auto",
        }}>
            <Box sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: color + "20",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Icono sx={{ fontSize: 20, color }} />
            </Box>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1 }}>
                {cantidad}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
                {titulo}
            </Typography>
        </Box>
    )
}