import express from 'express'
import {obtenerLiquidacionesTotales} from '../controllers/liquidaciones.controller.js'
import {obtenerLiquidacionesPorTransportista} from '../controllers/liquidaciones.controller.js'

const router = express.Router();

router.get('/', obtenerLiquidacionesTotales)

router.get('/totales', obtenerLiquidacionesTotales)

router.get('/transportista', obtenerLiquidacionesPorTransportista)

export default router