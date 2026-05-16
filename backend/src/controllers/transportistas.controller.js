import pool from '../config/db.js'

export const obtenerTransportistas = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM transportistas
      ORDER BY id
    `)

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