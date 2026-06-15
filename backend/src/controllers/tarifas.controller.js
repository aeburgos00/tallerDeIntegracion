import pool from '../config/db.js'

const obtenerTarifas  = async(req, res) => {
    try{
        const query = `
            select  id,
                    precio,
                    id_transportista
                    id_localidad
            from tarifas
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

const obtenerTarifasPorTransportistaLocalidad = async(req, res) => {
    const {
        transportista,
        localidad
    } = req.query

    try{
        const query = `
            select  id,
                    precio
            from tarifas
            where id_transportista = $1
            and id_localidad = $2
        `

        const result = await pool.query(
            query,
            [transportista,localidad]
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
    obtenerTarifas, 
    obtenerTarifasPorTransportistaLocalidad
}