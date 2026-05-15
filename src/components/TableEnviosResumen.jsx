import { 
  //  Paper, 
    TableContainer,
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody,
    Chip,
} from '@mui/material'

const data = [
    {
        idEnvio: "ENV-2021-0001",
        fechaEnvio: "15/05/2026",
        cliente: "Cliente A",
        direccion: "Calle 123, Localidad",
        transportista: "Transportista1",
        estado: "En tránsito",
        color: "#3b82f6",
        ultimaActualizacion: "16/05/2026 09:30"
    },
    {
        idEnvio: "ENV-2021-0002",
        fechaEnvio: "15/05/2026",
        cliente: "Cliente B",
        direccion: "Calle 123, Localidad",
        transportista: "Transportista1",
        estado: "Entregado",
        color: "#639922",
        ultimaActualizacion: "16/05/2026 10:30"
    },
    {
        idEnvio: "ENV-2021-0003",
        fechaEnvio: "15/05/2026",
        cliente: "Cliente C",
        direccion: "Calle 123, Localidad",
        transportista: "Transportista1",
        estado: "Visita fallida",
        color: "#ef4444",
        ultimaActualizacion: "16/05/2026 11:30"
    },
    {
        idEnvio: "ENV-2021-0004",
        fechaEnvio: "15/05/2026",
        cliente: "Cliente D",
        direccion: "Calle 123, Localidad",
        transportista: "Transportista1",
        estado: "Pendiente",
        color: "#f59e0b",
        ultimaActualizacion: "16/05/2026 12:30"
    },
]

export default function TableEnviosResumen() {
  return (
    <TableContainer 
    sx={{
        borderRadius: 3,
        width: "100%",
        overflowX: "auto",
    }}>
        <Table size="small" 
        sx={{
          minWidth: 900
        }}>
            <TableHead 
            sx={{
                backgroundColor:"#F0EEE8",
            }}>
                <TableRow>
                    <TableCell align="center">ID envío</TableCell>
                    <TableCell align="center">Fecha Envío</TableCell>
                    <TableCell align="center">Cliente</TableCell>
                    <TableCell align="center">Dirección</TableCell>
                    <TableCell align="center">Transportista</TableCell>
                    <TableCell align="center">Estado</TableCell>
                    <TableCell align="center">Última Actualización</TableCell>
            </TableRow>
          </TableHead>

          <TableBody 
          sx={{
            backgroundColor:"#fff"
            }}>
            {data.map((item) => (
                 <TableRow
                key={item.idEnvio}
                hover
                >
                    <TableCell sx={{whiteSpace: "nowrap"}} >{item.idEnvio}</TableCell>
                    <TableCell sx={{whiteSpace: "nowrap"}} >{item.fechaEnvio}</TableCell>
                    <TableCell>{item.cliente}</TableCell>
                    <TableCell sx={{
                            maxWidth: 220,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                                }} >{item.direccion}</TableCell>
                    <TableCell >{item.transportista}</TableCell>
                    <TableCell align="center">
                        <Chip size="small"
                            label={item.estado}
                            sx={{
                                color: item.color,
                                fontWeight: 500,
                                backgroundColor: `${item.color}15`,
                                borderRadius: 999,
                                minWidth: 110
                            }}
                        />
                    </TableCell>
                    <TableCell sx={{whiteSpace: "nowrap"}} >{item.ultimaActualizacion}</TableCell>
            </TableRow>
            ))}
            </TableBody>          
        </Table>
    </TableContainer>
  )
}