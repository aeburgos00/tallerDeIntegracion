import {
    Box,
    TextField,
    MenuItem,
    InputAdornment,
} from "@mui/material"
 
import { useEffect, useState } from 'react'
import { 
    obtenerTransportistas
} from "../../services/api";
 
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/es";
 
export default function FiltroLiquidaciones({
    filtros,
    setFiltros
}) {
 
    const [transportistas, setTransportistas] = useState([])
 
    useEffect(()=>{
        const cargarTransportistas = async() =>{
            try{
                const transportistasResp = await obtenerTransportistas()
                setTransportistas(transportistasResp.data)
            } catch(error){
                console.error(error)
            }
        }
        cargarTransportistas()
    },[])
 
 
 
    const handleChange = (campo) => (e) => {
        setFiltros({
        ...filtros,
        [campo]: e.target.value
        });
    };
 
    return (
    <Box
    sx={{
        display:"grid",
        gridTemplateColumns:{
            xs: "1fr",
            sm:"1fr 1fr",
            lg:"180px 180px 130px 150px 150px"
        },
        gap:2,
        alignItems:"center",
    }}>
 
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
            label="Fecha Alta"
            value={filtros.fecha_alta}
            onChange={(newValue) =>
            setFiltros({
                ...filtros,
                fecha_alta: newValue
            })}
            format="DD/MM/YYYY"
            slotProps={{
                textField: {
                size: "small"
                }
            }}
            sx={{
                width: {
                xs: 100,
                sm: 140,
                md: 180
                }
            }}
            />
         </LocalizationProvider>

 
        <TextField
            fullWidth
            select
            label="Transportista"
            value={filtros.transportista}
            onChange={handleChange("transportista")}
            size="small"
        >
            <MenuItem value="">
                Todos
            </MenuItem>
 
            {transportistas.map((item) => (
                <MenuItem
                    key={item.id}
                    value={item.nombre}
                >
                    {item.nombre}
                </MenuItem>
            ))}
        </TextField>
 
        <TextField
        fullWidth
        select
        label="Estado"
        value={filtros.estado}
        onChange={handleChange("estado")}
        size="small"
        >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="true">Cerrada</MenuItem>
            <MenuItem value="false">Pendiente</MenuItem>
        </TextField>
 
        <TextField
        fullWidth
        label="Monto desde"
        value={filtros.montoDesde}
        onChange={handleChange("montoDesde")}
        size="small"
        slotProps={{
            input: {
            startAdornment: (
                <InputAdornment position="start">
                $
                </InputAdornment>
            )
            }
        }}
        />
 
        <TextField
        fullWidth
        label="Monto hasta"
        value={filtros.montoHasta}
        onChange={handleChange("montoHasta")}
        size="small"
        slotProps={{
            input: {
            startAdornment: (
                <InputAdornment position="start">
                $
                </InputAdornment>
            )
            }
        }}
        />
 
    </Box>
  )
}