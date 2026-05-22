import {
    Box,
    Typography,
    Link
} from "@mui/material";

import { Link as RouterLink } from 'react-router-dom'

function TableResumenCard( {
    //CONTENIDO
    titulo = "",
    footer,
    url,
    children, //serian las tablas resumen
    //PERSONALIZACION
    sx = {},
  // OPCIONAL
    minHeight
}) {

  return (
    <Box 
    sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight,
        ...sx
    }}>
        {/* TITULO */}
        <Typography
            sx={{
            fontSize: 20,
            fontWeight: 600,
            mb: 2
            }}
        >
            {titulo}
        </Typography>
        
        {/* TABLA */}
         <Box
        sx={{
          flexGrow: 1,
          minWidth: 0
        }}
        >
            {children  || ""}
        </Box>

        {/* FOOTER */}
        <Link 
        component={RouterLink}
        to={url || "#"}
        //href="#" 
        underline="hover" 
        sx={{ 
            mt: 2,
            display: "block", 
            fontFamily: "Roboto", 
            fontSize: 14, 
            color: "#1976d2",
            flexShrink: 0, 
        }}>
            {footer || "Ver todos"} →
        </Link>

    </Box>
)   
}

export default TableResumenCard