import pool from "../config/db.js";

const buscarDireccionCliente = async (idCliente, descripcion, idLocalidad, client) => {
    const conexion = client ?? await pool.connect();

    try{
        const query = `
            select  id,
                    descripcion,
                    id_cliente,
                    id_localidad
            from direcciones
            where id_cliente = $1
            and descripcion = $2
            and id_localidad = $3
        `

        const result = await conexion.query(
            query,
            [idCliente, descripcion, idLocalidad]
        );

        return result.rows[0] || null;

    } catch(error){
        throw new Error(
            `Error al buscar dirección por cliente: ${error.message}`
        );
    } finally {
        if (!client) {
            conexion.release();
        }
    }
}

const crearDireccion = async (direccion, client) => {
    const conexion = client ?? await pool.connect();

    try{
        const query = `
            insert into direcciones (id_cliente, descripcion, id_localidad)
            values ($1, $2, $3)
            returning *
        `

        const result = await conexion.query(
            query,
            [direccion.id_cliente, direccion.descripcion, direccion.id_localidad]
        );
        
        return result.rows[0] || null;

    } catch(error){
        throw new Error(
            `Error al crear dirección: ${error.message}`
        );
    } finally {
        if (!client) {
            conexion.release();
        }
    }
}

const obtenerOCrearDireccion = async (
    cliente,
    registro,
    client,
    cache,
    stats
) => {

    const key = `${cliente.id}-${registro.direccion_cliente}-${registro.id_localidad}`;
    if (cache.direcciones.has(key)) {
        return cache.direcciones.get(key);
    }

    let direccion = await buscarDireccionCliente(
            cliente.id,
            registro.direccion_cliente,
            registro.id_localidad,
            client
        );

    if (!direccion) {
        direccion = await crearDireccion(
                {
                    id_cliente: cliente.id,
                    descripcion: registro.direccion_cliente,
                    id_localidad: registro.id_localidad
                },
                client
            );
        stats.direccionesCreadas++;
    }

    cache.direcciones.set(key, direccion);
    return direccion;
}

export {
    obtenerOCrearDireccion
}