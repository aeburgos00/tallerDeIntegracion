import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import pool from "../config/db.js"



export const login = async (req, res) => {

  try {
    //Declaro el usuario y el password
    const {
      usuario,
      password
    } = req.body

    // Busco al usuario
    const result = await pool.query(
      `
      select
        id,
        usuario,
        contraseña,
        tipo_usuario,
        nombre_apellido
      from usuarios
      where usuario = $1
      and fecha_baja is null
      `,
      [usuario]
    )

    //Existe el usuario ingresado?
    if( result.rows.length === 0) {
      return res.status(401).json({
          ok: false,
          message: 'El usuario ingresado no se encuentra registrado.'
      })
    }

    //Me guardo los datos del usuario ingresado
    const user = result.rows[0]

    //Verifico la contraseña
    const passwordValida = await bcrypt.compare(
          password,
          user.contraseña
    )
    if(!passwordValida) {
        return res.status(401).json({
          ok: false,
          message:
            'Contraseña incorrecta.'
        })
    }

    //Genero el Token de sesión
    const token = jwt.sign(
      {
        id: user.id,
        rol: user.tipo_usuario,
        nombre: user.nombre_apellido
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    )
    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        rol: user.tipo_usuario,
        nombre: user.nombre_apellido
      }
    })

  } catch (error) {
      console.error(error)

      res.status(500).json({
        ok: false,
        message:
          'Error interno'
      })
  }
}