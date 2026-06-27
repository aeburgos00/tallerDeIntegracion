import express from 'express'
import { obtenerProvincias } from '../controllers/provincias.controller.js'

const router = express.Router();

router.get('/', obtenerProvincias)

export default router