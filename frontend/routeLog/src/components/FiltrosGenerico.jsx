import {
    Box,
    Button,
} from "@mui/material";

import FiltroIcon from '@mui/icons-material/FilterAltRounded';

const colores = {
  primario: "#3b82f6",
  textos: "#111827",
  textosSec: "#9ca3af",
  background: "#E6F1FB",
}

export default function FiltrosGenerico({
    children,
    onFilter,
    onClear
}) {
  return (
    <Box 
    sx={{
        background:"#fff",
        borderRadius: 2,
        p:2,
        gap:2,
        display:"flex",
        alignItems:"center",
    }}>
        {/* Filtros */}
        <Box
        sx={{
            minWidth:0,
        }}>
            {children}
        </Box>

        {/* Botones */}
        <Box 
        sx={{
            display:"flex",
            gap:2,
            flexShrink:0,
            flexDirection:{
            xs:"column",
            sm:"column",
            lg:"row"
            },
        }}>
            <Button
            variant="outlined"
            onClick={onClear}
            sx={{
            borderColor:colores.textosSec,
            color:colores.primario,
            borderRadius:2,
            textTransform:"none",
            }}>
                Limpiar
            </Button>

            <Button 
            variant="contained"
            onClick={onFilter}
            startIcon={<FiltroIcon />}
            sx={{
            background:colores.primario,
            borderRadius:2,
            textTransform: "none"
            }}>
                Filtrar
            </Button>
        </Box>

    </Box>
  )
}