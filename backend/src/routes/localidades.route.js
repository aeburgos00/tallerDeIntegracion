import express from 'express'
import { obtenerLocalidades, obtenerLocalidadesActivas, obtenerLocalidadesTotales } from '../controllers/localidades.controller.js'

const router = express.Router();

router.get('/', obtenerLocalidades)

router.get('/activas', obtenerLocalidadesActivas)

router.get('/totales', obtenerLocalidadesTotales)

//router.get('/exportar-csv', exportarLocalidadesCSV)

export default router