import express from "express";

import {
  obtenerTransportistas,
  obtenerTransportistasActivos,
  obtenerTransportistaPorId,
  crearTransportista,
  actualizarTransportista,
  eliminarTransportista,
  exportarTransportistasCSV,
  obtenerTransportistasTotales
} from "../controllers/transportistas.controller.js";

const router = express.Router();

router.get("/", obtenerTransportistas);

router.get("/activos", obtenerTransportistasActivos);

router.get("/totales", obtenerTransportistasTotales);

router.get("/exportar/csv", exportarTransportistasCSV);

router.get("/:id", obtenerTransportistaPorId);

router.post("/", crearTransportista);

router.put("/:id", actualizarTransportista);

router.delete("/:id", eliminarTransportista);

export default router;