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

export const obtenerTransportistasTotales = async () => {
  const response = await fetch(
    `${API_URL}/transportistas/totales`
  );

  return response.json();
};

///para filtros
export const obtenerTransportistas = async (filtros = {}) => {

  const params = new URLSearchParams();

  Object.entries(filtros).forEach(([key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      params.append(key, value);
    }
  });

  const response = await fetch(
    `${API_URL}/transportistas?${params.toString()}`
  );

  return response.json();
};

//obtenerTransportistaPorId
export const obtenerTransportistaPorId = async (id) => {

  const response = await fetch(
    `${API_URL}/transportistas/${id}`
  );

  return response.json();

};

/// para el ABM
//crearTransportista(formulario)
export const crearTransportista = async (data) => {

  const response = await fetch(
    `${API_URL}/transportistas`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  return response.json();

};

//modificarTransportista(formulario)
export const modificarTransportista = async (id, data) => {

  const response = await fetch(
    `${API_URL}/transportistas/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  return response.json();

};
//eliminarTransportista(id_transportista)
export const eliminarTransportista = async (id) => {

  const response = await fetch(
    `${API_URL}/transportistas/${id}`,
    {
      method: "DELETE"
    }
  );

  return response.json();

};

///exportarTransportistasCSV
export const exportarTransportistasCSV = async () => {

  const response = await fetch(
    `${API_URL}/transportistas/exportar/csv`,
    {
      method: "GET"
    }
  );

  const hoy = new Date();

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download =
    `transportistas_${hoy.toLocaleDateString("es-AR")}.csv`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);

};

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

export const crearEnvio = async (data) => {
  const response = await fetch(
    `${API_URL}/envios`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  )
  return response.json()
}

export const modificarEnvio = async (id, data) => {
  const response = await fetch(
    `${API_URL}/envios/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  )

  return response.json()
}

export const cancelarEnvio = async (id) => {
   const response = await fetch(
    `${API_URL}/envios/${id}/cancelar`,
    { method: "PUT" }
  )
  return response.json()
}


//Estados
export const obtenerEstados= async () =>{
  const response = await fetch(
    `${API_URL}/estados`
  )
  return response.json()
}

//Clientes
export const obtenerClientes = async () =>{
  const response = await fetch(
    `${API_URL}/clientes`
  )
  return response.json()
}

export const crearCliente = async (data) => {
  const response = await fetch(
    `${API_URL}/clientes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  )
  return response.json()
}

//Direcciones
export const obtenerDirecciones = async () =>{
  const response = await fetch(
    `${API_URL}/clientes`
  )
  return response.json()
}

export const obtenerDireccionesPorClienteLocalidad  = async (
  cliente,
  localidad
) =>{
  const response = await fetch(
    `${API_URL}/direcciones/cliente/localidad?cliente=${cliente}&localidad=${localidad}`
  )
  return response.json()
}

//Tarifas
export const obtenerTarifas = async () =>{
  const response = await fetch(
    `${API_URL}/tarifas`
  )
  return response.json()
}

export const obtenerTarifasPorTransportistaLocalidad  = async (
  transportista,
  localidad
) =>{
  const response = await fetch(
    `${API_URL}/tarifas/transportista/localidad?transportista=${transportista}&localidad=${localidad}`
  )
  return response.json()
}

