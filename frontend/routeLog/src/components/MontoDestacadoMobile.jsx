import { Box, Typography, Skeleton } from "@mui/material"

export default function MontoDestacadoMobile({ etiqueta, valor, loading }) {
    return (
        <Box sx={{
            background: "linear-gradient(135deg, #185fa5 0%, #2563eb 100%)",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(59,130,246,0.25)",
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            minHeight: 140,
        }}>
            <Typography sx={{ fontSize: 12, color: "#dbeafe", fontWeight: 600, letterSpacing: 0.5 }}>
                {etiqueta}
            </Typography>
            {loading ? (
                <Skeleton variant="text" width="60%" height={56} sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
            ) : (
                <Typography sx={{ fontSize: 36, fontWeight: 700, color: "#fff" }}>
                    $ {Number(valor).toLocaleString("es-AR")}
                </Typography>
            )}
        </Box>
    )
}