import pool from '../config/db.js'

import { Parser } from 'json2csv'

import { generarCSV } from '../utils/exportadorCSV.js';

const obtenerEnvios = async (req, res) => {
    const {
        desde,
        hasta,
        fechaEnvio,
        cliente,
        direccion,
        localidad,
        transportista,
        estado,
        tarifa,
        liquidacion
    } = req.query

    try {
        let query = `
            select  p.id id_envio,
                    TO_CHAR(p.fecha,'DD/MM/YYYY') fecha_envio,
                    c.nombre_apellido || ' (ID ' || cast(c.ID as varchar) || ')' cliente,
                    d.descripcion direccion,
                    l.nombre localidad,
                    u.nombre_apellido transportista,
                    e.descripcion estado,
                    tar.precio tarifa,
                    case when liq.id is not null then tar.precio else 0 end as liquidacion
            from paquetes p
            join transportistas t on p.id_transportista = t.id
            join usuarios u on u.id = t.id_usuario
            join clientes c on c.id = p.id_cliente
            join direcciones d on d.id = p.id_direccion and d.id_cliente = c.id
            join localidades l on l.id = d.id_localidad
            join estados e on e.id = p.id_estado
            join tarifas tar on tar.id = p.id_tarifa
            left join liquidaciones liq on liq.id_paquete = p.id
            where 1=1
        `
        const parametros = [];

        if (desde && hasta) {
            parametros.push(desde);
            parametros.push(hasta);

            query += `
                AND p.fecha BETWEEN $${parametros.length - 1}
                                AND $${parametros.length}
            `;
        }

        if (fechaEnvio) {
            parametros.push(fechaEnvio);

            query += `
                AND p.fecha = $${parametros.length}
            `;
        }

        if (cliente) {
            parametros.push(`%${cliente.toUpperCase()}%`);

            query += `
                AND upper(c.nombre_apellido) LIKE $${parametros.length}
            `;
        }

        if (direccion) {
            parametros.push(`%${direccion.toUpperCase()}%`);

            query += `
                AND upper(d.descripcion) LIKE $${parametros.length}
            `;
        }

        if (estado) {
            parametros.push(estado);

            query += `
                AND p.id_estado = $${parametros.length}
            `;
        }
        
        if (localidad) {
            parametros.push(`%${localidad.toUpperCase()}%`);

            query += `
                AND upper(l.nombre) LIKE $${parametros.length}
            `;
        }

        if (transportista) {
            parametros.push(`%${transportista.toUpperCase()}%`);

            query += `
                AND upper(u.nombre_apellido) LIKE $${parametros.length}
            `;
        }

        if (tarifa) {
            parametros.push(Number(tarifa));

            query += `
                AND tar.precio = $${parametros.length}
            `;
        }

        if (liquidacion) {
            parametros.push(Number(liquidacion));

            query += `
                AND $${parametros.length} = ( case when liq.id is not null then tar.precio else 0 end)
            `;
        }
                
        const result = await pool.query(
            query,
            parametros
        )

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
};

const obtenerEnvioPorId = async (req, res) => {
    const { id } = req.params

    try {

        const query = `
      select  c.id id_cliente,
              d.descripcion direccion,
              l.id id_localidad,
              t.id id_transportista,
              TO_CHAR(p.fecha,'DD/MM/YYYY') fecha_envio,
              tar.precio tarifa,
              e.id id_estado
      from paquetes p
      join transportistas t on p.id_transportista = t.id
      join usuarios u on u.id = t.id_usuario
      join clientes c on c.id = p.id_cliente
      join direcciones d on d.id = p.id_direccion and d.id_cliente = c.id
      join localidades l on l.id = d.id_localidad
      join estados e on e.id = p.id_estado
      join tarifas tar on tar.id = p.id_tarifa
      left join liquidaciones liq on liq.id_paquete = p.id
      where p.id = $1
    `

        const result = await pool.query(
            query,
            [id]
        )

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
};

const obtenerEnviosPorTransportistas = async (req, res) => {
    const {
        desde,
        hasta
    } = req.query

    try {
        const query = `
            select 
            u.nombre_apellido "Transportista",
            count(1) "EnviosTotales",
            count(
            case when p.id_estado = 1 then 1 end
            ) "EnviosPendientes",
            count(
            case when p.id_estado = 2 then 1 end
            ) "EnviosEntregados",
            count(
            case when p.id_estado = 3 then 1 end
            ) "EnviosFallidos",
            count(
            case when p.id_estado = 4 then 1 end
            ) "EnviosNoRealizados",
            round((
            count(
                case when p.id_estado = 2 then 1 end
                )::numeric /COUNT(1)
            ) * 100,2
            ) "Cumplimiento"
            from transportistas t
            join usuarios u on u.id = t.id_usuario
            join paquetes p on p.id_transportista = t.id
            where p.fecha between $1 and $2
            group by u.nombre_apellido
            order by 7 desc
            limit 4
        `

        const result = await pool.query(
            query,
            [desde, hasta]
        )

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
};

const obtenerEnviosTotales = async (req, res) => {
    const {
        desde,
        hasta
    } = req.query

    try {
        const query = `
            select 
            count(1) total,
            count(
                case when p.id_estado = 1 then 1 end
            ) pendientes,
            count(
                case when p.id_estado = 2 then 1 end
            ) entregados,
            count(
                case when p.id_estado = 3 then 1 end
            ) visitas_fallidas,
            count(
                case when p.id_estado = 4 then 1 end
            ) no_visitados,
            count(
                case when p.id_estado = 5 then 1 end
            ) cancelados 
            from paquetes p
            where p.fecha between $1 and $2
        `

        const result = await pool.query(
            query,
            [desde, hasta]
        )

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

const obtenerEnviosRecientes = async (req, res) => {
    const {
        desde,
        hasta
    } = req.query

    try {

        const query = `
            select 
                p.id id_envio,
                TO_CHAR(p.fecha,'DD/MM/YYYY') fecha_envio,
                c.nombre_apellido cliente,
                d.descripcion || ', ' || l.nombre direccion,
                u.nombre_apellido transportista,
                ta.id id_tarifa,
                e.descripcion estado
            from paquetes p
            join clientes c on c.id = p.id_cliente
            join direcciones d on d.id = p.id_direccion and d.id_cliente = c.id
            join localidades l on l.id = d.id_localidad
            join transportistas t on t.id = p.id_transportista
            join usuarios u on t.id_usuario = u.id
            join estados e on e.id = p.id_estado
            join tarifas ta on ta.id = p.id_tarifa
            where p.fecha between $1 and $2
            order by p.fecha desc
            limit 4
        `

        const result = await pool.query(
            query,
            [desde, hasta]
        )

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
};

const obtenerEnviosPorTransportistaId = async (req, res) => {
    const { id } = req.params
    const { cliente, direccion, localidad, estado, fecha } = req.query

    try {
        let query = `
      select  p.id id_envio,
              TO_CHAR(p.fecha,'DD/MM/YYYY') fecha_envio,
              c.nombre_apellido cliente,
              d.descripcion direccion,
              l.nombre localidad,
              e.id id_estado,
              e.descripcion estado,
              tar.precio tarifa
      from paquetes p
      join transportistas t on t.id = p.id_transportista
      join clientes c on c.id = p.id_cliente
      join direcciones d on d.id = p.id_direccion and d.id_cliente = c.id
      join localidades l on l.id = d.id_localidad
      join estados e on e.id = p.id_estado
      join tarifas tar on tar.id = p.id_tarifa
      where t.id_usuario = $1
    `
        const valores = [id]
        let i = 2

        if (cliente) { query += ` and c.nombre_apellido ilike $${i++}`; valores.push(`%${cliente}%`) }
        if (direccion) { query += ` and d.descripcion ilike $${i++}`; valores.push(`%${direccion}%`) }
        if (localidad) { query += ` and l.nombre ilike $${i++}`; valores.push(`%${localidad}%`) }
        if (estado) { query += ` and p.id_estado = $${i++}`; valores.push(estado) }
        if (fecha) { query += ` and p.fecha = $${i++}`; valores.push(fecha) }

        query += ` order by p.fecha desc`

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

const exportarCSV = async (req, res) => {
    const {
        desde,
        hasta,
        fechaEnvio,
        cliente,
        direccion,
        localidad,
        transportista,
        estado,
        tarifa,
        liquidacion
    } = req.query

    try {
        let query = `
            select  p.id id_envio,
                    TO_CHAR(p.fecha,'DD/MM/YYYY') fecha_envio,
                    c.nombre_apellido || ' (ID ' || cast(c.ID as varchar) || ')' cliente,
                    d.descripcion direccion,
                    l.nombre localidad,
                    u.nombre_apellido transportista,
                    e.descripcion estado,
                    tar.precio tarifa,
                    case when liq.id is not null then tar.precio else 0 end as liquidacion
            from paquetes p
            join transportistas t on p.id_transportista = t.id
            join usuarios u on u.id = t.id_usuario
            join clientes c on c.id = p.id_cliente
            join direcciones d on d.id = p.id_direccion and d.id_cliente = c.id
            join localidades l on l.id = d.id_localidad
            join estados e on e.id = p.id_estado
            join tarifas tar on tar.id = p.id_tarifa
            left join liquidaciones liq on liq.id_paquete = p.id
            where 1=1
        `
        const parametros = [];

        if (desde && hasta) {
            parametros.push(desde);
            parametros.push(hasta);

            query += `
                AND p.fecha BETWEEN $${parametros.length - 1}
                                AND $${parametros.length}
            `;
        }

        if (fechaEnvio) {
            parametros.push(fechaEnvio);

            query += `
                AND p.fecha = $${parametros.length}
            `;
        }

        if (cliente) {
            parametros.push(`%${cliente.toUpperCase()}%`);

            query += `
                AND upper(c.nombre_apellido) LIKE $${parametros.length}
            `;
        }

        if (direccion) {
            parametros.push(`%${direccion.toUpperCase()}%`);

            query += `
                AND upper(d.descripcion) LIKE $${parametros.length}
            `;
        }

        if (estado) {
            parametros.push(estado);

            query += `
                AND p.id_estado = $${parametros.length}
            `;
        }
        
        if (localidad) {
            parametros.push(`%${localidad.toUpperCase()}%`);

            query += `
                AND upper(l.nombre) LIKE $${parametros.length}
            `;
        }

        if (transportista) {
            parametros.push(`%${transportista.toUpperCase()}%`);

            query += `
                AND upper(u.nombre_apellido) LIKE $${parametros.length}
            `;
        }

        if (tarifa) {
            parametros.push(Number(tarifa));

            query += `
                AND tar.precio = $${parametros.length}
            `;
        }

        if (liquidacion) {
            parametros.push(Number(liquidacion));

            query += `
                AND $${parametros.length} = ( case when liq.id is not null then tar.precio else 0 end)
            `;
        }
                
        const result = await pool.query(
            query,
            parametros
        )

        const fields = [
            { label: 'Código', value: 'id_envio' },
            { label: 'Fecha Envío', value: 'fecha_envio' },
            { label: 'Cliente', value: 'cliente' },
            { label: 'Dirección', value: 'direccion' },
            { label: 'Localidad', value: 'localidad' },
            { label: 'Transportista', value: 'transportista' },
            { label: 'Estado', value: 'estado' },
            { label: 'Tarifa', value: 'tarifa' },
            { label: 'Liquidación', value: 'liquidacion' }
        ]

        const datosCSV = result.rows.map(item => ({
            ...item,
            tarifa: Number(item.tarifa || 0).toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
            liquidacion: Number(item.liquidacion || 0).toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        }))

        const csv = generarCSV(
            datosCSV,
            fields
        )

        const csvConBOM = '\uFEFF' + csv

        res.header(
            'Content-Type',
            'text/csv; charset=utf-8'
        )
        res.attachment(
            `envios_${Date.now()}.csv`
        )

        return res.send(csvConBOM)

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            message: 'Error exportando CSV'
        })
    }
}

//POST
const crearEnvio = async (req, res) => {
    const {
        id_cliente,
        direccion,
        id_localidad,
        id_transportista,
        fecha_envio,
        id_tarifa
    } = req.body

    try {
        //Validaciones
        if (
            !id_cliente ||
            !direccion ||
            !id_localidad ||
            !id_transportista ||
            !fecha_envio
        ) {
            return res.status(400).json({
                ok: false,
                error: "Debe los datos obligatorios."
            })
        }

        //Abro la transaccion
        await pool.query("BEGIN")

        //Busco la direccion a ver si existe
        const query = `
        SELECT id
        FROM direcciones
        WHERE descripcion = $1
        AND id_cliente = $2
        AND id_localidad = $3
    `
        const result = await pool.query(
            query,
            [direccion, id_cliente, id_localidad]
        )

        let idDireccion = result?.rows[0]?.id || null

        //Si no existe, la cargo
        if (!idDireccion) {
            const queryInsertDireccion = `
            INSERT INTO direcciones(
            descripcion,
            id_cliente,
            id_localidad
            )
            VALUES(
            $1,
            $2,
            $3
            )
            RETURNING id
        `
            const direccionNueva = await pool.query(
                queryInsertDireccion,
                [direccion, id_cliente, id_localidad]
            )
            idDireccion = direccionNueva.rows[0].id
        }

        //Agrego el nuevo envio
        const queryInsertPaquete = `
        INSERT INTO paquetes(
            fecha,
            id_cliente,
            id_direccion,
            id_transportista,
            id_estado,
            id_tarifa
        )
        VALUES(
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
        )
        RETURNING id
    `
        const paqueteResult =
            await pool.query(
                queryInsertPaquete,
                [fecha_envio, id_cliente, idDireccion,
                    id_transportista, 1, id_tarifa]
            )

        const nuevoEnvio = paqueteResult.rows[0]
        const idPaquete = nuevoEnvio.id

        //Cierro la transaccion
        await pool.query("COMMIT")

        res.status(201).json({
            ok: true,
            data: nuevoEnvio,
            message: `Envío ${idPaquete} creado correctamente`
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
        await pool.query("ROLLBACK")
        throw error
    }

}

//PUT
const modificarEnvio = async (req, res) => {
    const { id } = req.params
    const {
        id_transportista,
        fecha_envio,
        id_estado
    } = req.body

    try {
        //Validaciones
        if (
            !id_transportista ||
            !fecha_envio ||
            !id_estado
        ) {
            return res.status(400).json({
                ok: false,
                error: "Debe los datos obligatorios."
            })
        }

        await pool.query("BEGIN")

        const queryTarifa = `
        SELECT id
        FROM tarifas
        WHERE id_transportista = $1
        `

        const tarifa = 
            await pool.query(
                queryTarifa,
                [id_transportista]
            )
        
        let id_tarifa = tarifa?.rows[0]?.id || null
        
        const queryUpdate = `
            UPDATE paquetes
            SET
                fecha = $1,
                id_transportista = $2,
                id_estado = $3,
                id_tarifa = $4
            WHERE id = $5
            RETURNING id
        `
        const paqueteResult =
            await pool.query(
                queryUpdate,
                [fecha_envio, id_transportista, id_estado, id_tarifa, id]
            )

        await pool.query("COMMIT")

        if (paqueteResult.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                error: "Envío no encontrado"
            })
        }

        res.status(200).json({
            ok: true,
            message: `Envío ${id} modificado correctamente`
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
        await pool.query("ROLLBACK")
        throw error
    }

}

const cancelarEnvio = async (req, res) => {
    const { id } = req.params

    try {
        const paqueteResult = await pool.query(
            `
      SELECT
        id,
        id_estado
      FROM paquetes
      WHERE id = $1
      `,
            [id]
        )
        if (paqueteResult.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                error: "Envío no encontrado"
            })
        }

        const paquete = paqueteResult.rows[0]

        const estadoCancelado = await pool.query(
            `
    SELECT id
    FROM estados
    WHERE UPPER(descripcion) = 'CANCELADO'
    `
        )
        const idEstadoCancelado = estadoCancelado.rows[0].id
        // Ya cancelado
        if (paquete.id_estado === idEstadoCancelado) {
            return res.status(400).json({
                ok: false,
                error: "El envío ya se encuentra cancelado"
            })
        }

        const estadoEntregado = await pool.query(
            `
    SELECT id
    FROM estados
    WHERE UPPER(descripcion) = 'ENTREGADO'
    `
        )
        const idEstadoEntregado = estadoEntregado.rows[0].id
        // Entregado
        if (paquete.id_estado === idEstadoEntregado) {
            return res.status(400).json({
                ok: false,
                error: "No se puede cancelar un envío entregado"
            })
        }

        // Verifico si fue liquidado
        const liquidacionResult = await pool.query(
            `
      SELECT 1
      FROM liquidaciones
      WHERE id_paquete = $1
      LIMIT 1
      `,
            [id]
        )
        if (liquidacionResult.rowCount > 0) {
            return res.status(400).json({
                ok: false,
                error: "No se puede cancelar un envío liquidado"
            })
        }

        await pool.query(
            `
      UPDATE paquetes
      SET id_estado = $1
      WHERE id = $2
      `,
            [idEstadoCancelado, id]
        )

        return res.status(200).json({
            ok: true,
            message: `Envío ${id} cancelado correctamente`
        })

    } catch (error) {

        return res.status(500).json({
            ok: false,
            error: error.message
        })

    }
}

const cambiarEstadoEnvio = async (req, res) => {
    const { id } = req.params
    const { id_estado } = req.body

    try {
        if (!id_estado) {
            return res.status(400).json({
                ok: false,
                error: "Debe indicar el nuevo estado"
            })
        }

        const result = await pool.query(
            `UPDATE paquetes SET id_estado = $1 WHERE id = $2 RETURNING id`,
            [id_estado, id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                error: "Envío no encontrado"
            })
        }

        res.json({
            ok: true,
            message: `Estado del envío ${id} actualizado correctamente`
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
    obtenerEnvios,
    obtenerEnvioPorId,
    obtenerEnviosPorTransportistas,
    obtenerEnviosTotales,
    obtenerEnviosRecientes,
    obtenerEnviosPorTransportistaId,
    exportarCSV,
    crearEnvio,
    modificarEnvio,
    cancelarEnvio,
    cambiarEstadoEnvio
}
