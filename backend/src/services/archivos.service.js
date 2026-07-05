import fs from "fs";
import csv from "csv-parser";

import pool from "../config/db.js";
import { 
    transformarDatosArchivoEnvios,
    resolverEnvios,
    guardarRegistrosEnvios,
    insertarEnvio
} from "./envios.service.js";
import { 
    validarArchivoVacio,
    validarColumnasEnvios,
    validarContenidoEnvios
 } from "./validaciones.service.js";


import dayjs from "dayjs";

const crearCache = () => ({
    clientes: new Map(),
    direcciones: new Map(),
    tarifas: new Map()
});

const crearStats = () => ({
    clientesCreados: 0,
    direccionesCreadas: 0,
    enviosImportados: 0,
    inicio: Date.now()
});

const leerCSV = (rutaArchivo) => {
    return new Promise((resolve, reject) => {
        const registros = [];
        
        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on("data", (fila) =>  registros.push(fila))
            .on("end", () =>  resolve(registros))
            .on("error", reject);
    });
};

export const procesarArchivoEnvios = async (rutaArchivo) => {
    const cache = crearCache();
    const stats = crearStats();

    let transaccionAbierta = false;

    const client = await pool.connect();
    try {
        const registros = await leerCSV(rutaArchivo);

        validarArchivoVacio(registros);
        validarColumnasEnvios(registros);
        validarContenidoEnvios(registros);

        await client.query("BEGIN");
        transaccionAbierta = true;

        const registrosTransformados = transformarDatosArchivoEnvios(registros)

        const envios = await resolverEnvios(
                registrosTransformados,
                client,
                cache,
                stats
            );
        
        await guardarRegistrosEnvios(
            envios,
            client,
            stats
        );

        await client.query("COMMIT");
        
        return {
            ok: true,
            mensaje: "Archivo procesado exitosamente.",
            resumen: {
                enviosImportados: stats.enviosImportados,
                clientesCreados: stats.clientesCreados,
                direccionesCreadas: stats.direccionesCreadas,
                tiempoProcesamientoSegundos: `${(Date.now() - stats.inicio) / 1000}`
            }
        };

    } catch (error) {
        console.error(error)
        if (transaccionAbierta) {
            await client.query("ROLLBACK");
        }
        throw error;
    } finally {
        client.release();
        await fs.promises.unlink(rutaArchivo).catch(() => {});
    }
};
