import express from 'express'
import {
    obtenerTarifas,
    obtenerTarifasPorTransportistaLocalidad
} from '../controllers/tarifas.controller.js'

const router = express.Router();

router.get('/', obtenerTarifas)

router.get('/transportista/localidad', obtenerTarifasPorTransportistaLocalidad)

export default router