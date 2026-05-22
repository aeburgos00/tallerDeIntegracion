import express from 'express'
import {obtenerEnviosPorTransportistas} from '../controllers/enviosPorTransportistas.controller.js'

const router = express.Router();

router.get('/', obtenerEnviosPorTransportistas)

export default router
