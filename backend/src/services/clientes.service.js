import pool from "../config/db.js";

const buscarClientePorDni = async (dni, client) => {
    const conexion = client ?? await pool.connect();

    try{
        const query = `
            select  id,
                    nombre_apellido,
                    dni
            from clientes
            where dni = $1
        `

        const result = await conexion.query(query, [dni]);
        return result.rows[0] || null;
    } catch(error){
        throw new Error(`Error al buscar cliente por DNI: ${error.message}`);
    } finally {
        if (!client) {
            conexion.release();
        }
    }
}

const crearCliente = async (cliente, client) => {
    const conexion = client ?? await pool.connect();

    try {
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
        await conexion.query(
            queryInsert,
            [ cliente.dni, cliente.nombre_apellido ]
        )

        const nuevoCliente = clienteResult.rows[0]
        return nuevoCliente;
    } catch(error) {
        throw new Error(`Error al crear cliente: ${error.message}`);
    } finally {
        if (!client) {
            conexion.release();
        }
    }
}

const obtenerOCrearCliente = async (registro, client, cache, stats) => {
    
    if (cache.clientes.has(registro.dni_cliente)) {
        return cache.clientes.get(registro.dni_cliente);
    }
    
    let cliente = await buscarClientePorDni(
        registro.dni_cliente,
        client
    );

    if (!cliente) {
        cliente = await crearCliente(
            {
                dni: registro.dni_cliente,
                nombre_apellido: registro.nombre_cliente
            },
            client
        );

        stats.clientesCreados++;
    }

    cache.clientes.set(registro.dni_cliente, cliente);

    return cliente;
}

export {
    obtenerOCrearCliente
}