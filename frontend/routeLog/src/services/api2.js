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
    id_transportista
) => {
    const response = await fetch(
        `${API_URL}/envios/transportistasIndividual/${id_transportista}?${params.toString()}`
    )
    return response.json()
}