import express from 'express'
import {obtenerLocalidades} from '../controllers/localidades.controller.js'

const router = express.Router();

router.get('/', obtenerLocalidades)

export default router