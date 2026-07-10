import express from 'express'
import { 
    obtenerTransportistas, 
    obtenerTransportistaPorId,
    obtenerTransportistasActivos,
    obtenerTransportistasTotales,
    exportarCSV,
    crearTransportista,
    modificarTransportista,
    eliminarTransportista
 } from '../controllers/transportistas.controller.js'

const router = express.Router()

router.get('/', obtenerTransportistas)

router.post('/', crearTransportista)

router.get('/activos', obtenerTransportistasActivos)

router.get('/totales', obtenerTransportistasTotales)

router.get("/exportar-csv", exportarCSV)

router.put('/:id', modificarTransportista)

router.delete('/:id', eliminarTransportista)

router.get('/:id', obtenerTransportistaPorId)

export default router