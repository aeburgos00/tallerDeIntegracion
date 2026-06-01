const API_URL = import.meta.env.VITE_API_URL

export const loginRequest = async (usuario, password) => {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario,
        password
      })
    }
  )
  return response.json()
}

export const obtenerEnviosPorTransportista = async (
  fecha_desde,
  fecha_hasta
) => {
  const response = await fetch(
    `${API_URL}/envios-por-transportista?desde=${fecha_desde}&hasta=${fecha_hasta}`
  )
  return response.json()
}

export const obtenerEnviosTotales = async (
  fecha_desde,
  fecha_hasta
) => {
  const response = await fetch(
    `${API_URL}/envios-totales?desde=${fecha_desde}&hasta=${fecha_hasta}`
  )
  return response.json()
}

export const obtenerEnviosRecientes = async (
  fecha_desde,
  fecha_hasta
) => {
  const response = await fetch(
    `${API_URL}/envios-recientes?desde=${fecha_desde}&hasta=${fecha_hasta}`
  )
  return response.json()
}

export const obtenerLiquidacionesTotales = async (
  fecha_desde,
  fecha_hasta
) => {
  const response = await fetch(
    `${API_URL}/liquidaciones-totales?desde=${fecha_desde}&hasta=${fecha_hasta}`
  )
  return response.json()
}

export const obtenerLocalidadesTotales = async () => {
  const response = await fetch(
    `${API_URL}/localidades-totales`
  )
  return response.json()
}

export const obtenerTransportistas = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/transportistas`)
  const data = await response.json()
  return data
}
