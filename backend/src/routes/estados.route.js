import express from 'express'
import {
    obtenerEstados
} from '../controllers/estados.controller.js'

const router = express.Router();

router.get('/', obtenerEstados)

export default router