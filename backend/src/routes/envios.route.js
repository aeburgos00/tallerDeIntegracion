import express from 'express'
import {obtenerEnvios} from '../controllers/envios.controller.js'

const router = express.Router();

router.get('/', obtenerEnvios)

export default router
