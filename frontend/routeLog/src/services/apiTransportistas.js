const API_URL = import.meta.env.VITE_API_URL


export const obtenerEnviosPorTransportistaId = async (
    id_transportista,
    filtros = {}
) => {
    const params = new URLSearchParams()

    if (filtros.cliente) params.append("cliente", filtros.cliente)
    if (filtros.direccion) params.append("direccion", filtros.direccion)
    if (filtros.localidad) params.append("localidad", filtros.localidad)
    if (filtros.estado) params.append("estado", filtros.estado)   // debe ser el ID numérico (1-4)
    if (filtros.fechaEnvio) params.append("fecha", filtros.fechaEnvio.format("YYYY-MM-DD"))

    const response = await fetch(
        `${API_URL}/envios/transportista/${id_transportista}?${params.toString()}`
    )
    return response.json()
}

export const cambiarEstadoEnvio = async (id_envio, id_estado) => {
    const response = await fetch(
        `${API_URL}/envios/${id_envio}/estado`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_estado })
        }
    )
    return response.json()
}

export const obtenerProximoEnvio = async (id_transportista) => {
    const response = await fetch(
        `${API_URL}/envios/proximo/transportista/${id_transportista}`
    )
    return response.json()
}


export const obtenerLiquidacionesPorTransportistaId = async (
    id_transportista,
    desde,
    hasta
) => {
    const response = await fetch(
        `${API_URL}/liquidaciones/transportista/${id_transportista}?desde=${desde}&hasta=${hasta}`
    )
    return response.json()
}