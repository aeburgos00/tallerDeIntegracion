import pool from '../config/db.js'
import { generarCSV } from '../utils/exportadorCSV.js'

const obtenerLocalidades = async (req, res) => {
    const { localidad, codigoPostal, provincia, estado } = req.query

    try {
        let query = `
            SELECT  id id_loc,
                    nombre,
                    codigo_postal,
                    provincia,
                    costo_envio,
                    TO_CHAR(fecha_alta,'DD/MM/YYYY') fecha_alta,
                    TO_CHAR(fecha_baja,'DD/MM/YYYY') fecha_baja,
                    case when estado is true then 'Activo' else 'Inactivo' end as estado
            FROM localidades
            WHERE 1=1
        `
        const valores = []
        let i = 1

        if (localidad) { query += ` AND nombre ILIKE $${i++}`; valores.push(`%${localidad}%`) }
        if (codigoPostal) { query += ` AND codigo_postal ILIKE $${i++}`; valores.push(`%${codigoPostal}%`) }
        if (provincia) { query += ` AND provincia ILIKE $${i++}`; valores.push(`%${provincia}%`) }
        if (estado) { query += ` AND estado = $${i++}`; valores.push(estado === 'Activo') }

        query += ` ORDER BY nombre ASC`

        const result = await pool.query(query, valores)

        res.json({
            ok: true,
            data: result.rows
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}

const obtenerLocalidadesActivas = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT  id id,
                    nombre,
                    codigo_postal,
                    provincia,
                    costo_envio,
                    TO_CHAR(fecha_alta,'DD/MM/YYYY') fecha_alta,
                    TO_CHAR(fecha_baja,'DD/MM/YYYY') fecha_baja,
                    case when estado is true then 'Activo' else 'Inactivo' end as estado
            FROM localidades
            where estado is true
        `)

        res.json({
            ok: true,
            data: result.rows
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}

const obtenerLocalidadesTotales = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM vw_localidades_totales
        `)

        res.json({
            ok: true,
            data: result.rows
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}

const obtenerLocalidadPorId = async (req, res) => {
    const { id } = req.params

    try {
        const query = `
            SELECT id, nombre, codigo_postal, provincia, costo_envio, estado
            FROM localidades
            WHERE id = $1
        `
        const result = await pool.query(query, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({
                ok: false,
                error: "Localidad no encontrada"
            })
        }

        res.json({
            ok: true,
            data: result.rows[0]
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}

const crearLocalidad = async (req, res) => {
    const { nombre, codigo_postal, provincia, costo_envio } = req.body

    try {
        if (!nombre || !codigo_postal || !provincia || !costo_envio) {
            return res.status(400).json({
                ok: false,
                error: "Debe completar los datos obligatorios."
            })
        }

        const queryDuplicado = `
            SELECT id
            FROM localidades
            WHERE LOWER(TRIM(nombre)) = LOWER(TRIM($1))
            AND LOWER(TRIM(provincia)) = LOWER(TRIM($2))
        `
        const duplicado = await pool.query(
            queryDuplicado,
            [nombre, provincia]
        )

        if (duplicado.rows.length > 0) {
            return res.status(409).json({
                ok: false,
                error: "Ya existe una localidad con ese nombre en esa provincia."
            })
        }

        await pool.query("BEGIN")

        const query = `
            INSERT INTO localidades (nombre, codigo_postal, provincia, costo_envio, estado, fecha_alta)
            VALUES ($1, $2, $3, $4, true, now())
            RETURNING id
        `
        const result = await pool.query(
            query,
            [nombre, codigo_postal, provincia, costo_envio]
        )

        const idLocalidad = result.rows[0].id

        // Genero la tarifa de esta localidad para cada transportista existente
        // precio = transportista.costo_envio * localidad.costo_envio
        await pool.query(
            `
            INSERT INTO tarifas (id_transportista, id_localidad, precio)
            SELECT t.id, $1, t.costo_envio * $2
            FROM transportistas t
            `,
            [idLocalidad, costo_envio]
        )

        await pool.query("COMMIT")

        res.status(201).json({
            ok: true,
            message: `Localidad ${idLocalidad} creada correctamente`
        })
    }
    catch (error) {
        await pool.query("ROLLBACK")
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}


const modificarLocalidad = async (req, res) => {
    const { id } = req.params
    const { nombre, codigo_postal, provincia, costo_envio, estado } = req.body

    try {
        const queryDuplicado = `
            SELECT id
            FROM localidades
            WHERE LOWER(TRIM(nombre)) = LOWER(TRIM($1))
            AND LOWER(TRIM(provincia)) = LOWER(TRIM($2))
            AND id != $3
        `
        const duplicado = await pool.query(queryDuplicado, [nombre, provincia, id])

        if (duplicado.rows.length > 0) {
            return res.status(409).json({
                ok: false,
                error: "Ya existe otra localidad con ese nombre en esa provincia."
            })
        }

        await pool.query("BEGIN")

        // Consulto el costo_envio actual ANTES de actualizar
        const costoActual = await pool.query(
            `SELECT costo_envio FROM localidades WHERE id = $1`,
            [id]
        )
        const costoAnterior = Number(costoActual.rows[0]?.costo_envio ?? 0)
        const costoNuevo = Number(costo_envio)
        const cambioElCosto = costoAnterior !== costoNuevo

        const query = `
            UPDATE localidades
            SET nombre = $1,
                codigo_postal = $2,
                provincia = $3,
                costo_envio = $4,
                estado = $5,
                fecha_baja = CASE WHEN $5 = false THEN now() ELSE fecha_baja END
            WHERE id = $6
        `
        await pool.query(query, [nombre, codigo_postal, provincia, costo_envio, estado, id])

        // Solo recalculo tarifas si el costo cambió
        if (cambioElCosto) {
            await pool.query(
                `
                UPDATE tarifas t
                SET precio = tr.costo_envio * $1
                FROM transportistas tr
                WHERE t.id_transportista = tr.id
                AND t.id_localidad = $2
                `,
                [costoNuevo, id]
            )

            await pool.query(
                `
                INSERT INTO tarifas (id_transportista, id_localidad, precio)
                SELECT t.id, $2, t.costo_envio * $1
                FROM transportistas t
                WHERE NOT EXISTS (
                    SELECT 1 FROM tarifas tar
                    WHERE tar.id_transportista = t.id
                    AND tar.id_localidad = $2
                )
                `,
                [costoNuevo, id]
            )
        }

        await pool.query("COMMIT")

        res.json({
            ok: true,
            message: "Localidad modificada correctamente"
        })
    }
    catch (error) {
        await pool.query("ROLLBACK")
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}


const eliminarLocalidad = async (req, res) => {
    const { id } = req.params

    try {
        // Baja lógica, no DELETE físico: direcciones y tarifas
        // tienen FK hacia localidades, un DELETE real rompería esas relaciones.
        const query = `
            UPDATE localidades
            SET estado = false, fecha_baja = now()
            WHERE id = $1
        `
        await pool.query(query, [id])

        res.json({
            ok: true,
            message: "Localidad dada de baja correctamente"
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}


const exportarCSV = async (req, res) => {
    const { localidad, codigoPostal, provincia, estado } = req.query

    try {
        let query = `
            SELECT  nombre,
                    codigo_postal,
                    provincia,
                    costo_envio,
                    TO_CHAR(fecha_alta,'DD/MM/YYYY') fecha_alta,
                    TO_CHAR(fecha_baja,'DD/MM/YYYY') fecha_baja,
                    case when estado is true then 'Activo' else 'Inactivo' end as estado
            FROM localidades
            WHERE 1=1
        `
        const valores = []
        let i = 1

        if (localidad) { query += ` AND nombre ILIKE $${i++}`; valores.push(`%${localidad}%`) }
        if (codigoPostal) { query += ` AND codigo_postal ILIKE $${i++}`; valores.push(`%${codigoPostal}%`) }
        if (provincia) { query += ` AND provincia ILIKE $${i++}`; valores.push(`%${provincia}%`) }
        if (estado) { query += ` AND estado = $${i++}`; valores.push(estado === 'Activo') }

        const result = await pool.query(query, valores)

        const fields = [
            { label: 'Localidad', value: 'nombre' },
            { label: 'Código Postal', value: 'codigo_postal' },
            { label: 'Provincia', value: 'provincia' },
            { label: 'Costo Envío', value: 'costo_envio' },
            { label: 'Fecha Alta', value: 'fecha_alta' },
            { label: 'Fecha Baja', value: 'fecha_baja' },
            { label: 'Estado', value: 'estado' },
        ]

        const datosCSV = result.rows.map(item => ({
            ...item,
            costo_envio: Number(item.costo_envio || 0).toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        }))

        const csv = generarCSV(datosCSV, fields)
        const csvConBOM = '\uFEFF' + csv

        res.header('Content-Type', 'text/csv; charset=utf-8')
        res.attachment(`localidades_${Date.now()}.csv`)

        return res.send(csvConBOM)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error exportando CSV' })
    }
}

const cambiarEstadoLocalidad = async (req, res) => {
    const { id } = req.params

    try {
        const query = `
            UPDATE localidades
            SET estado = NOT estado,
                fecha_baja = CASE WHEN estado = true THEN now() ELSE NULL END
            WHERE id = $1
            RETURNING estado
        `
        const result = await pool.query(query, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({
                ok: false,
                error: "Localidad no encontrada"
            })
        }

        res.json({
            ok: true,
            estado: result.rows[0].estado
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}

export {
    obtenerLocalidades,
    obtenerLocalidadesActivas,
    obtenerLocalidadesTotales,
    obtenerLocalidadPorId,
    crearLocalidad,
    modificarLocalidad,
    eliminarLocalidad,
    cambiarEstadoLocalidad,
    exportarCSV
}

