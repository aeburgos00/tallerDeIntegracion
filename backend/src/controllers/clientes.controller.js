import pool from '../config/db.js'

const obtenerClientes = async(req, res) => {
    try{
        const query = `
            select  id,
                    nombre_apellido,
                    dni
            from clientes
        `

        const result = await pool.query(query,)    
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

export {obtenerClientes}