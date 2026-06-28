import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Skeleton
} from '@mui/material'

import { useEffect, useState } from 'react'

import { obtenerTransportistas } from '../services/api.js'

export default function SelectTransportistas({ value, onChange }) {

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                setLoading(true)
                const result = await obtenerTransportistas()
                setData(result.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        obtenerDatos()
    }, [])

    if (loading) return <Skeleton variant="rounded" height={56} width="100%" />

    return (
        <FormControl fullWidth>
            <InputLabel>Transportista</InputLabel>
            <Select
                value={value}
                onChange={onChange}
                label="Transportista"
            >
                <MenuItem value="">
                    <em>Todos</em>
                </MenuItem>
                {data.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        {item.nombre_apellido}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}