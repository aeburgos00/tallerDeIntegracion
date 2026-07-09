import {
    Box,
    TextField,
    MenuItem,
    InputAdornment,
} from "@mui/material"
 
import { useEffect, useState } from 'react'
import { 
    obtenerLocalidades,
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
 
    const [localidades, setLocalidades] = useState([])
    const [transportistas, setTransportistas] = useState([])
 
    useEffect(()=>{
        const cargarCombos = async() =>{
            try{
                const localidadesResp = await obtenerLocalidades()
                const transportistasResp = await obtenerTransportistas()
                setLocalidades(localidadesResp.data)
                setTransportistas(transportistasResp.data)
            } catch(error){
                console.error(error)
            }
        }
        cargarCombos()
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
            lg:"180px 180px 180px 180px 130px 150px 150px"
        },
        gap:2,
        alignItems:"center",
    }}>
 
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
            label="Fecha Envío"
            value={filtros.fechaEnvio}
            onChange={(newValue) =>
            setFiltros({
                ...filtros,
                fechaEnvio: newValue
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
 
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
            label="Fecha Liquidación"
            value={filtros.fechaLiquidacion}
            onChange={(newValue) =>
            setFiltros({
                ...filtros,
                fechaLiquidacion: newValue
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
            label="Localidad"
            value={filtros.localidad}
            onChange={handleChange("localidad")}
            size="small"
        >
            <MenuItem value="">
                Todas
            </MenuItem>
 
            {localidades.map((item) => (
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
        label="Liquidado"
        value={filtros.liquidado}
        onChange={handleChange("liquidado")}
        size="small"
        >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="true">Sí</MenuItem>
            <MenuItem value="false">No</MenuItem>
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