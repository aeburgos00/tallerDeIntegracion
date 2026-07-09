import express from 'express'
import {
    obtenerLiquidaciones,
    obtenerLiquidacionesListado,
    obtenerLiquidacionesTotales,
    obtenerLiquidacionesPorTransportista,
    obtenerLiquidacionesTransportistas,
} from '../controllers/liquidaciones.controller.js'

const router = express.Router();

router.get('/', obtenerLiquidaciones)
router.get('/listado', obtenerLiquidacionesListado)
router.get('/totales', obtenerLiquidacionesTotales)
router.get('/transportistas', obtenerLiquidacionesTransportistas)
router.get('/transportista/:id', obtenerLiquidacionesPorTransportista)

export default router