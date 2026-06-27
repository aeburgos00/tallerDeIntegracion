import {
    Box,
    Typography,
    IconButton,
} from "@mui/material"

import ChevronRightIcon from "@mui/icons-material/ChevronRight"

export default function TablaEnviosTransportista({ envios, onVerMas }) {
    return (
        <Box>
            {envios.map((envio) => (
                <Box
                    key={envio.id_envio}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        borderBottom: "1px solid #f3f4f6",
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                            {envio.fecha_envio}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                            {envio.direccion}
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={() => onVerMas(envio)}
                        sx={{
                            background: "#3b82f6",
                            color: "#fff",
                            borderRadius: 2,
                            width: 40,
                            height: 40,
                            flexShrink: 0,
                            "&:hover": { background: "#2563eb" },
                        }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            ))}
        </Box>
    )
}