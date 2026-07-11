import express from 'express'
import {
    obtenerLiquidaciones,
    obtenerLiquidacionesListado,
    obtenerLiquidacionesTotales,
    obtenerLiquidacionesTotalesAdmin,
    obtenerLiquidacionesPorTransportista,
    obtenerLiquidacionesTransportistas,
    obtenerLiquidacionesDashboard
} from '../controllers/liquidaciones.controller.js'

const router = express.Router();

router.get('/', obtenerLiquidaciones)
router.get('/listado', obtenerLiquidacionesListado)
router.get('/totales', obtenerLiquidacionesTotales)
router.get('/totalesAdmin', obtenerLiquidacionesTotalesAdmin)
router.get('/transportistas', obtenerLiquidacionesTransportistas)
router.get('/dashboard', obtenerLiquidacionesDashboard)
router.get('/transportista/:id', obtenerLiquidacionesPorTransportista)

export default router