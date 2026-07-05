import {
    Box,
    Typography,
    IconButton,
    Chip,
} from "@mui/material"

import ChevronRightIcon from "@mui/icons-material/ChevronRight"

const colEstado = {
    1: { bg: "#fef9c3", color: "#854d0e" },
    2: { bg: "#dcfce7", color: "#166534" },
    3: { bg: "#fee2e2", color: "#991b1b" },
    4: { bg: "#dbeafe", color: "#1e40af" },
}

export default function TablaEnviosTransportista({ envios, onVerMas }) {
    return (
        <Box>
            {envios.map((envio) => {
                const estilo = colEstado[envio.id_estado] ?? { bg: "#f3f4f6", color: "#374151" }

                return (
                    <Box
                        key={envio.id_envio}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            borderBottom: "1px solid #f3f4f6",
                        }}
                    >
                        {/* Texto */}
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                                    {envio.fecha_envio}
                                </Typography>
                                <Chip
                                    label={envio.estado}
                                    size="small"
                                    sx={{
                                        background: estilo.bg,
                                        color: estilo.color,
                                        fontWeight: 600,
                                        fontSize: 11,
                                        borderRadius: 1,
                                    }}
                                />
                            </Box>
                            <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                                {envio.direccion}
                            </Typography>
                        </Box>

                        {/* Botón */}
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
                )
            })}
        </Box>
    )
}