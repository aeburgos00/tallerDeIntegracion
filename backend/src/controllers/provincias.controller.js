import pool from '../config/db.js'

const obtenerProvincias = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, nombre
            FROM provincias
            ORDER BY nombre
        `)

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

export { obtenerProvincias }