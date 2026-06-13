const API_URL = import.meta.env.VITE_API_URL

//Login
export const loginRequest = async (usuario, password) => {
  const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          usuario,
          password
        })
      }
    )
    return response.json()
}

//Transportistas
export const obtenerTransportistasActivos = async () => {
  const response = await fetch(
    `${API_URL}/transportistas/activos`
  )
  return response.json()
}

//Liquidaciones
export const obtenerLiquidacionesTotales = async (
  fecha_desde,
  fecha_hasta
) => {
  const response = await fetch(
    `${API_URL}/liquidaciones/totales?desde=${fecha_desde}&hasta=${fecha_hasta}`
  )
  return response.json()
}

//localidades
export const obtenerLocalidades = async () => {
  const response = await fetch(
    `${API_URL}/localidades`
  )
  return response.json()
}

export const obtenerLocalidadesActivas = async () => {
  const response = await fetch(
    `${API_URL}/localidades/activas`
  )
  return response.json()
}

export const obtenerLocalidadesTotales = async () => {
  const response = await fetch(
    `${API_URL}/localidades/totales`
  )
  return response.json()
}

//Envios
export const obtenerEnvios = async (
  fecha_desde,
  fecha_hasta
) => {
  const response = await fetch(
    `${API_URL}/envios?desde=${fecha_desde}&hasta=${fecha_hasta}`
  )
  return response.json()
}

export const obtenerEnviosPorTransportista = async (
  fecha_desde,
  fecha_hasta
) => {
  const response = await fetch(
    `${API_URL}/envios/transportistas?desde=${fecha_desde}&hasta=${fecha_hasta}`
  )
  return response.json()
}

export const obtenerEnviosTotales = async (
  fecha_desde,
  fecha_hasta
) => {
  const response = await fetch(
    `${API_URL}/envios/totales?desde=${fecha_desde}&hasta=${fecha_hasta}`
  )
  return response.json()
}

export const obtenerEnviosRecientes = async (
  fecha_desde,
  fecha_hasta
) => {
  const response = await fetch(
     `${API_URL}/envios/recientes?desde=${fecha_desde}&hasta=${fecha_hasta}`
  )
  return response.json()
}

export const obtenerEnvioPorId = async (
  id
) =>{
  const response = await fetch(
    `${API_URL}/envios/${id}`
  )
  return response.json()
}

export const exportarEnviosCSV = async (
  fechaDesde,
  fechaHasta
) => {

  const response = await fetch(
    `${API_URL}/envios/exportar-csv?desde=${fechaDesde}&hasta=${fechaHasta}`,
    {method:'GET'}
  )
  const hoy = new Date();
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'envios_'+ hoy.toLocaleDateString('es-AR') +'.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}


