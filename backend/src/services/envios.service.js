import pool from "../config/db.js";

import dayjs from "dayjs";

import { obtenerOCrearCliente } from "./clientes.service.js";
import { obtenerOCrearDireccion } from "./direcciones.service.js";
import { obtenerTarifa } from "./tarifas.service.js";

const transformarDatosArchivoEnvios = (registros) => {
    return registros.map((fila, indice) => ({
        fila: indice + 2,
        dni_cliente: fila.DNI_CLIENTE.trim(),
        nombre_cliente: fila.NOMBRE_CLIENTE.trim(),
        direccion_cliente: fila.DIRECCION_CLIENTE.trim(),
        id_localidad: Number(fila.ID_LOCALIDAD),
        id_transportista: Number(fila.ID_TRANSPORTISTA),
        fecha_envio: dayjs(fila.FECHA.trim(), "YYYY-MM-DD").toDate(),
    }));
};

const resolverEnvios = async (registros, client, cache, stats) => {
    const envios = [];
    const errores = [];

    for (const [indice, registro] of registros.entries()) {

        const cliente = await obtenerOCrearCliente(
            registro, 
            client, 
            cache, 
            stats
        );
        
        if (!cliente) {
            continue;
        }

        const direccion = await obtenerOCrearDireccion(
            cliente,
            registro,
            client,
            cache,
            stats
        );

        if (!direccion) {
            continue;
        }
        
        const tarifa = await obtenerTarifa(
            registro, 
            client, 
            cache,
            errores
        );

        if (!tarifa) {
            continue;
        }

        envios.push({
            fila: registro.fila,
            id_cliente: cliente.id,
            id_direccion: direccion.id,
            fecha_envio: registro.fecha_envio,
            id_transportista: registro.id_transportista,
            id_tarifa: tarifa.id
        });
    }

    if (errores.length > 0) {
        const error = new Error("El archivo contiene errores.");
        error.errores = errores;
        throw error;
    }

    return envios;
}

const guardarRegistrosEnvios = async (envios, client, stats) => {
    for (const envio of envios) {
        await insertarEnvio(envio, client);
        stats.enviosImportados++;
    }
};

const insertarEnvio = async (envio, client = null) => {

    const conexion = client ?? await pool.connect();

    try {

        const query = `
            INSERT INTO paquetes
            (
                id_cliente,
                id_direccion,
                fecha,
                id_transportista,
                id_tarifa,
                id_estado
            )
            VALUES
            ($1,$2,$3,$4,$5,1)
            RETURNING id;
        `;

        const values = [
            envio.id_cliente,
            envio.id_direccion,
            envio.fecha_envio,
            envio.id_transportista,
            envio.id_tarifa
        ];

        const { rows } = await conexion.query(query, values);

        return rows[0];

    } finally {
        if (!client) {
            conexion.release();
        }
    }

};

export { 
    transformarDatosArchivoEnvios,
    resolverEnvios,
    guardarRegistrosEnvios,
    insertarEnvio 
};