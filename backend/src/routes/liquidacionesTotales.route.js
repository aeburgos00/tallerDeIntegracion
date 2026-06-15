import express from 'express'
import {obtenerLiquidacionesTotales} from '../controllers/liquidacionesTotales.controller.js'

const router = express.Router();

router.get('/', obtenerLiquidacionesTotales)

export default router