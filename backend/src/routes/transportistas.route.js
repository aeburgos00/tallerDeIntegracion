import express from 'express'
import { obtenerTransportistas, obtenerTransportistasActivos } from '../controllers/transportistas.controller.js'

const router = express.Router()

router.get('/', obtenerTransportistas)

router.get('/activos', obtenerTransportistasActivos)

export default router