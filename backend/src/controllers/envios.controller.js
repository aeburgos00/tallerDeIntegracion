import pool from '../config/db.js'

import { Parser } from 'json2csv'

import { generarCSV } from '../utils/exportadorCSV.js';

const obtenerEnvios = async (req,res) => {
    const {
        desde,
        hasta
    } = req.query

    try{
        const query = `
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
            where p.fecha between $1 and $2
        `

        const result = await pool.query(
            query,
            [desde,hasta]
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
};

const obtenerEnvioPorId = async(req, res) => {
  const { id } = req.params

  try{

    const query = `
      select  c.id id_cliente,
              d.descripcion direccion,
              l.id id_localidad,
              t.id id_transportista,
              TO_CHAR(p.fecha,'DD/MM/YYYY') fecha_envio,
              tar.precio tarifa
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
            ok:true,
            data:result.rows[0]
        })
    }
    catch(error){
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
};

const obtenerEnviosPorTransportistas = async (req,res) => {
    const {
        desde,
        hasta
    } = req.query

    try{
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
            [desde,hasta]
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
};

const obtenerEnviosTotales = async (req, res) => {
    const {
        desde,
        hasta
    } = req.query

    try{
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
            ) no_visitados
            from paquetes p
            where p.fecha between $1 and $2
        `

        const result = await pool.query(
            query,
            [desde,hasta]
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

const obtenerEnviosRecientes = async (req,res) => {
    const {
        desde,
        hasta
    } = req.query

    try{

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
};

const exportarCSV = async (req, res) => {
  const {
      desde,
      hasta
  } = req.query
  try {

    const result = await pool.query(
    `
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
    where p.fecha between $1 and $2
    `,
    [desde, hasta]
    )

    const fields = [
      {
        label: 'Código',
        value: 'id_envio'
      },
      {
        label: 'Fecha Envío',
        value: 'fecha_envio'
      },
      {
        label: 'Cliente',
        value: 'cliente'
      },
      {
        label: 'Dirección',
        value: 'direccion'
      },
      {
        label: 'Localidad',
        value: 'localidad'
      },
      {
        label: 'Transportista',
        value: 'transportista'
      },
      {
        label: 'Estado',
        value: 'estado'
      },
      {
        label: 'Tarifa',
        value: 'tarifa'
      },
      {
        label: 'Liquidación',
        value: 'liquidacion'
      }
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

  } catch(error) {
    console.error(error)

    return res.status(500).json({
      message:'Error exportando CSV'
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
    if(
        !id_cliente ||
        !direccion ||
        !id_localidad ||
        !id_transportista ||
        !fecha_envio
    ){
    return res.status(400).json({
        ok:false,
        error:"Debe los datos obligatorios."
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
    const idDireccion = result.rows[0].id
    
    //Si no existe, la cargo
    if(!idDireccion){
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
            [direccion,id_cliente,id_localidad]
            )
        const idDireccion = direccionNueva.rows[0].id
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
        [ fecha_envio, id_cliente, idDireccion,
        id_transportista, 1, tarifa.id ]
    )
    const idPaquete =paqueteResult.rows[0].id

    res.status(201).json({
        ok:true,
        message:`Envío ${idPaquete} creado correctamente`
    })

    //Cierro la transaccion
    await pool.query("COMMIT")

  } catch(error) {
    res.status(500).json({
      ok:false,
      error:error.message
    })
    await pool.query("ROLLBACK")
    throw error
  }

}

export {
  obtenerEnvios, 
  obtenerEnvioPorId, 
  obtenerEnviosPorTransportistas,
  obtenerEnviosTotales,
  obtenerEnviosRecientes,
  exportarCSV,
  crearEnvio
}
