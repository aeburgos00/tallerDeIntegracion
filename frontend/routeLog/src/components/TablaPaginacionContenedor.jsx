import {
    Box,
    Typography,
    Select,
    MenuItem,
    Pagination
} from "@mui/material"

export default function TablaPaginacionContenedor ({
  children,
  pagina,
  filasPorPagina,
  totalPaginas,
  onPaginaChange,
  onFilasPorPaginaChange
}) {


  return (
     <Box
      sx={{
        backgroundColor:"#fff",
        borderRadius:2,
        overflow:"hidden"
      }}
    >
        {/* Tabla */}
        <Box>
            {children}
        </Box>

        {/* Footer */}
        <Box
            sx={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            p:2,
            borderTop:"1px solid #e5e7eb"
            }}
        >
            <Box
            sx={{
                display:"flex",
                alignItems:"center",
                gap:1
            }}
            >
            <Typography>
                Filas por página
            </Typography>

            <Select
                size="small"
                value={filasPorPagina}
                onChange={(e) => onFilasPorPaginaChange(e.target.value)}
            >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
            </Select>
            </Box>

            <Pagination
            page={pagina}
            count={totalPaginas}
            onChange={(e, value) => onPaginaChange(value)}
            color="primary"
            />
        </Box>

    </Box>
  )
}