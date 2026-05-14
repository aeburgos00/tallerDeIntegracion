import { 
  //  Paper, 
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
        fletero: "Fletero1",
        envios: 312,
        transito: 160,
        entregados: 142,
        pendientes: 10,
        cumplimiento: 95.2,
        color: "#639922"
    },
    {
        fletero: "Fletero2",
        envios: 100,
        transito: 20,
        entregados: 70,
        pendientes: 10,
        cumplimiento: 90,
        color: "#639922"
    },
    {
        fletero: "Fletero3",
        envios: 100,
        transito: 20,
        entregados: 70,
        pendientes: 10,
        cumplimiento: 72,
        color: "#EF9F27"
        
    },
    {
        fletero: "Fletero4",
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
        maxHeight: 180,
    }}>
        <Table size="small" >
            <TableHead 
            sx={{
                backgroundColor:"#F0EEE8",
            }}>
                <TableRow>
                    <TableCell align="center">Fletero</TableCell>
                    <TableCell align="center">Envíos</TableCell>
                    <TableCell align="center">En tránsito</TableCell>
                    <TableCell align="center">Entregados</TableCell><TableCell align="center">Pendientes</TableCell>
                    <TableCell align="center">% Cumplimiento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{backgroundColor:"#fff"}}>
            {data.map((item) => (
                 <TableRow
                key={item.fletero}
                hover
                >
                    <TableCell >{item.fletero}</TableCell>
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
                        gap: 1.5
                        }}
                        >
                        <LinearProgress
                        variant='determinate'
                        value={parseFloat(item.cumplimiento)}
                        bac
                        sx={{
                            height: 8,//8
                            borderRadius: 5,
                            flexGrow: 1,
                            backgroundColor: "#E0E0E0",

                            "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                            backgroundColor: item.color,
                            }
                        }}
                        />
                        <Typography
                        sx={{
                            minWidth: 45,
                            fontSize: 14,
                            fontWeight: 500
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