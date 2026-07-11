const API_URL = import.meta.env.VITE_API_URL

//==================== AUTH ====================

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

//==================== TRANSPORTISTAS ====================

export const obtenerTransportistas = async (filtros) => {
  
  let response;

  if(filtros){
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

    response = await fetch(`${API_URL}/transportistas?${params.toString()}`)
  }else{
    response  = await fetch(`${API_URL}/transportistas`)
  }

  return response.json()
}

export const obtenerTransportistasActivos = async () => {
  const response = await fetch(
    `${API_URL}/transportistas/activos`
  )
  return response.json()
}

export const obtenerTransportistasTotales = async () => {
  const response = await fetch(`${API_URL}/transportistas/totales`)
  return response.json()
}

export const exportarTransportistasCSV = async (
  filtros
) => {

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
    `${API_URL}/transportistas/exportar-csv?${params.toString()}`,
    { method: 'GET' }
  )
  const hoy = new Date();
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'transportistas_' + hoy.toLocaleDateString('es-AR') + '.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export const obtenerTransportistaPorId = async (
  id
) => {
  const response = await fetch(
    `${API_URL}/transportistas/${id}`
  )
  return response.json()
}

export const crearTransportista = async (tranpsortista) => {
  const response = await fetch(
    `${API_URL}/transportistas`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tranpsortista)
    }
  )
  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.error);
  }

  return data;
}

export const modificarTransportista = async (id, tranpsortista) => {
  const response = await fetch(
    `${API_URL}/transportistas/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tranpsortista)
    }
  )

  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.error);
  }

  return data;
}

export const eliminarTransportista = async (id) => {
  const response = await fetch(
    `${API_URL}/transportistas/${id}`,
    {
      method: 'DELETE'
    }
  )
  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.error);
  }

  return data;
}


//==================== CLIENTES ====================

export const obtenerClientes = async () => {
  const response = await fetch(
    `${API_URL}/clientes`
  )
  return response.json()
}

export const crearCliente = async (cliente) => {
  const response = await fetch(
    `${API_URL}/clientes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cliente)
    }
  )
  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.error);
  }

  return data;
}

//==================== DIRECCIONES ====================

export const obtenerDirecciones = async () => {
  const response = await fetch(
    `${API_URL}/direcciones`
  )
  return response.json()
}

export const obtenerDireccionesPorClienteLocalidad = async (
  cliente,
  localidad
) => {
  const response = await fetch(
    `${API_URL}/direcciones/cliente/localidad?cliente=${cliente}&localidad=${localidad}`
  )
  return response.json()
}

//==================== LOCALIDADES ====================

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

export const obtenerLocalidadPorId = async (id) => {
  const response = await fetch(
    `${API_URL}/localidades/${id}`
  )
  return response.json()
}

export const crearLocalidad = async (localidad) => {
  const response = await fetch(
    `${API_URL}/localidades`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(localidad)
    }
  )
  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.error);
  }

  return data;
}

export const modificarLocalidad = async (
  id,
  localidad
) => {
  const response = await fetch(
    `${API_URL}/localidades/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(localidad)
    }
  )
  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.error);
  }

  return data;
}

export const eliminarLocalidad = async (id) => {
  const response = await fetch(
    `${API_URL}/localidades/${id}`,
    {
      method: 'DELETE'
    }
  )
  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.error);
  }

  return data;
}

export const cambiarEstadoLocalidad = async (id) => {
  const response = await fetch(
    `${API_URL}/localidades/${id}/estado`,
    { method: 'PATCH' }
  )
  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.error);
  }

  return data;
}

export const exportarLocalidadesCSV = async () => {
  const response = await fetch(
    `${API_URL}/localidades/exportar-csv`,
    { method: 'GET' }
  )
  const hoy = new Date()
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download =
    'localidades_' +
    hoy.toLocaleDateString('es-AR') +
    '.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

//==================== TARIFAS ====================

export const obtenerTarifas = async () => {
  const response = await fetch(
    `${API_URL}/tarifas`
  )
  return response.json()
}

export const obtenerTarifasPorTransportistaLocalidad = async (
  transportista,
  localidad
) => {
  const response = await fetch(
    `${API_URL}/tarifas/transportista/localidad?transportista=${transportista}&localidad=${localidad}`
  )
  return response.json()
}

//==================== ESTADOS ====================

export const obtenerEstados = async () => {
  const response = await fetch(
    `${API_URL}/estados`
  )
  return response.json()
}

//==================== ENVIOS ====================

export const obtenerEnvios = async (
  fecha_desde,
  fecha_hasta,
  filtros
) => {

  const params = new URLSearchParams();

  if (fecha_desde) {
    params.append("desde", fecha_desde);
  }

  if (fecha_hasta) {
    params.append("hasta", fecha_hasta);
  }

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
    `${API_URL}/envios?${params.toString()}`
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
) => {
  const response = await fetch(
    `${API_URL}/envios/${id}`
  )
  return response.json()
}

export const crearEnvio = async (envio) => {
  const response = await fetch(
    `${API_URL}/envios`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(envio)
    }
  )
  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.error);
  }

  return data;
}

export const modificarEnvio = async (id, envio) => {
  const response = await fetch(
    `${API_URL}/envios/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(envio)
    }
  )

  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.error);
  }

  return data;
}

export const cancelarEnvio = async (id) => {
  const response = await fetch(
    `${API_URL}/envios/${id}/cancelar`,
    { method: "PUT" }
  )
  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.error);
  }

  return data;
}

export const exportarEnviosCSV = async (
  fechaDesde,
  fechaHasta,
  filtros
) => {

  const params = new URLSearchParams();

  if (fechaDesde) {
    params.append("desde", fechaDesde);
  }

  if (fechaHasta) {
    params.append("hasta", fechaHasta);
  }

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
    `${API_URL}/envios/exportar-csv?${params.toString()}`,
    { method: 'GET' }
  )
  const hoy = new Date();
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'envios_' + hoy.toLocaleDateString('es-AR') + '.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

//==================== LIQUIDACIONES ====================

export const obtenerLiquidacionesListado = async (
  fecha_desde,
  fecha_hasta,
  filtros
) => {
 
  const params = new URLSearchParams();
 
  if (fecha_desde) {
    params.append("desde", fecha_desde);
  }
 
  if (fecha_hasta) {
    params.append("hasta", fecha_hasta);
  }
 
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
    `${API_URL}/liquidaciones/listado?${params.toString()}`
      )
  return response.json()
}


export const obtenerLiquidacionesDashboard = async (
  fecha_desde,
  fecha_hasta
) => {
  const response = await fetch(
    `${API_URL}/liquidaciones/dashboard?desde=${fecha_desde}&hasta=${fecha_hasta}`
  )
  return response.json()
}



export const obtenerLiquidacionesTotales = async (
  fecha_desde,
  fecha_hasta
) => {
  const response = await fetch(
    `${API_URL}/liquidaciones/totales?desde=${fecha_desde}&hasta=${fecha_hasta}`
  )
  return response.json()
}

export const obtenerLiquidacionesTotalesAdmin = async (
  fecha_desde,
  fecha_hasta
) => {
  const response = await fetch(
    `${API_URL}/liquidaciones/totalesAdmin?desde=${fecha_desde}&hasta=${fecha_hasta}`
  )
  return response.json()
}

export const obtenerLiquidacionesTransportistas = async (desde, hasta) => {
  const response = await fetch(
    `${API_URL}/liquidaciones/transportistas?desde=${desde}&hasta=${hasta}`
  )
  return response.json()
}

export const obtenerLiquidacionesPorTransportista = async (id, desde, hasta) => {
  const response = await fetch(
    `${API_URL}/liquidaciones/transportista/${id}?desde=${desde}&hasta=${hasta}`
  )
  return response.json()
}

//==================== PROVINCIAS ====================

export const obtenerProvincias = async () => {
  const response = await fetch(
    `${API_URL}/provincias`
  )
  return response.json()
}


//==================== ARCHIVOS ====================

export const subirArchivoEnvios = async (formData) => {
  const response = await fetch(
    `${API_URL}/archivos/envios`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.error);
  }

  return data;
};