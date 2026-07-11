import express from 'express'
import {
    obtenerLiquidacionesTotales,
    obtenerLiquidacionesPorTransportista,
    obtenerLiquidacionesDashboard,
    obtenerHistorialLiquidacionesPorTransportista
} from '../controllers/liquidaciones.controller.js'

const router = express.Router();

router.get('/', obtenerLiquidacionesTotales)

router.get('/totales', obtenerLiquidacionesTotales)

router.get('/dashboard', obtenerLiquidacionesDashboard)

router.get('/transportista/:id', obtenerLiquidacionesPorTransportista)

router.get('/historial/transportista/:id', obtenerHistorialLiquidacionesPorTransportista)

export default router