import express from 'express'
import { obtenerLiquidacionesPorTransportista } from "../controllers/liquidaciones.controller.js"

const router = express.Router();

router.get('/', obtenerLiquidacionesPorTransportista)

export default router

