import express from 'express'
import {
    obtenerLiquidacionesTotales,
    obtenerLiquidacionesPorTransportista,
    obtenerLiquidacionesDashboard
} from '../controllers/liquidaciones.controller.js'

const router = express.Router();

router.get('/', obtenerLiquidacionesTotales)

router.get('/totales', obtenerLiquidacionesTotales)

router.get('/dashboard', obtenerLiquidacionesDashboard)

router.get('/transportista/:id', obtenerLiquidacionesPorTransportista)

export default router