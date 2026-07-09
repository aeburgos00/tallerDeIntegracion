import express from 'express'
import {
    obtenerLiquidacionesTotales,
    obtenerLiquidacionesPorTransportista,
    obtenerLiquidacionesTransportistas
} from '../controllers/liquidaciones.controller.js'

const router = express.Router();

router.get('/', obtenerLiquidacionesTotales)

router.get('/totales', obtenerLiquidacionesTotales)

router.get('/transportistas', obtenerLiquidacionesTransportistas)
router.get('/transportista/:id', obtenerLiquidacionesPorTransportista)

export default router