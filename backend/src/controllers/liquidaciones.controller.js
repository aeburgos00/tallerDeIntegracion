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
    fechaEnvio,     // fecha envío exacta
    fechaLiquidacion,
    transportista,
    localidad,
    liquidado,      // "true" | "false"
    montoDesde,
    montoHasta
  } = req.query
 
  try {
    let query = `
      SELECT
          p.id AS id_envio,
          TO_CHAR(p.fecha, 'DD/MM/YYYY') AS fecha_envio,
          TO_CHAR(liq.fecha_alta, 'DD/MM/YYYY') AS fecha_liquidacion,
          u.nombre_apellido AS transportista,
          CASE WHEN p.id_liquidacion IS NOT NULL THEN true ELSE false END AS liquidado,
          COALESCE(tar.precio, 0) AS monto
        FROM paquetes p
        JOIN transportistas t ON t.id = p.id_transportista
        JOIN usuarios u ON u.id = t.id_usuario
        JOIN tarifas tar ON tar.id = p.id_tarifa
        JOIN direcciones d ON d.id = p.id_direccion
        JOIN localidades l ON l.id = d.id_localidad
        LEFT JOIN liquidaciones liq ON liq.id = p.id_liquidacion
        WHERE 1=1 
        AND (p.id_estado = 2 OR p.id_estado = 3)
    `
    const parametros = []
 
    if (desde && hasta) {
      parametros.push(desde)
      parametros.push(hasta)
 
      query += `
        AND p.fecha BETWEEN $${parametros.length - 1}
                        AND $${parametros.length}
      `
    }
 
    if (fechaEnvio) {
      parametros.push(fechaEnvio)
 
      query += `
        AND p.fecha = $${parametros.length}
      `
    }
 
    if (fechaLiquidacion) {
      parametros.push(fechaLiquidacion)
 
      query += `
        AND liq.fecha_alta::date = $${parametros.length}
      `
    }
 
    if (transportista) {
      parametros.push(`%${transportista.toUpperCase()}%`)
 
      query += `
        AND upper(u.nombre_apellido) LIKE $${parametros.length}
      `
    }
 
    if (localidad) {
      parametros.push(`%${localidad.toUpperCase()}%`)
 
      query += `
        AND upper(l.nombre) LIKE $${parametros.length}
      `
    }
 
    if (liquidado === 'true' || liquidado === 'false') {
      const esLiquidado = liquidado === 'true'
      query += `
        AND (p.id_liquidacion IS NOT NULL) = ${esLiquidado}
      `
    }
 
    if (montoDesde) {
      parametros.push(Number(montoDesde))
 
      query += `
        AND tar.precio >= $${parametros.length}
      `
    }
 
    if (montoHasta) {
      parametros.push(Number(montoHasta))
 
      query += `
        AND tar.precio <= $${parametros.length}
      `
    }
 
    query += `
      ORDER BY p.fecha DESC
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

export const obtenerLiquidacionesTotales= async (req, res) => {
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
        COALESCE(SUM(aux.precio), 0) AS valor_total,

        COUNT(aux.paq_id) AS cantidad_envios,

        COALESCE(
          SUM(
            CASE 
              WHEN aux.liq_id IS NOT NULL 
              THEN aux.precio
              ELSE 0
            END
          ), 0
        ) AS pago_realizado,

        COALESCE(
          SUM(
            CASE 
              WHEN aux.liq_id IS NULL 
              THEN aux.precio
              ELSE 0
            END
          ), 0
        ) AS pago_pendiente,

        CASE 
          WHEN COUNT(aux.paq_id) > 0 THEN
            ROUND((COUNT(aux.liq_id)::decimal / COUNT(aux.paq_id)) * 100, 2)
          ELSE 0 
        END AS pct_paquetes_liquidados

      FROM (
        SELECT 
          liq.id AS liq_id, 
          p.id AS paq_id, 
          tar.precio AS precio
        FROM paquetes p
        JOIN tarifas tar ON p.id_tarifa = tar.id
        LEFT JOIN liquidaciones liq ON liq.id = p.id_liquidacion
        WHERE 
          (p.id_estado = 2 OR p.id_estado = 3)
          AND ($1::date IS NULL OR p.fecha >= $1::date)
          AND ($2::date IS NULL OR p.fecha <= $2::date)
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

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    })
  }
}