//Script para hashear las contraseñas en la base de datos
import bcrypt from 'bcrypt'
import pool from '../src/config/db.js'

async function hashPasswords() {
    try {
        const usuarios = await pool.query(
            `select id, contraseña
            from usuarios
            where contraseña not like '$2b$%'
            `
        )

        for (const user of usuarios.rows) {
            const hash = await bcrypt.hash(
                user.contraseña,
                10
            )
            await pool.query(`
            update usuarios
            set contraseña = $1
            where id = $2
            `,
            [hash, user.id]
            )
            console.log(`Usuario ${user.id} actualizado`)
        }

        console.log('Contraseñas hasheadas correctamente.')

        process.exit()
    }
    catch(error){
        console.error(error)
        process.exit(1)
    }
}

hashPasswords()

//comando para ejecutar el script -> node scripts/hashPasswords.js