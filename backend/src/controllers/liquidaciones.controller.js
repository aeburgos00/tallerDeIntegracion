import pool from '../config/db.js'
import { generarCSV} from '../utils/exportadorCSV.js'

/** Consulta default a la tabla liquidaciones */
export  const obtenerLiquidaciones = async (req, res) => {
  try 
  {
    const result = await pool.query(
      `SELECT 
       id, fecha_alta, monto_total, cantidad_paquetes
       FROM liquidaciones
       ORDER BY fecha_alta DESC
       `
    )
     res.json({
      ok: true,
      data: result.rows
    })
  } 
  catch (error)
  {
    res.status(500).json({
      ok: false,
      error: error.message
    })
  }
}

/** Listado detallado de liquidaciones por envío, con filtros dinámicos.*/
export const obtenerLiquidacionesListado = async (req, res) => {
  const {
    desde,          // fecha envío desde (rango global)
    hasta,          // fecha envío hasta (rango global de la pagina)
    transportista,
    estado,      
    montoDesde,
    montoHasta
  } = req.query
 
  try {
    let query = `
      SELECT  
          l.id,
          u.nombre_apellido AS transportista,
          u.usuario,
          l.cantidad_paquetes, 
          TO_CHAR(l.fecha_desde, 'DD/MM/YYYY') AS fecha_desde, 
          TO_CHAR(l.fecha_hasta, 'DD/MM/YYYY') AS fecha_hasta,
          TO_CHAR(l.fecha_cierre, 'DD/MM/YYYY') AS fecha_cierre, 
          cerrada,
          monto_total
        FROM liquidaciones l
        JOIN transportistas t ON t.id = l.id_transportista
        JOIN usuarios u ON u.id = t.id_usuario
        WHERE 1 = 1 
    `
    const parametros = []
 
    if (desde && hasta) {
      parametros.push(desde)
      parametros.push(hasta)
 
      query += `
        AND l.fecha_desde <= $${parametros.length} 
        AND l.fecha_hasta >= $${parametros.length - 1} 
      `
      /** Que la fecha seleccionada se encuentre en el rango
       * fecha_desde sea menor o igual a la fecha hasta seleccionada (filtro) => parametros.length
       * fecha_hasta sea mayor o igual a la fecha desde seleccionada (filtro) => parametros.length - 1
        */
    }
      


    if (transportista) {
      parametros.push(`%${transportista.toUpperCase()}%`)
 
      query += `
        AND upper(u.nombre_apellido) LIKE $${parametros.length}
      `
    }
 
    if (estado === 'true' || estado === 'false') {
      parametros.push(estado === 'true')
      query += `
        AND l.cerrada = $${parametros.length}
      `
    }
 
    if (montoDesde) {
      parametros.push(Number(montoDesde))
 
      query += `
        AND l.monto_total >= $${parametros.length}
      `
    }
 
    if (montoHasta) {
      parametros.push(Number(montoHasta))
 
      query += `
        AND l.monto_total <= $${parametros.length}
      `
    }
 
    query += `
      ORDER BY l.fecha_desde ASC
    `
 
    const result = await pool.query(query, parametros)
 
    res.json({
      ok: true,
      data: result.rows
    })
 
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    })
  }
}

export const obtenerLiquidacionesDashboard = async (req, res) => {
    const {
        desde,
        hasta
    } = req.query

    try {
        const query = `
            select
            coalesce(sum(aux.precio),0) as valor_total,
            coalesce(
                sum(
                case 
                    when aux.liq_id is not null 
                    then aux.precio
                    else 0
                end
                ),0
            ) as pago_realizado,
            coalesce(
                sum(
                case 
                    when aux.liq_id is null 
                    then aux.precio
                    else 0
                end
                ),0
            ) as pago_pendiente,
            case when  count(aux.paq_id) > 0 then
                (count(aux.liq_id)::decimal  / count(aux.paq_id))::numeric(6,2)
                else 0 
            end as pct_paquetes_liquidados
            from (
            select liq.id as liq_id, p.id as paq_id, tar.precio as precio
            from paquetes p
            join tarifas tar on p.id_tarifa = tar.id
            left join liquidaciones liq on liq.id = p.id_liquidacion
            where p.fecha between $1 and $2
            ) aux
        `

        const result = await pool.query(
            query,
            [desde, hasta]
        )

        res.json({
            ok: true,
            data: result.rows
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}

/** Obtener liquidaciones de un transportista puntual */
//Aca busca y muestra el total a liquidar, sin importar si fue cerrada o no la liq
export const obtenerLiquidacionesPorTransportista = async (req, res) => {
    const { id } = req.params
    const { desde, hasta } = req.query

    try {
        const query = `
            SELECT
                coalesce(sum(liq.monto_total), 0) as valor_total
            FROM liquidaciones liq
            JOIN transportistas t ON t.id = liq.id_transportista
            WHERE t.id_usuario = $1
            AND liq.fecha_desde >= $2
            AND liq.fecha_hasta <= $3
        `
        const result = await pool.query(query, [id, desde, hasta])

        res.json({
            ok: true,
            data: result.rows
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}

/** Todos los transportistas juntos (suma) */
export const obtenerLiquidacionesTotales = async (req, res) => {
  let {
    desde,
    hasta
  } = req.query

  // Normalizar valores vacíos o string "null"
  desde = !desde || desde === "null" || desde === "undefined" ? null : desde
  hasta = !hasta || hasta === "null" || hasta === "undefined" ? null : hasta

  try {
    const query = `
      SELECT  
          SUM(monto_total) as valor_total,
          SUM(CASE WHEN cerrada = true THEN monto_total ELSE 0 END) AS pago_realizado,
          SUM(CASE WHEN cerrada = false THEN monto_total ELSE 0 END) AS pago_pendiente,
          ((COUNT(CASE WHEN cerrada = true THEN 1 END) * 100) / NULLIF(COUNT(*), 0) ) AS pct_paquetes_liquidados,
          COUNT(*) AS cantidad_liquidaciones
        FROM liquidaciones
        WHERE ($1::date IS NULL OR fecha_hasta >= $1::date)
          AND ($2::date IS NULL OR fecha_desde <= $2::date)
    `
    /** $1 es desde, $2 es hasta
     * fecha_hasta debe ser mayor o igual a la fecha desde
     * fecha_desde debe ser menor o igual a la fecha hasta 
     * Esto para que lo que está dentro de los KPI coincida con lo que se filtra
     */

    const result = await pool.query(
      query,
      [desde, hasta]
    )
    
    res.json({
      ok: true,
      data: result.rows
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    })
  }
}

export const exportarCSV = async (req, res) => {
  const {
    desde, 
    hasta, 
    transportista,
    estado, 
    montoDesde,
    montoHasta
  } = req.query

  try {
    let query =  `
      SELECT 
          u.nombre_apellido AS transportista, 
          u.usuario,
          l.cantidad_paquetes,
          TO_CHAR (l.fecha_desde, 'DD/MM/YYYY') AS fecha_desde,
          TO_CHAR (l.fecha_hasta, 'DD/MM/YYYY') AS fecha_hasta,
          TO_CHAR (l.fecha_cierre, 'DD/MM/YYYY') AS fecha_cierre,
          l.cerrada, 
          l.monto_total
        FROM liquidaciones l
        JOIN transportistas t ON t.id = l.id_transportista
        JOIN usuarios u ON u.id = t.id_usuario
        WHERE 1=1
    `
    const parametros = []

    if(desde && hasta){
      parametros.push(desde)
      parametros.push(hasta)

      query += `
        AND l.fecha_desde <= $${parametros.length}
        AND l.fecha_hasta >= $${parametros.length - 1}
      `
    }

    if(transportista) {
      parametros.push(`%${transportista.toUpperCase()}%`)

      query += `
        AND upper(u.nombre_apellido) LIKE $${parametros.length}
      `
    }

    if (estado === 'true' || estado === 'false') {
      parametros.push(estado === 'true')
      query += `
        AND l.cerrada = $${parametros.length}
      `
    }

    if (montoDesde) {
      parametros.push(Number(montoDesde))
 
      query += `
        AND l.monto_total >= $${parametros.length}
      `
    }
 
    if (montoHasta) {
      parametros.push(Number(montoHasta))
 
      query += `
        AND l.monto_total <= $${parametros.length}
      `
    }

    query += `
      ORDER BY l.fecha_desde ASC
    `

    const result = await pool.query(query, parametros)

    const fields = [
      {label : 'Transportista', value: 'transportista'}, 
      { label: 'Semana Desde', value: 'fecha_desde' },
      { label: 'Semana Hasta', value: 'fecha_hasta' },
      {label : 'Cantidad de Envíos', value: 'cantidad_paquetes'},
      { label: 'Fecha Cierre', value: 'fecha_cierre' },
      { label: 'Estado', value: 'estado' },
      { label: 'Monto', value: 'monto_total' }
    ]

    const datosCSV = result.rows.map(item => ({
      ...item, 
      transportista: item.usuario ? `${item.transportista} (${item.usuario})` : item.transportista,
      estado: item.cerrada ? 'Cerrada' : 'Abierta', 
      monto_total: Number(item.monto_total || 0).toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2})
  }))

  const csv = generarCSV(datosCSV, fields)
  const csvConBOM = '\uFEFF' + csv

  res.header('Content-Type', 'text/csv; charset=utf-8')
  res.attachment('liquidaciones_${Date.now()}.csv')

  return res.send(csvConBOM)

  } catch (error) {
    console.error(error)
    return res.status(500).json ({
      message: 'Error exportando CSV'
    })
  }
}

export const obtenerHistorialLiquidacionesPorTransportista = async (req, res) => {
    const { id } = req.params

    try {
        const query = `
            SELECT
                liq.id,
                liq.monto_total,
                liq.cantidad_paquetes,
                TO_CHAR(liq.fecha_desde, 'DD/MM/YYYY') fecha_desde,
                TO_CHAR(liq.fecha_hasta, 'DD/MM/YYYY') fecha_hasta,
                TO_CHAR(liq.fecha_alta, 'DD/MM/YYYY') fecha_alta
            FROM liquidaciones liq
            JOIN transportistas t ON t.id = liq.id_transportista
            WHERE t.id_usuario = $1
            AND liq.fecha_hasta < CURRENT_DATE
            AND liq.cerrada = true
            ORDER BY liq.fecha_desde DESC
        `
        const result = await pool.query(query, [id])

        res.json({
            ok: true,
            data: result.rows
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}