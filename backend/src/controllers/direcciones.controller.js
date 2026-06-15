import pool from '../config/db.js'

const obtenerDirecciones  = async(req, res) => {
    try{
        const query = `
            select  id,
                    descripcion,
                    id_cliente,
                    id_localidad
            from direcciones
        `

        const result = await pool.query(query)    
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

const obtenerDireccionesPorClienteLocalidad = async(req, res) => {
    const {
        cliente,
        localidad
    } = req.query

    try{
        const query = `
            select  id,
                    descripcion
            from direcciones
            where id_cliente = $1
            and id_localidad = $2
        `

        const result = await pool.query(
            query,
            [cliente,localidad]
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

export {
    obtenerDirecciones, 
    obtenerDireccionesPorClienteLocalidad
}