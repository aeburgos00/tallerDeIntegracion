import pool from '../config/db.js'

export const obtenerLocalidades = async(req, res) => {
    try{
        const result = await pool.query(`
            SELECT  id id_loc,
                    nombre,
                    codigo_postal,
                    provincia,
                    costo_envio,
                    TO_CHAR(fecha_alta,'DD/MM/YYYY') fecha_alta,
                    TO_CHAR(fecha_baja,'DD/MM/YYYY') fecha_baja,
                    case when estado is true then 'Activo' else 'Inactivo' end as estado
            FROM localidades
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