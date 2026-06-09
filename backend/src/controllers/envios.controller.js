import pool from '../config/db.js'

export const obtenerEnvios = async (req,res) => {
    const {
        desde,
        hasta
    } = req.query

    try{
        const query = `
            select  p.id id_envio,
                    TO_CHAR(p.fecha,'DD/MM/YYYY') fecha_envio,
                    c.nombre_apellido || ' (ID ' || cast(c.ID as varchar) || ')' cliente,
                    d.descripcion direccion,
                    l.nombre localidad,
                    u.nombre_apellido transportista,
                    e.descripcion estado,
                    tar.precio tarifa,
                    case when liq.id is not null then tar.precio else 0 end as liquidacion
            from paquetes p
            join transportistas t on p.id_transportista = t.id
            join usuarios u on u.id = t.id_usuario
            join clientes c on c.id = p.id_cliente
            join direcciones d on d.id = p.id_direccion and d.id_cliente = c.id
            join localidades l on l.id = d.id_localidad
            join estados e on e.id = p.id_estado
            join tarifas tar on tar.id = p.id_tarifa
            left join liquidaciones liq on liq.id_paquete = p.id
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
};