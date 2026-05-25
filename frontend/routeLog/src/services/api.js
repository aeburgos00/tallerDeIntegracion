const API_URL = import.meta.env.VITE_API_URL

export const obtenerEnviosPorTransportista = async () => {
  const response = await fetch(
    `${API_URL}/envios-por-transportista`
  )
  return response.json()
}

export const obtenerEnviosTotales = async () => {
  const response = await fetch(
    `${API_URL}/envios-totales`
  )
  return response.json()
}

export const obtenerEnviosRecientes = async () => {
  const response = await fetch(
     `${API_URL}/envios-recientes`
  )
  return response.json()
}

export const obtenerLiquidacionesTotales = async () => {
  const response = await fetch(
    `${API_URL}/liquidaciones-totales`
  )
  return response.json()
}