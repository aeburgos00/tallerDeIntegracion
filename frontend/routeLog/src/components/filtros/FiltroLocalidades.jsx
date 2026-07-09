import {
    Box,
    TextField,
    MenuItem,
} from "@mui/material"

export default function FiltroLocalidades({
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
                    lg: "220px 140px 140px 220px"
                },
                gap: 2,
                alignItems: "center",
            }}>
            <TextField
                fullWidth
                label="Provincia"
                value={filtros.provincia}
                onChange={handleChange("provincia")}
                size="small"
            />

            <TextField
                fullWidth
                label="Localidad"
                value={filtros.localidad}
                onChange={handleChange("localidad")}
                size="small"
            />

            <TextField
                fullWidth
                label="Código Postal"
                value={filtros.codigoPostal}
                onChange={handleChange("codigoPostal")}
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