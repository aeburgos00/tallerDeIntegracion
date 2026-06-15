import pool from '../config/db.js'

const obtenerTransportistas = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT  t.id id,
              u.nombre_apellido nombre,
              u.usuario usuario,
              u.dni dni,
              TO_CHAR(fecha_alta,'DD/MM/YYYY') fecha_alta,
              TO_CHAR(fecha_baja,'DD/MM/YYYY') fecha_baja,
              CASE WHEN u.usuario_activo is true then 'Activo' else 'Inactivo' end estado,
              t.costo_envio costo_envio
      FROM transportistas t
      JOIN usuarios u on t.id_usuario = u.id
      ORDER BY t.id
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

const obtenerTransportistasActivos = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT  t.id id,
              u.nombre_apellido nombre,
              u.usuario usuario,
              u.dni dni,
              TO_CHAR(fecha_alta,'DD/MM/YYYY') fecha_alta,
              TO_CHAR(fecha_baja,'DD/MM/YYYY') fecha_baja,
              CASE WHEN u.usuario_activo is true then 'Activo' else 'Inactivo' end estado,
              t.costo_envio costo_envio
      FROM transportistas t
      JOIN usuarios u on t.id_usuario = u.id
      where u.usuario_activo is true
      ORDER BY t.id
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

export {obtenerTransportistas, obtenerTransportistasActivos}