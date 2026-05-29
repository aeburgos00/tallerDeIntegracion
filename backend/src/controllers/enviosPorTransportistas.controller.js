import pool from '../config/db.js'

export const obtenerEnviosPorTransportistas = async (req,res) => {
    const {
        desde,
        hasta
    } = req.query

    try{
        const query = `
            select 
            u.nombre_apellido "Transportista",
            count(1) "EnviosTotales",
            count(
            case when p.id_estado = 1 then 1 end
            ) "EnviosPendientes",
            count(
            case when p.id_estado = 2 then 1 end
            ) "EnviosEntregados",
            count(
            case when p.id_estado = 3 then 1 end
            ) "EnviosFallidos",
            count(
            case when p.id_estado = 4 then 1 end
            ) "EnviosNoRealizados",
            round((
            count(
                case when p.id_estado = 2 then 1 end
                )::numeric /COUNT(1)
            ) * 100,2
            ) "Cumplimiento"
            from transportistas t
            join usuarios u on u.id = t.id_usuario
            join paquetes p on p.id_transportista = t.id
            where p.fecha between $1 and $2
            group by u.nombre_apellido
            order by 7 desc
            limit 4
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
};