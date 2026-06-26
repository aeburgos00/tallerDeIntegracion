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

//POST
const crearCliente = async (req, res) => {
  const {
    dni,
    nombre_apellido
  } = req.body

  try {
    //Validaciones
    if(
        !dni ||
        !nombre_apellido
    ){
    return res.status(400).json({
        ok:false,
        error:"Debe los datos obligatorios."
    })
    }

    //Busco la direccion a ver si existe
    const query = `
        SELECT id
        FROM clientes
        WHERE dni = $1
    `
    const result = await pool.query(
        query,
        [dni]
    )

    if(result?.rows[0]?.id){
        return res.status(400).json({
            ok:false,
            error:"El cliente ingresado ya existe."
        })
    }

    //Abro la transaccion
    await pool.query("BEGIN")

    //Agrego el nuevo cliente
    const queryInsert = `
        INSERT INTO clientes(
            dni,
            nombre_apellido
        )
        VALUES(
            $1,
            $2
        )
        RETURNING id
    `
    const clienteResult =
    await pool.query(
        queryInsert,
        [ dni, nombre_apellido ]
    )

    const nuevoCliente = clienteResult.rows[0]
    const idPaquete = nuevoCliente.id

    //Cierro la transaccion
    await pool.query("COMMIT")

    res.status(201).json({
        ok:true,
        data: nuevoCliente,
        message:`Cliente ${idPaquete} creado correctamente`
    })
  } catch(error) {
    res.status(500).json({
      ok:false,
      error:error.message
    })
    await pool.query("ROLLBACK")
    throw error
  }

}

export {obtenerClientes, crearCliente}