import express from 'express'
import {obtenerEnviosTotales} from '../controllers/enviosTotales.controller.js'

const router = express.Router()

router.get('/', obtenerEnviosTotales)

export default router
