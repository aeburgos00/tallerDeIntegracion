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
