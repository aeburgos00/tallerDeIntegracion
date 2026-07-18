import {
    Box,
    TextField,
    MenuItem,
    InputAdornment,
} from "@mui/material"

import { useEffect, useState } from 'react'
import { 
    obtenerEstados, 
    obtenerLocalidades,
    obtenerTransportistas
} from "../../services/api";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/es";

export default function FiltroEnvios({
    filtros,
    setFiltros
}) {
    
    const [estados,setEstados] = useState([])
    const [localidades, setLocalidades] = useState([])
    const [transportistas, setTransportistas] = useState([])

    useEffect(()=>{
        const cargarCombos = async() =>{
            try{
                const estadosResp = await obtenerEstados()
                const localidadesResp = await obtenerLocalidades()
                const transportistasResp = await obtenerTransportistas()
                setEstados(estadosResp.data)
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
            lg:"150px 180px 180px 180px 180px 130px 120px"
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

        <TextField
        fullWidth
        label="Cliente"
        value={filtros.cliente}
        onChange={handleChange("cliente")}
        size="small"
        />

        <TextField
        fullWidth
        label="Dirección"
        value={filtros.direccion}
        onChange={handleChange("direccion")}
        size="small"
        />

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
            <MenuItem value="">
                Todos
            </MenuItem>
            {
            estados.map((item) => (
                <MenuItem value={item.id}>{item.descripcion}</MenuItem>
            ))
            }
        </TextField>

        <TextField
        fullWidth
        label="Tarifa"
        value={filtros.tarifa}
        onChange={handleChange("tarifa")}
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

        {/* <TextField
        fullWidth
        label="Liquidación"
        value={filtros.liquidacion}
        onChange={handleChange("liquidacion")}
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
        /> */}

    </Box>
  )
}