import express from 'express'
import {obtenerLocalidadesTotales} from '../controllers/localidadesTotales.controller.js'

const router = express.Router();

router.get('/', obtenerLocalidadesTotales)

export default router