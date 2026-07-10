import pool from '../config/db.js'

import { Parser } from 'json2csv'

import { generarCSV } from '../utils/exportadorCSV.js';

import bcrypt from 'bcrypt'

const obtenerTransportistas = async (req, res) => {
  const {
      nombre,
      dni,
      usuario,
      costo_envio,
      estado
  } = req.query

  try {

    let query = `
      SELECT  t.id id,
              u.nombre_apellido nombre,
              u.usuario usuario,
              u.dni dni,
              u.correo correo,
              TO_CHAR(fecha_alta,'DD/MM/YYYY') fecha_alta,
              TO_CHAR(fecha_baja,'DD/MM/YYYY') fecha_baja,
              CASE WHEN u.usuario_activo is true then 'Activo' else 'Inactivo' end estado,
              t.costo_envio costo_envio
      FROM transportistas t
      JOIN usuarios u on t.id_usuario = u.id
      where u.tipo_usuario = 'TRANSPORTISTA'
    `

    const parametros = [];

    if (nombre) {
        parametros.push(`%${nombre.toUpperCase()}%`)
        query += `
            AND upper(u.nombre_apellido) LIKE $${parametros.length}
        `;
    }
    
    if (dni) {
        parametros.push(dni)
        query += `
            AND u.dni = $${parametros.length}
        `;
    }

    if (usuario) {
        parametros.push(`%${usuario.toUpperCase()}%`)
        query += `
            AND upper(u.usuario) LIKE $${parametros.length}
        `;
    }

    if (costo_envio) {
        parametros.push(Number(costo_envio))
        query += `
            AND t.costo_envio = $${parametros.length}
        `;
    }
    
    if(estado) {
      parametros.push(estado.toUpperCase())
      query += `
          AND $${parametros.length} = ( CASE WHEN u.usuario_activo is true then 'ACTIVO' else 'INACTIVO' end)
      `;
    }
    
    query += `ORDER BY t.id`

    const result = await pool.query(
        query,
        parametros
    )

    res.json({
      ok: true,
      data: result.rows
    })

  } catch (error) {

    res.status(500).json({
      ok: false,
      error: error.message
    })

  }
}

const obtenerTransportistaPorId = async (req, res) => {
    const { id } = req.params

    try {

        const query = `
          select  u.usuario usuario,
                  '***' contraseña,
                  u.nombre_apellido nombre_apellido,              
                  u.dni dni,
                  u.correo correo,
                  t.costo_envio costo_envio,
                  CASE WHEN u.usuario_activo is true then 'Activo' else 'Inactivo' end estado
          FROM transportistas t
          JOIN usuarios u on t.id_usuario = u.id
          where u.tipo_usuario = 'TRANSPORTISTA'
          and t.id = $1
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

const obtenerTransportistasActivos = async (req, res) => {

  try {
    const result = await pool.query(`
      SELECT  t.id id,
              u.nombre_apellido nombre,
              u.usuario usuario,
              u.dni dni,
              TO_CHAR(fecha_alta,'DD/MM/YYYY') fecha_alta,
              TO_CHAR(fecha_baja,'DD/MM/YYYY') fecha_baja,
              CASE WHEN u.usuario_activo is true then 'Activo' else 'Inactivo' end estado,
              t.costo_envio costo_envio
      FROM transportistas t
      JOIN usuarios u on t.id_usuario = u.id
      where u.tipo_usuario = 'TRANSPORTISTA'
      AND u.usuario_activo is true
      ORDER BY t.id
    `)

    res.json({
      ok: true,
      data: result.rows
    })

  } catch (error) {

    res.status(500).json({
      ok: false,
      error: error.message
    })

  }
}

const obtenerTransportistasTotales = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        count(1) as total,
        count(case when u.usuario_activo is true then 1 end) activos,
        count(case when u.usuario_activo is false then 1 end) inactivos,
        avg(t.costo_envio) costo_promedio
      FROM transportistas t
      join usuarios u on t.id_usuario = u.id
      where u.tipo_usuario = 'TRANSPORTISTA'
    `)

    res.json({
      ok: true,
      data: result.rows
    })

  } catch (error) {

    res.status(500).json({
      ok: false,
      error: error.message
    })

  }
}

const exportarCSV = async (req, res) => {
    const {
        nombre,
        dni,
        usuario,
        costo_envio,
        estado
    } = req.query

    try {

      let query = `
        SELECT  t.id id,
                u.nombre_apellido nombre,
                u.usuario usuario,
                u.dni dni,
                u.correo correo,
                TO_CHAR(fecha_alta,'DD/MM/YYYY') fecha_alta,
                TO_CHAR(fecha_baja,'DD/MM/YYYY') fecha_baja,
                CASE WHEN u.usuario_activo is true then 'Activo' else 'Inactivo' end estado,
                t.costo_envio costo_envio
        FROM transportistas t
        JOIN usuarios u on t.id_usuario = u.id
        where u.tipo_usuario = 'TRANSPORTISTA'
      `

      const parametros = [];

      if (nombre) {
          parametros.push(`%${nombre.toUpperCase()}%`)
          query += `
              AND upper(u.nombre_apellido) LIKE $${parametros.length}
          `;
      }
      
      if (dni) {
          parametros.push(dni)
          query += `
              AND u.dni = $${parametros.length}
          `;
      }

      if (usuario) {
          parametros.push(`%${usuario.toUpperCase()}%`)
          query += `
              AND upper(u.usuario) LIKE $${parametros.length}
          `;
      }

      if (costo_envio) {
          parametros.push(Number(costo_envio))
          query += `
              AND t.costo_envio = $${parametros.length}
          `;
      }
      
      if(estado) {
        parametros.push(estado.toUpperCase())
        query += `
            AND $${parametros.length} = ( CASE WHEN u.usuario_activo is true then 'ACTIVO' else 'INACTIVO' end)
        `;
      }
      
      const result = await pool.query(
          query,
          parametros
      )

      const fields = [
          { label: 'Código', value: 'id' },
          { label: 'Nombre Completo', value: 'nombre' },
          { label: 'Usuario', value: 'usuario' },
          { label: 'DNI', value: 'dni' },
          { label: 'Correo', value: 'correo' },
          { label: 'Fecha Alta', value: 'fecha_alta' },
          { label: 'Fecha Baja', value: 'fecha_baja' },
          { label: 'Estado', value: 'estado' },
          { label: 'Costo Envío', value: 'costo_envio' }
      ]
      const datosCSV = result.rows.map(item => ({
          ...item,
          costo_envio: Number(item.costo_envio || 0).toLocaleString('es-AR', {
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
const crearTransportista = async (req, res) => {
    const {
      usuario,
      contraseña,
      nombre_apellido,
      dni,
      correo,
      costo_envio
    } = req.body

    try {
        //Validaciones
        if (
            !usuario ||
            !contraseña ||
            !nombre_apellido ||
            !dni ||
            !correo ||
            !costo_envio
          ) {
            return res.status(400).json({
                ok: false,
                error: "Debe los datos obligatorios."
            })
        }

        const dni_val = Number(dni);

        if(!Number.isInteger(dni_val)) {
            return res.status(400).json({
                ok: false,
                error: "El DNI debe ser un valor numerico entero."
            })
        }

        if(dni_val <= 0) {
            return res.status(400).json({
                ok: false,
                error: "El DNI debe ser mayor a cero."
            })
        }

        const costo_envio_val = Number(costo_envio);

        if( Number.isNaN(costo_envio_val)) {
            return res.status(400).json({
                ok: false,
                error: "El Costo de Envio debe ser un valor numerico."
            })
        }

        if(costo_envio_val <= 0) {
            return res.status(400).json({
                ok: false,
                error: "El costo_envio debe ser mayor a cero."
            })
        }

        const queryDNI = `
            SELECT id
            FROM usuarios
            WHERE dni = $1
        `
        const resultDNI = await pool.query(queryDNI, [dni])

        if (resultDNI.rows.length > 0) {            
            return res.status(400).json({
                ok: false,
                error: "El DNI ya se encuentra registrado."
            })
        }

        const queryUsuario = `
            SELECT id
            FROM usuarios
            WHERE usuario = $1
        `
        const resultUsuario = await pool.query(queryUsuario, [usuario])

        if (resultUsuario.rows.length > 0) {
            return res.status(400).json({
                ok: false,
                error: "El usuario ya se encuentra registrado."
            })
        }

        //Abro la transaccion
        await pool.query("BEGIN")

        const hoy = new Date();

        const queryInsertUsuario = `
            INSERT INTO usuarios(
                usuario,
                contraseña,
                nombre_apellido,
                dni,
                correo,
                tipo_usuario,
                fecha_alta,
                fecha_baja,
                usuario_activo
            )
            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9
            )
            RETURNING id
        `

        const contraseñaHash = await bcrypt.hash(contraseña, 10)

        const parametros = [
          usuario,
          contraseñaHash,
          nombre_apellido,
          dni,
          correo,
          'TRANSPORTISTA',
          hoy,
          null,
          true
        ]

        const usuarioResult =
            await pool.query(
                queryInsertUsuario,
                parametros
            )

        const nuevoUsuario = usuarioResult.rows[0]
        const idUsuario = nuevoUsuario.id

        const queryInsertTransportista = `
            INSERT INTO transportistas(
                costo_envio,
                id_usuario
            )
            VALUES(
                $1,
                $2
            )
            RETURNING id
        `
        
        const transportistaResult =
            await pool.query(
                queryInsertTransportista,
                [costo_envio, idUsuario]
            )

        const nuevoTransportista = transportistaResult.rows[0]
        const idTransportista = nuevoTransportista.id
        
        await pool.query(
            `
            INSERT INTO tarifas (id_transportista, id_localidad, precio)
            SELECT $1, l.id, l.costo_envio * $2
            FROM localidades l
            `,
            [idTransportista, costo_envio]
        )

        //Cierro la transaccion
        await pool.query("COMMIT")

        res.status(201).json({
            ok: true,
            data: nuevoTransportista,
            message: `Transportista ${idTransportista} creado correctamente.`
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
const modificarTransportista = async (req, res) => {
    const { id } = req.params
    const {
      usuario,
      contraseña,
      nombre_apellido,
      dni,
      correo,
      costo_envio,
      estado
    } = req.body

    try {
        //Validaciones
        if (
            !usuario ||
            !contraseña ||
            !nombre_apellido ||
            !dni ||
            !correo ||
            !costo_envio ||
            !estado
        ) {
            return res.status(400).json({
                ok: false,
                error: "Debe los datos obligatorios."
            })
        }

        const dni_val = Number(dni);

        if(!Number.isInteger(dni_val)) {
            return res.status(400).json({
                ok: false,
                error: "El DNI debe ser un valor numerico entero."
            })
        }

        if(dni_val <= 0) {
            return res.status(400).json({
                ok: false,
                error: "El DNI debe ser mayor a cero."
            })
        }

        const costo_envio_val = Number(costo_envio);

        if( Number.isNaN(costo_envio_val)) {
            return res.status(400).json({
                ok: false,
                error: "El Costo de Envio debe ser un valor numerico."
            })
        }

        if(costo_envio_val <= 0) {
            return res.status(400).json({
                ok: false,
                error: "El costo_envio debe ser mayor a cero."
            })
        }

        const transportistaResult =
            await pool.query(
                `
                  SELECT  id,
                          costo_envio,
                          id_usuario
                  FROM transportistas
                  WHERE id = $1
                `,
                [id]
            )
        
        if (transportistaResult.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                error: "Transportista no encontrado."
            })
        }

        const transportista = transportistaResult.rows[0]

        const queryDNI = `
            SELECT id
            FROM usuarios
            WHERE dni = $1
            and id <> $2
        `
        const resultDNI = await pool.query(queryDNI, [dni, transportista.id_usuario])

        if (resultDNI.rows.length > 0) {
            return res.status(400).json({
                ok: false,
                error: "El DNI ya se encuentra registrado."
            })
        }

        const queryUsuario = `
            SELECT id
            FROM usuarios
            WHERE usuario = $1
            AND id <> $2
        `
        const resultUsuario = await pool.query(queryUsuario, [usuario, transportista.id_usuario])

        if (resultUsuario.rows.length > 0) {
            return res.status(400).json({
                ok: false,
                error: "El usuario ya se encuentra registrado."
            })
        }

        await pool.query("BEGIN")
        
        let queryUpdateUsuario = `
            UPDATE usuarios
            SET usuario         = $1,
                nombre_apellido = $2,
                dni             = $3,
                correo          = $4
        `
        const parametros = [
          usuario,
          nombre_apellido,
          dni,
          correo,
        ]

        if(estado === 'Activo'){
            parametros.push(true); //estado
            parametros.push(null); //fecha baja            
        } else{
            const hoy = new Date();
            parametros.push(false); //estado
            parametros.push(hoy); //fecha baja
        }
        queryUpdateUsuario += `
                , usuario_activo =  $${parametros.length - 1}
                , fecha_baja = $${parametros.length}
            `;

        if(contraseña !== "***"){
            const contraseñaHash = await bcrypt.hash(contraseña, 10)
            parametros.push(contraseñaHash);

            queryUpdateUsuario += `
                , contraseña = $${parametros.length}
            `;
        }
        
        parametros.push(transportista.id_usuario);
        queryUpdateUsuario += `
                WHERE id = $${parametros.length}
        `;

        await pool.query(
                queryUpdateUsuario,
                parametros
        )
        
        if(costo_envio!==transportista.costo_envio){
            //actualizo al transportista
            await pool.query(
                `
                    UPDATE transportistas
                    SET costo_envio = $1
                    WHERE ID = $2
                `,
                [costo_envio, id]
            )

            //recalculo tarifas
            await pool.query(
                `
                UPDATE tarifas t
                SET precio = l.costo_envio * $1
                FROM localidades l
                WHERE t.id_localidad = l.id
                AND t.id_transportista = $2
                `,
                [costo_envio, id]
            )

            await pool.query(
                `
                INSERT INTO tarifas (id_transportista, id_localidad, precio)
                SELECT $1, l.id, l.costo_envio * $2
                FROM localidades l
                WHERE NOT EXISTS (
                    SELECT 1 FROM tarifas tar
                    WHERE tar.id_localidad = l.id
                    AND tar.id_transportista = $1
                )
                `,
                [id, costo_envio]
            )
        }

        await pool.query("COMMIT")        

        res.status(200).json({
            ok: true,
            message: `Transportista ${id} modificado correctamente.`
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

//DELETE
const eliminarTransportista = async (req, res) => {
    const { id } = req.params

    try {
        const transportistaResult = await pool.query(
          `
          SELECT
            t.id id_transportista,
            u.id id_usuario,
            u.usuario_activo estado
          FROM transportistas t
          JOIN usuarios u on t.id_usuario = u.id
          where u.tipo_usuario = 'TRANSPORTISTA'
          and t.id = $1
          `,
          [id]
        )

        if (transportistaResult.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                error: "Transportista no encontrado"
            })
        }

        const transportista = transportistaResult.rows[0]

        //ya dado de baja
        if (!transportista.estado) {
            return res.status(400).json({
                ok: false,
                error: "El transportista ya se encuentra dado de baja."
            })
        }

        //Verificar si no tiene paquetes pendientes (1) o no visitados (4)
        const queryPaquetes = `
            SELECT id
            FROM paquetes
            WHERE id_transportista = $1
            and id_estado in (1, 4)
        `
        const resultPaquetes = await pool.query(queryPaquetes, [id])

        if (resultPaquetes.rows.length > 0) {
            return res.status(400).json({
                ok: false,
                error: "No se puede dar de baja a un transportista con envios pendientes o no visitados."
            })
        }

        await pool.query("BEGIN")

        const hoy = new Date();

        await pool.query(
          `
          UPDATE usuarios
          SET usuario_activo = $1,
              fecha_baja = $2
          WHERE id = $3
          `,
          [false, hoy, transportista.id_usuario]
        )

        await pool.query("COMMIT")

        return res.status(200).json({
            ok: true,
            message: `Transportista ${id} dado de baja correctamente.`
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: error.message
        })
        await pool.query("ROLLBACK")
        throw error
    }
}

export {
  obtenerTransportistas, 
  obtenerTransportistaPorId,
  obtenerTransportistasActivos,
  obtenerTransportistasTotales,
  exportarCSV,
  crearTransportista,
  modificarTransportista,
  eliminarTransportista
}