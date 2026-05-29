import pool from "../config/db.js"

export const obtenerEnviosTotales = async (req, res) => {
    const {
        desde,
        hasta
    } = req.query

    try{
        const query = `
            select 
            count(1) total,
            count(
                case when p.id_estado = 1 then 1 end
            ) pendientes,
            count(
                case when p.id_estado = 2 then 1 end
            ) entregados,
            count(
                case when p.id_estado = 3 then 1 end
            ) visitas_fallidas,
            count(
                case when p.id_estado = 4 then 1 end
            ) no_visitados
            from paquetes p
            where p.fecha between $1 and $2
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