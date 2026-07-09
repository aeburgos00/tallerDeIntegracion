import {
    Box,
    TextField,
    MenuItem,
} from "@mui/material"

export default function FiltroTransportistas({
    filtros,
   setFiltros
}) {

    const handleChange = (campo) => (e) => {
        setFiltros({
            ...filtros,
            [campo]: e.target.value
        });
    };

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    lg: "220px 140px 220px 140px 140px"
                },
                gap: 2,
                alignItems: "center",
            }}>

            <TextField
                fullWidth
                label="Nombre Completo"
                value={filtros.nombre}
                onChange={handleChange("nombre")}
                size="small"
            />

            <TextField
                fullWidth
                label="DNI"
                value={filtros.dni}
                onChange={handleChange("dni")}
                size="small"
            />

            <TextField
                fullWidth
                label="Usuario"
                value={filtros.usuario}
                onChange={handleChange("usuario")}
                size="small"
            />

            <TextField
                fullWidth
                label="Costo Envío"
                value={filtros.costo_envio}
                onChange={handleChange("costo_envio")}
                size="small"
            />

            <TextField
                fullWidth
                select
                label="Estado"
                value={filtros.estado}
                onChange={handleChange("estado")}
                size="small"
            >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="ACTIVO">Activo</MenuItem>
                <MenuItem value="INACTIVO">Inactivo</MenuItem>
            </TextField>

        </Box>
    )
}