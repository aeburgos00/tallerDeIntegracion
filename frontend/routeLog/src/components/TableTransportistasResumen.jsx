import { 
    TableContainer,
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody,
    Box,
    LinearProgress,
    Typography
} from '@mui/material'

const data = [
    {
        transportista: "Transportista1",
        envios: 312,
        transito: 160,
        entregados: 142,
        pendientes: 10,
        cumplimiento: 95.2,
        color: "#639922"
    },
    {
        transportista: "Transportista2",
        envios: 100,
        transito: 20,
        entregados: 70,
        pendientes: 10,
        cumplimiento: 90,
        color: "#639922"
    },
    {
        transportista: "Transportista3",
        envios: 100,
        transito: 20,
        entregados: 70,
        pendientes: 10,
        cumplimiento: 72,
        color: "#EF9F27"
        
    },
    {
        transportista: "Transportista4",
        envios: 100,
        transito: 20,
        entregados: 70,
        pendientes: 10,
        cumplimiento: 17,
        color: "#D23B3B"
    },
]

export default function TableTransportistasResumen() {
  return (
    <TableContainer 
    sx={{
        borderRadius: 3,
        width: "100%",
        overflowX: "auto",
    }}>
        <Table size="small"
         sx={{
          minWidth: 650
        }}>
            <TableHead 
            sx={{
                backgroundColor:"#F0EEE8",
            }}>
                <TableRow>
                    <TableCell align="center">Transportista</TableCell>
                    <TableCell align="center">Envíos</TableCell>
                    <TableCell align="center">En tránsito</TableCell>
                    <TableCell align="center">Entregados</TableCell>
                    <TableCell align="center">Pendientes</TableCell>
                    <TableCell align="center">% Cumplimiento</TableCell>
            </TableRow>
          </TableHead>

          <TableBody 
          sx={{
            backgroundColor:"#fff"
            }}>
            {data.map((item) => (
                 <TableRow
                key={item.transportista}
                hover
                >
                    <TableCell >{item.transportista}</TableCell>
                    <TableCell align="center">{item.envios}</TableCell>
                    <TableCell align="center">{item.transito}</TableCell>
                    <TableCell align="center">{item.entregados}</TableCell>
                    <TableCell align="center">{item.pendientes}</TableCell>
                    {/* CUMPLIMIENTO */}
                    <TableCell align="center">
                        <Box
                        sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        minWidth: 140,
                        }}
                        >
                        <LinearProgress
                        variant='determinate'
                        value={parseFloat(item.cumplimiento)}
                        bac
                        sx={{
                            flexGrow: 1,
                            height: 6,
                            borderRadius: 999,
                            backgroundColor: "#E5E7EB",

                            "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            backgroundColor: item.color,
                            }
                        }}
                        />
                        <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                        }}
                        >
                        {item.cumplimiento}%
                        </Typography>
                    </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </TableContainer>
  )
}