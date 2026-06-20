import express from 'express'
import {
    obtenerLocalidades,
    obtenerLocalidadesActivas,
    obtenerLocalidadesTotales,
    obtenerLocalidadPorId,
    crearLocalidad,
    modificarLocalidad,
    eliminarLocalidad,
    cambiarEstadoLocalidad,
    exportarCSV
} from '../controllers/localidades.controller.js'

const router = express.Router();

router.get('/', obtenerLocalidades)

router.get('/activas', obtenerLocalidadesActivas)

router.get('/totales', obtenerLocalidadesTotales)

router.get('/exportar-csv', exportarCSV)

router.get('/:id', obtenerLocalidadPorId)

router.post('/', crearLocalidad)

router.put('/:id', modificarLocalidad)

router.patch('/:id/estado', cambiarEstadoLocalidad)

router.delete('/:id', eliminarLocalidad)

export default router