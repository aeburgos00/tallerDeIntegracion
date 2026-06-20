const API_URL = import.meta.env.VITE_API_URL

/*
export const obtenerEnviosPorTransportistaId = async (
    fecha_desde,
    fecha_hasta
) => {
    const response = await fetch(
        `${API_URL}/envios/transportistas?desde=${fecha_desde}&hasta=${fecha_hasta}`
    )
    return response.json()
}
*/

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