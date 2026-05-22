import pool from "../config/db.js"

export const obtenerEnviosTotales = async (req, res) => {
    try{
        const result = await pool.query(`
            SELECT *
            FROM vw_envios_totales
        `)
        
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