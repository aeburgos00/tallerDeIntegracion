import pool from "../config/db.js";

const obtenerTarifaPorTransportistaYLocalidad = async (registro, client) => {
    const conexion = client ?? await pool.connect();
    try{
        const query = `
            select  id,
                    precio
            from tarifas
            where id_transportista = $1
            and id_localidad = $2
        `

        const tarifa = await conexion.query(
            query,
            [registro.id_transportista, registro.id_localidad]
        )

        return tarifa.rows[0] || null;
        
    } catch(error){
        throw new Error(
            `Error al buscar tarifa: ${error.message}`
        );
    } finally {
        if (!client) {
            conexion.release();
        }
    }
}

const obtenerTarifa = async (registro, client, cache, errores) => {
    const key = `${registro.id_transportista}-${registro.id_localidad}`;

    if (cache.tarifas.has(key)) {
        return cache.tarifas.get(key);
    }

    const tarifa = await obtenerTarifaPorTransportistaYLocalidad(
        registro,
        client
    );

    if (!tarifa) {
        errores.push(
            `Fila ${registro.fila}: No existe una tarifa para el transportista ${registro.id_transportista} y la localidad ${registro.id_localidad}`
        )
        return null;
    }

    cache.tarifas.set(key, tarifa);
    return tarifa;
}

export {
    obtenerTarifa
}