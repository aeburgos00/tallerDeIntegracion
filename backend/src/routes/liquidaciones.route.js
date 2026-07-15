import express from 'express'
import {
    obtenerLiquidaciones,
    obtenerLiquidacionesTotales,
    obtenerLiquidacionesPorTransportista,
    obtenerLiquidacionesDashboard,
    obtenerHistorialLiquidacionesPorTransportista,
    obtenerLiquidacionTentativaPorTransportista,
    exportarCSV
} from '../controllers/liquidaciones.controller.js'

const router = express.Router();

router.get('/', obtenerLiquidaciones)
router.get('/exportar-csv', exportarCSV)
router.get('/totales', obtenerLiquidacionesTotales)
router.get('/dashboard', obtenerLiquidacionesDashboard)
router.get('/tentativa/transportista/:id', obtenerLiquidacionTentativaPorTransportista)

router.get('/transportista/:id', obtenerLiquidacionesPorTransportista)
router.get('/historial/transportista/:id', obtenerHistorialLiquidacionesPorTransportista)

export default router
