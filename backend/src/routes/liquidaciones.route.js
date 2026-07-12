import express from 'express'
import {
    obtenerLiquidaciones,
    obtenerLiquidacionesListado,
    obtenerLiquidacionesTotales,
    obtenerLiquidacionesPorTransportista,
    obtenerLiquidacionesDashboard,
    exportarCSV
} from '../controllers/liquidaciones.controller.js'

const router = express.Router();

router.get('/', obtenerLiquidaciones)
router.get('/exportar-csv', exportarCSV)
router.get('/listado', obtenerLiquidacionesListado)
router.get('/totales', obtenerLiquidacionesTotales)
router.get('/dashboard', obtenerLiquidacionesDashboard)
router.get('/transportista/:id', obtenerLiquidacionesPorTransportista)

export default router