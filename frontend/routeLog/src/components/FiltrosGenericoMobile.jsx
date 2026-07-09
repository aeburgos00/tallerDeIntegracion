import {
    Box,
    Button,
} from "@mui/material";

import FiltroIcon from '@mui/icons-material/FilterAltRounded';

const colores = {
    azul: "#3b82f6",
    gris: "#9ca3af",
}

export default function FiltrosGenerico({
    children,
    onFilter,
    onClear
}) {
    return (
        <Box
            sx={{
                background: "#fff",
                borderRadius: 2,
                p: 2,
                gap: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch"
            }}>
            {/* Filtros */}
            <Box
                sx={{
                    minWidth: 0,
                }}>
                {children}
            </Box>

            {/* Botones */}
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    justifyContent: "center"
                }}>
                <Button
                    variant="outlined"
                    onClick={onClear}
                    sx={{
                        borderColor: colores.gris,
                        color: colores.azul,
                        borderRadius: 2,
                        textTransform: "none",
                    }}>
                    Limpiar
                </Button>

                <Button
                    variant="contained"
                    onClick={onFilter}
                    startIcon={<FiltroIcon />}
                    sx={{
                        background: colores.azul,
                        borderRadius: 2,
                        textTransform: "none"
                    }}>
                    Filtrar
                </Button>
            </Box>

        </Box>
    )
}