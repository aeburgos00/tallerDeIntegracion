import express from 'express'
import {obtenerEnviosRecientes} from '../controllers/enviosRecientes.controller.js'

const router = express.Router();

router.get('/', obtenerEnviosRecientes)

export default router
