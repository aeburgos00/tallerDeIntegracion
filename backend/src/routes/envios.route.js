import express from 'express'
import {
    obtenerEnvios, 
    obtenerEnvioPorId, 
    obtenerEnviosPorTransportistas,
    obtenerEnviosTotales,
    obtenerEnviosRecientes,
    exportarCSV,
    crearEnvio
} from '../controllers/envios.controller.js'

const router = express.Router();

router.get('/', obtenerEnvios)

router.post('/', crearEnvio)

router.get("/exportar-csv",exportarCSV)

router.get('/transportistas', obtenerEnviosPorTransportistas)

router.get('/totales', obtenerEnviosTotales)

router.get('/recientes', obtenerEnviosRecientes)

router.get('/:id', obtenerEnvioPorId)

export default router
