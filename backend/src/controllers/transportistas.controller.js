import pool from '../config/db.js'

const obtenerTransportistas = async (req, res) => {
  const {
    nombre,
    usuario,
    dni,
    estado,
    fechaAlta,
  } = req.query;

  try {
    const condiciones = [];
    const valores = [];

    if (nombre) {
      valores.push(`%${nombre}%`);
      condiciones.push(`u.nombre_apellido ILIKE $${valores.length}`);
    }

    if (usuario) {
      valores.push(`%${usuario}%`);
      condiciones.push(`u.usuario ILIKE $${valores.length}`);
    }

    if (dni) {
      valores.push(`%${dni}%`);
      condiciones.push(`CAST(u.dni AS TEXT) ILIKE $${valores.length}`);
    }

    if (estado) {
      valores.push(estado === "Activo");
      condiciones.push(`u.usuario_activo = $${valores.length}`);
    }

    if (fechaAlta) {
      valores.push(fechaAlta);
      condiciones.push(`DATE(u.fecha_alta) = $${valores.length}`);
    }

    const where =
      condiciones.length > 0
        ? `WHERE ${condiciones.join(" AND ")}`
        : "";

    const result = await pool.query(
      `
      SELECT
        t.id AS id,
        u.nombre_apellido AS nombre,
        u.usuario AS usuario,
        u.dni AS dni,
        TO_CHAR(u.fecha_alta, 'DD/MM/YYYY') AS fecha_alta,
        TO_CHAR(u.fecha_baja, 'DD/MM/YYYY') AS fecha_baja,
        CASE
          WHEN u.usuario_activo THEN 'Activo'
          ELSE 'Inactivo'
        END AS estado,
        t.costo_envio AS costo_envio
      FROM transportistas t
      JOIN usuarios u
        ON t.id_usuario = u.id
      ${where}
      ORDER BY t.id
      `,
      valores
    );

    res.json({
      ok: true,
      data: result.rows,
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
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
      where u.usuario_activo is true
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

///para filtros voy a probar otra forma de hacerlo, con un solo endpoint y query params, para no tener que hacer tantos endpoints
//obtenerTransportistasInactivos
/*const obtenerTransportistasInactivos = async (req, res) => {

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
      where u.usuario_activo is false
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
}*/
//obtenerTransportistasTotales
const obtenerTransportistasTotales = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
        COUNT(*) total,
        COUNT(*) FILTER (WHERE u.usuario_activo = true) activos,
        COUNT(*) FILTER (WHERE u.usuario_activo = false) inactivos,
        ROUND(AVG(t.costo_envio),2) tarifa_promedio
      FROM transportistas t
      JOIN usuarios u
        ON u.id = t.id_usuario
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
//obtenerTransportistaPorId la dejo aunque no se si la voy a usar
const obtenerTransportistaPorId = async (req, res) => {
  const { id } = req.params;

  try {

    const result = await pool.query(
      `
      SELECT
        t.id AS id,
        u.nombre_apellido AS nombre,
        u.usuario AS usuario,
        u.dni AS dni,
        TO_CHAR(u.fecha_alta, 'DD/MM/YYYY') AS fecha_alta,
        TO_CHAR(u.fecha_baja, 'DD/MM/YYYY') AS fecha_baja,
        CASE
          WHEN u.usuario_activo THEN 'Activo'
          ELSE 'Inactivo'
        END AS estado,
        t.costo_envio AS costo_envio
      FROM transportistas t
      JOIN usuarios u
        ON t.id_usuario = u.id
      WHERE t.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: "Transportista no encontrado"
      });
    }

    res.json({
      ok: true,
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};
/// para el ABM
//crearTransportista(formulario)
const crearTransportista = async (req, res) => {
  const {
    usuario,
    contrasena,
    nombre,
    dni,
    correo,
    costo_envio,
  } = req.body;

  const tipo_usuario = "transportista";

  try {

    /// VALIDACIONES

    if (
      costo_envio == null ||
      !contrasena?.trim() ||
      !correo?.trim() ||
      !usuario?.trim() ||
      !nombre?.trim() ||
      dni == null
    ) {
      return res.status(400).json({
        ok: false,
        error: "Debe completar todos los datos obligatorios."
      });
    }

    if (!correo.includes("@")) {
      return res.status(400).json({
        ok: false,
        error: "El correo electrónico no es válido."
      });
    }

    if (isNaN(dni)) {
      return res.status(400).json({
        ok: false,
        error: "El DNI debe ser numérico."
      });
    }

    /// INICIO DE TRANSACCIÓN

    await pool.query("BEGIN");

    // Verifico usuario existente
    const usuarioExistente = await pool.query(
      `
      SELECT id
      FROM usuarios
      WHERE usuario = $1
      `,
      [usuario]
    );

    if (usuarioExistente.rows.length > 0) {
      await pool.query("ROLLBACK");

      return res.status(409).json({
        ok: false,
        error: "El nombre de usuario ya existe."
      });
    }

    // Verifico correo existente
    const correoExistente = await pool.query(
      `
      SELECT id
      FROM usuarios
      WHERE correo = $1
      `,
      [correo]
    );

    if (correoExistente.rows.length > 0) {
      await pool.query("ROLLBACK");

      return res.status(409).json({
        ok: false,
        error: "El correo ya se encuentra registrado."
      });
    }

    //verifico duplicado
    const transportistaExistente = await pool.query(
      `
  SELECT t.id
  FROM transportistas t
  JOIN usuarios u
    ON t.id_usuario = u.id
  WHERE
    UPPER(TRIM(u.nombre_apellido)) = UPPER(TRIM($1))
    AND u.dni = $2
  `,
      [nombre, dni]
    );

    if (transportistaExistente.rows.length > 0) {
      await pool.query("ROLLBACK");
      return res.status(409).json({
        ok: false,
        error: "Ya existe un transportista con ese nombre y DNI."
      });
    }

    /// CREAR USUARIO

    const resultUsuario = await pool.query(
      `
      INSERT INTO usuarios (
    usuario,
    contraseña,
    nombre_apellido,
    dni,
    correo,
    tipo_usuario
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
)
RETURNING id
`,
      [
        usuario,
        contrasena,
        nombre,
        dni,
        correo,
        tipo_usuario
      ]
    );

    const idUsuario = resultUsuario.rows[0].id;

    /// CREAR TRANSPORTISTA

    const resultTransportista = await pool.query(
      `
      INSERT INTO transportistas (
        id_usuario,
        costo_envio
      )
      VALUES (
        $1,
        $2
      )
      RETURNING id
      `,
      [
        idUsuario,
        costo_envio
      ]
    );

    const idTransportista = resultTransportista.rows[0].id;

    /// CONFIRMAR TRANSACCIÓN

    await pool.query("COMMIT");

    res.status(201).json({
      ok: true,
      data: {
        id_transportista: idTransportista,
        id_usuario: idUsuario
      }
    });

  } catch (error) {

    await pool.query("ROLLBACK");

    res.status(500).json({
      ok: false,
      error: error.message
    });

  }
};

//actualizarTransportista(formulario)
const actualizarTransportista = async (req, res) => {
  const { id } = req.params;

  const {
    usuario,
    contraseña,
    nombre,
    dni,
    correo,
    costo_envio,
    fecha_baja
  } = req.body;

  try {

    await pool.query("BEGIN");

    // Obtener datos actuales del transportista
    const transportista = await pool.query(
      `
      SELECT
        t.id,
        t.id_usuario,
        u.fecha_alta
      FROM transportistas t
      JOIN usuarios u
        ON u.id = t.id_usuario
      WHERE t.id = $1
      `,
      [id]
    );

    if (transportista.rows.length === 0) {
      await pool.query("ROLLBACK");

      return res.status(404).json({
        ok: false,
        error: "Transportista no encontrado."
      });
    }

    const idUsuario = transportista.rows[0].id_usuario;
    const fechaAlta = transportista.rows[0].fecha_alta;

    //////////////////////////////
    // VALIDACIONES
    //////////////////////////////

    if (correo && !correo.includes("@")) {
      await pool.query("ROLLBACK");

      return res.status(400).json({
        ok: false,
        error: "Correo inválido."
      });
    }

    if (dni && isNaN(dni)) {
      await pool.query("ROLLBACK");

      return res.status(400).json({
        ok: false,
        error: "El DNI debe ser numérico."
      });
    }

    if (fecha_baja) {

      const fechaBaja = new Date(fecha_baja);

      if (isNaN(fechaBaja.getTime())) {
        await pool.query("ROLLBACK");

        return res.status(400).json({
          ok: false,
          error: "Fecha de baja inválida."
        });
      }

      if (fechaBaja > new Date()) {
        await pool.query("ROLLBACK");

        return res.status(400).json({
          ok: false,
          error: "La fecha no puede ser futura."
        });
      }

      if (fechaBaja < fechaAlta) {
        await pool.query("ROLLBACK");

        return res.status(400).json({
          ok: false,
          error: "La fecha de baja debe ser posterior a la fecha de alta."
        });
      }
    }

    //////////////////////////////
    // Usuario duplicado
    //////////////////////////////

    if (usuario) {

      const existe = await pool.query(
        `
        SELECT id
        FROM usuarios
        WHERE usuario = $1
          AND id <> $2
        `,
        [usuario, idUsuario]
      );

      if (existe.rows.length > 0) {
        await pool.query("ROLLBACK");

        return res.status(409).json({
          ok: false,
          error: "El usuario ya existe."
        });
      }
    }

    //por nombre y dni
    const transportistaExistente = await pool.query(
      `
  SELECT t.id
  FROM transportistas t
  JOIN usuarios u
    ON t.id_usuario = u.id
  WHERE
    UPPER(TRIM(u.nombre_apellido)) = UPPER(TRIM($1))
    AND u.dni = $2
    AND t.id <> $3
  `,
      [nombre, dni, id]
    );

    if (transportistaExistente.rows.length > 0) {
      await pool.query("ROLLBACK");

      return res.status(409).json({
        ok: false,
        error: "Ya existe otro transportista con ese nombre y DNI."
      });
    }

    //////////////////////////////
    // Correo duplicado
    //////////////////////////////

    if (correo) {

      const existe = await pool.query(
        `
        SELECT id
        FROM usuarios
        WHERE correo = $1
          AND id <> $2
        `,
        [correo, idUsuario]
      );

      if (existe.rows.length > 0) {
        await pool.query("ROLLBACK");

        return res.status(409).json({
          ok: false,
          error: "El correo ya existe."
        });
      }
    }

    //////////////////////////////
    // UPDATE usuarios
    //////////////////////////////

    const camposUsuario = [];
    const valoresUsuario = [];

    if (contraseña != null) {
      camposUsuario.push(`contraseña = $${valoresUsuario.length + 1}`);
      valoresUsuario.push(contraseña);
    }

    if (correo != null) {
      camposUsuario.push(`correo = $${valoresUsuario.length + 1}`);
      valoresUsuario.push(correo);
    }

    if (usuario != null) {
      camposUsuario.push(`usuario = $${valoresUsuario.length + 1}`);
      valoresUsuario.push(usuario);
    }

    if (nombre != null) {
      camposUsuario.push(`nombre_apellido = $${valoresUsuario.length + 1}`);
      valoresUsuario.push(nombre);
    }

    if (dni != null) {
      camposUsuario.push(`dni = $${valoresUsuario.length + 1}`);
      valoresUsuario.push(dni);
    }

    if (fecha_baja != null) {
      camposUsuario.push(`fecha_baja = $${valoresUsuario.length + 1}`);
      valoresUsuario.push(fecha_baja);
    }

    if (camposUsuario.length > 0) {

      valoresUsuario.push(idUsuario);

      await pool.query(
        `
        UPDATE usuarios
        SET ${camposUsuario.join(", ")}
        WHERE id = $${valoresUsuario.length}
        `,
        valoresUsuario
      );
    }

    //////////////////////////////
    // UPDATE transportista
    //////////////////////////////

    if (costo_envio != null) {

      await pool.query(
        `
        UPDATE transportistas
        SET costo_envio = $1
        WHERE id = $2
        `,
        [costo_envio, id]
      );

    }

    await pool.query("COMMIT");

    res.json({
      ok: true,
      message: "Transportista actualizado correctamente."
    });

  } catch (error) {

    await pool.query("ROLLBACK");

    res.status(500).json({
      ok: false,
      error: error.message
    });

  }
};

//eliminarTransportista(id_transportista)
const eliminarTransportista = async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query("BEGIN");

    /// Verificar que exista el transportista

    const transportista = await pool.query(
      `
      SELECT
        t.id,
        t.id_usuario
      FROM transportistas t
      WHERE t.id = $1
      `,
      [id]
    );

    if (transportista.rows.length === 0) {

      await pool.query("ROLLBACK");

      return res.status(404).json({
        ok: false,
        error: "El transportista no existe."
      });

    }

    const idUsuario = transportista.rows[0].id_usuario;

    /// Baja lógica del usuario

    await pool.query(
      `
      UPDATE usuarios
      SET
        usuario_activo = false,
        fecha_baja = NOW()
      WHERE id = $1
      `,
      [idUsuario]
    );

    await pool.query("COMMIT");

    res.json({
      ok: true,
      message: "Transportista eliminado correctamente."
    });

  } catch (error) {

    await pool.query("ROLLBACK");

    res.status(500).json({
      ok: false,
      error: error.message
    });

  }

};

///exportarTransportistasCSV
const exportarTransportistasCSV = async (req, res) => {

  const {
    desde,
    hasta
  } = req.query;

  try {

    if (!desde || !hasta) {
      return res.status(400).json({
        ok: false,
        error: "Debe indicar un rango de fechas."
      });
    }

    const result = await pool.query(
      `
      SELECT
        t.id AS id,
        u.nombre_apellido AS nombre,
        u.usuario AS usuario,
        u.dni AS dni,
        TO_CHAR(u.fecha_alta, 'DD/MM/YYYY') AS fecha_alta,
        TO_CHAR(u.fecha_baja, 'DD/MM/YYYY') AS fecha_baja,
        CASE
          WHEN u.usuario_activo THEN 'Activo'
          ELSE 'Inactivo'
        END AS estado,
        t.costo_envio AS costo_envio
      FROM transportistas t
      JOIN usuarios u
        ON t.id_usuario = u.id
      WHERE DATE(u.fecha_alta) BETWEEN $1 AND $2
      ORDER BY t.id
      `,
      [desde, hasta]
    );

    const fields = [
      {
        label: "Código",
        value: "id"
      },
      {
        label: "Nombre y Apellido",
        value: "nombre"
      },
      {
        label: "Usuario",
        value: "usuario"
      },
      {
        label: "DNI",
        value: "dni"
      },
      {
        label: "Fecha Alta",
        value: "fecha_alta"
      },
      {
        label: "Fecha Baja",
        value: "fecha_baja"
      },
      {
        label: "Estado",
        value: "estado"
      },
      {
        label: "Costo de Envío",
        value: "costo_envio"
      }
    ];

    const datosCSV = result.rows.map(item => ({
      ...item,
      costo_envio: Number(item.costo_envio ?? 0).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }));

    const csv = generarCSV(
      datosCSV,
      fields
    );

    const csvConBOM = "\uFEFF" + csv;

    res.header(
      "Content-Type",
      "text/csv; charset=utf-8"
    );

    res.attachment(
      `transportistas_${Date.now()}.csv`
    );

    return res.send(csvConBOM);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      ok: false,
      error: "Error exportando CSV."
    });

  }

};

export {
  obtenerTransportistas,
  obtenerTransportistasActivos,
  obtenerTransportistasTotales,
  obtenerTransportistaPorId,
  crearTransportista,
  actualizarTransportista,
  eliminarTransportista,
  exportarTransportistasCSV
}