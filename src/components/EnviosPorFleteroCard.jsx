import {
    Box,
    Typography,
    Link
} from "@mui/material";

import TableTransportistasResumen from "./TableTransportistasResumen";


function EnviosPorFleteroCard( 
    {width=1112, 
    height=292}
) {
  return (
    <Box 
    sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 3,
        p: 2,
        width: width,
        height: height,
    }}>
        <Typography
            sx={{
            fontSize: 20,
            fontWeight: 600,
            mb: 2
            }}
        >
            Envíos por Fletero
        </Typography>
        <TableTransportistasResumen />
        <Link 
        href="#" 
        underline="hover" 
        sx={{ 
            mt: 2,
            display: "block", 
            fontFamily: "Roboto", 
            fontSize: "14px", 
            color: "#1976d2" 
        }}>
            Ver todos los fleteros →
        </Link>

    </Box>
)   
}

export default EnviosPorFleteroCard