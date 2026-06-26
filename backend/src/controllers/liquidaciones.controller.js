import pool from '../config/db.js'

export const obtenerLiquidacionesPorTransportista = async (req, res) => {
  try {

    const { desde, hasta } = req.query

    const result = await pool.query(`  
      SELECT 
          p.id_transportista,
          COUNT(p.id) AS envios_totales,
          COALESCE(SUM(t.precio), 0) AS importe_total
        FROM paquetes p
        JOIN tarifas t ON p.id_tarifa = t.id
        WHERE 
          p.id_estado = 2
          AND ($1::date IS NULL OR p.fecha >= $1)
          AND ($2::date IS NULL OR p.fecha <= $2)
        GROUP BY p.id_transportista
        ORDER BY p.id_transportista
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

/*
export const obtenerLiquidacionesTotales = async(req, res) => {
    const {
        desde,
        hasta
    } = req.query

    try{
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
                count(aux.liq_id)::decimal  / count(aux.paq_id)
                else 0 
            end as pct_paquetes_liquidados
            from (
            select liq.id as liq_id, p.id as paq_id, tar.precio as precio
            from paquetes p
            join tarifas tar on p.id_tarifa = tar.id
            left join liquidaciones liq on liq.id_paquete = p.id
            where p.fecha between $1 and $2
            ) aux
        `

        const result = await pool.query(
            query,
            [desde,hasta]
        )
        
        res.json({
            ok:true,
            data:result.rows
        })
    }
    catch(error){
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}

*/


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
        LEFT JOIN liquidaciones liq ON liq.id_paquete = p.id
        WHERE 
          p.id_estado = 2
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