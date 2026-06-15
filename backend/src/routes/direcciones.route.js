import express from 'express'
import {
    obtenerDirecciones,
    obtenerDireccionesPorClienteLocalidad
} from '../controllers/direcciones.controller.js'

const router = express.Router();

router.get('/', obtenerDirecciones)

router.get('/cliente/localidad', obtenerDireccionesPorClienteLocalidad)


export default router