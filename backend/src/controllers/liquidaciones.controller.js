import pool from '../config/db.js'

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
    fecha_alta,    
    transportista,
    estado,      
    montoDesde,
    montoHasta
  } = req.query
 
  try {
    let query = `
      SELECT  
          l.id,
          TO_CHAR(l.fecha_alta, 'DD/MM/YYYY') AS fecha_alta,
          u.nombre_apellido AS transportista,
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
        AND l.fecha_alta BETWEEN $${parametros.length - 1}
                        AND $${parametros.length}
      `
    }
 
    if (fecha_alta) {
      parametros.push(fecha_alta)
 
      query += `
        AND l.fecha_alta::date = $${parametros.length}
      `
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
      ORDER BY l.fecha_alta DESC
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

/** Obtener listado agrupado: Envíos e importe total para cada transportista */
export const obtenerLiquidacionesTransportistas = async (req, res) => {
  try {

    const { desde, hasta } = req.query

    const result = await pool.query(`  
          SELECT 
              p.id_transportista,
              u.nombre_apellido AS transportista,
              COUNT(p.id) AS envios_totales,
              COALESCE(SUM(tar.precio), 0) AS importe_total
            FROM paquetes p
            JOIN transportistas t ON t.id = p.id_transportista
            JOIN usuarios u ON u.id = t.id_usuario
            JOIN tarifas tar ON tar.id = p.id_tarifa
            WHERE 
              (p.id_estado = 2 OR p.id_estado = 3)
              AND ($1::date IS NULL OR p.fecha >= $1::date)
              AND ($2::date IS NULL OR p.fecha <= $2::date)
            GROUP BY p.id_transportista, u.nombre_apellido
            ORDER BY u.nombre_apellido
          `, [desde, hasta])

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

export const obtenerLiquidacionesTotales = async (req, res) => {
    const {
        desde,
        hasta
    } = req.query

    try {
        const query = `
            select
                count(aux.paquete) total_envios,
                coalesce(sum(aux.valor),0) as valor_total,
                count(aux.liquidacion) envios_liquidados,
                coalesce(sum(aux.valor_liq),0) as valor_liquidado,
                case when count(aux.paquete) > 0 then
                    (count(aux.liquidacion)::decimal  / count(aux.paquete))::numeric(6,2)
                    else 0 
                end as pct_paquetes_liquidados
            from (
                select p.id as paquete, tar.precio as valor, liq.id as liquidacion, liq.monto_total valor_liq
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
export const obtenerLiquidacionesPorTransportista = async (req, res) => {
    const { id } = req.params   // id = usuarios.id (viene de user.id en el front)
    const { desde, hasta } = req.query

    try {
        const query = `
            select
                coalesce(sum(aux.precio), 0) as valor_total,
                coalesce(sum(case when aux.liq_id is not null then aux.precio else 0 end), 0) as pago_realizado,
                coalesce(sum(case when aux.liq_id is null then aux.precio else 0 end), 0) as pago_pendiente
            from (
                select liq.id as liq_id, p.id as paq_id, tar.precio as precio
                from paquetes p
                join transportistas t on t.id = p.id_transportista
                join tarifas tar on tar.id = p.id_tarifa
                left join liquidaciones liq on liq.id = p.id_liquidacion
                where t.id_usuario = $1
                and p.fecha between $2 and $3
            ) aux
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
export const obtenerLiquidacionesTotalesAdmin= async (req, res) => {
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
        WHERE ($1::date IS NULL OR fecha_alta >= $1::date)
          AND ($2::date IS NULL OR fecha_alta <= $2::date)
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