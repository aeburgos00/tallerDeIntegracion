import pool from '../config/db.js'

export const obtenerEnviosRecientes = async (req,res) => {
    const {
        desde,
        hasta
    } = req.query

    try{

        const query = `
            select 
                p.id id_envio,
                TO_CHAR(p.fecha,'DD/MM/YYYY') fecha_envio,
                c.nombre_apellido cliente,
                d.descripcion || ', ' || l.nombre direccion,
                u.nombre_apellido transportista,
                ta.precio tarifa,
                e.descripcion estado
            from paquetes p
            join clientes c on c.id = p.id_cliente
            join direcciones d on d.id = p.id_direccion and d.id_cliente = c.id
            join localidades l on l.id = d.id_localidad
            join transportistas t on t.id = p.id_transportista
            join usuarios u on t.id_usuario = u.id
            join estados e on e.id = p.id_estado
            join tarifas ta on ta.id = p.id_tarifa
            where p.fecha between $1 and $2
            order by p.fecha desc
            limit 4
        `

        const result = await pool.query(
            query,
            [desde, hasta]
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