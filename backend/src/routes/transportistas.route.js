import express from 'express'
// import cors from 'cors'
import { obtenerTransportistas } from '../controllers/transportistas.controller.js'

const router = express.Router()

router.get('/', obtenerTransportistas)

export default router