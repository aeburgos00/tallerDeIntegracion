import pool from '../config/db.js'

export const obtenerLiquidacionesTotales = async(req, res) => {
    try{
        const result = await pool.query(`
            SELECT *
            FROM vw_liquidaciones_totales
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

