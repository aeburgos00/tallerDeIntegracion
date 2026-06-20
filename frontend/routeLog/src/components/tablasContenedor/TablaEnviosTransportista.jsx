import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
} from "@mui/material"

const colEstado = {
    1: { bg: "#fef9c3", color: "#854d0e" }, // Pendiente
    2: { bg: "#dcfce7", color: "#166534" }, // Entregado
    3: { bg: "#fee2e2", color: "#991b1b" }, // Visita fallida
    4: { bg: "#dbeafe", color: "#1e40af" }, // No visitado
}

const headerSx = {
    fontWeight: 600,
    fontSize: 13,
    color: "#6b7280",
    borderBottom: "1px solid #e5e7eb",
}

const cellSx = {
    fontSize: 13,
    color: "#374151",
    borderBottom: "1px solid #f3f4f6",
}

export default function TablaEnviosTransportista({ envios }) {
    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell sx={headerSx}>#</TableCell>
                    <TableCell sx={headerSx}>Cliente</TableCell>
                    <TableCell sx={headerSx}>Dirección</TableCell>
                    <TableCell sx={headerSx}>Localidad</TableCell>
                    <TableCell sx={headerSx}>Fecha Envío</TableCell>
                    <TableCell sx={headerSx}>Estado</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {envios.map((envio) => {
                    const estilo = colEstado[envio.id_estado] ?? { bg: "#f3f4f6", color: "#374151" }
                    return (
                        <TableRow key={envio.id} hover>
                            <TableCell sx={cellSx}>{envio.fecha_envio}</TableCell>
                            <TableCell sx={cellSx}>
                                <Chip label={envio.estado} size="small" sx={{ background: estilo.bg, color: estilo.color, fontWeight: 600, fontSize: 11, borderRadius: 1 }} />
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}