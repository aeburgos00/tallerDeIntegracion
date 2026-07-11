import express from 'express'
import {
    obtenerEnvios,
    obtenerEnvioPorId,
    obtenerEnviosPorTransportistas,
    obtenerEnviosTotales,
    obtenerEnviosRecientes,
    exportarCSV,
    crearEnvio,
    obtenerEnviosPorTransportistaId,
    modificarEnvio,
    cancelarEnvio,
    cambiarEstadoEnvio,
    obtenerProximoEnvioPorTransportista
} from '../controllers/envios.controller.js'

const router = express.Router();

router.get('/', obtenerEnvios)
router.post('/', crearEnvio)

router.get("/exportar-csv", exportarCSV)
router.get('/transportistas', obtenerEnviosPorTransportistas)
router.get('/transportista/:id', obtenerEnviosPorTransportistaId)
router.get('/totales', obtenerEnviosTotales)
router.get('/recientes', obtenerEnviosRecientes)
router.get('/proximo/transportista/:id', obtenerProximoEnvioPorTransportista)

router.get('/:id', obtenerEnvioPorId)

router.put('/:id', modificarEnvio)
router.put('/:id/cancelar', cancelarEnvio)
router.patch('/:id/estado', cambiarEstadoEnvio)

export default router