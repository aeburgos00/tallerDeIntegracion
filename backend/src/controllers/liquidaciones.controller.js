import pool from '../config/db.js'
import { generarCSV} from '../utils/exportadorCSV.js'

export const obtenerLiquidaciones = async (req, res) => {
  const {
    desde,
    hasta,
    transportista,
    estado,
    montoDesde,
    montoHasta
  } = req.query
 
  try {
    let query = `
      select  
        u.nombre_apellido || ' (' || u.usuario || ')' "transportista",
        TO_CHAR(liq.fecha_desde,'DD/MM/YYYY') || '-' || TO_CHAR(liq.fecha_hasta,'DD/MM/YYYY')  "semana",
        liq.cantidad_paquetes "cant_envios",
        liq.monto_total "monto_total",
        CASE WHEN liq.cerrada is true
            THEN 'Cerrada'
            ELSE 'Abierta'
        END "estado",
        CASE WHEN liq.fecha_cierre is null
            THEN '-'
            ELSE TO_CHAR(liq.fecha_cierre,'DD/MM/YYYY')
        END "fecha_cierre"
      from  liquidaciones liq
      join  transportistas tr on liq.id_transportista = tr.id
      join  usuarios u on u.id = tr.id_usuario
      where 1=1
    `
    const parametros = []
 
    if (desde && hasta) {
      parametros.push(desde)
      parametros.push(hasta)
 
      query += `
        AND liq.fecha_desde <= $${parametros.length} 
        AND liq.fecha_hasta >= $${parametros.length - 1} 
      `;
    }

    if (transportista) {
      parametros.push(transportista);

      query += `
          AND liq.id_transportista = $${parametros.length}
      `;
    }
 
    if (estado) {
      parametros.push(estado);

      query += `
          AND $${parametros.length} = 
          CASE  WHEN liq.cerrada is true
                THEN 'CERRADA'
                ELSE 'ABIERTA'
          END
      `;
    }
 
    if (montoDesde) {
      parametros.push(Number(montoDesde))
 
      query += `
        AND liq.monto_total >= $${parametros.length}
      `
    }
 
    if (montoHasta) {
      parametros.push(Number(montoHasta))
 
      query += `
        AND liq.monto_total <= $${parametros.length}
      `
    }
 
    query += `
      ORDER BY liq.fecha_desde DESC
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
      select
            coalesce(sum(liq.monto_total),0) as total_liquidado,
            coalesce(sum(
                case 
                    when liq.cerrada is true
                    then 1
                    else 0
                end
                ),0 ) as liq_cerradas,
            coalesce(sum(
                case 
                    when liq.cerrada is false
                    then 1
                    else 0
                end
                ),0) as liq_abiertas,
            coalesce(count(distinct liq.id_transportista), 0) as transportistas_en_periodo
            from liquidaciones liq
        WHERE ($1::date IS NULL OR fecha_hasta >= $1::date)
          AND ($2::date IS NULL OR fecha_desde <= $2::date)
    `
    
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
    let query = `
      select  
        u.nombre_apellido || ' (' || u.usuario || ')' "transportista",
        TO_CHAR(liq.fecha_desde,'DD/MM/YYYY') || '-' || TO_CHAR(liq.fecha_hasta,'DD/MM/YYYY')  "semana",
        liq.cantidad_paquetes "cant_envios",
        liq.monto_total "monto_total",
        CASE WHEN liq.cerrada is true
            THEN 'Cerrada'
            ELSE 'Abierta'
        END "estado",
        CASE WHEN liq.fecha_cierre is null
            THEN '-'
            ELSE TO_CHAR(liq.fecha_cierre,'DD/MM/YYYY')
        END "fecha_cierre"
      from  liquidaciones liq
      join  transportistas tr on liq.id_transportista = tr.id
      join  usuarios u on u.id = tr.id_usuario
      where 1=1
    `
    const parametros = []
 
    if (desde && hasta) {
      parametros.push(desde)
      parametros.push(hasta)
 
      query += `
        AND liq.fecha_desde <= $${parametros.length} 
        AND liq.fecha_hasta >= $${parametros.length - 1} 
      `;
    }

    if (transportista) {
      parametros.push(transportista);

      query += `
          AND liq.id_transportista = $${parametros.length}
      `;
    }
 
    if (estado) {
      parametros.push(estado);

      query += `
          AND $${parametros.length} = 
          CASE  WHEN liq.cerrada is true
                THEN 'CERRADA'
                ELSE 'ABIERTA'
          END
      `;
    }
 
    if (montoDesde) {
      parametros.push(Number(montoDesde))
 
      query += `
        AND liq.monto_total >= $${parametros.length}
      `
    }
 
    if (montoHasta) {
      parametros.push(Number(montoHasta))
 
      query += `
        AND liq.monto_total <= $${parametros.length}
      `
    }
 
    query += `
      ORDER BY liq.fecha_desde DESC
    `

    const result = await pool.query(query, parametros)

    const fields = [
      { label: 'Transportista', value: 'transportista' },
      { label: 'Semana', value: 'semana' },
      { label: 'Cant. envíos', value: 'cant_envios' },
      { label: 'Monto total', value: 'monto_total' },
      { label: 'Estado', value: 'estado' },
      { label: 'Fecha cierre', value: 'fecha_cierre' }
    ]

    const datosCSV = result.rows.map(item => ({
      ...item, 
      monto_total: Number(item.monto_total || 0).toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
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
