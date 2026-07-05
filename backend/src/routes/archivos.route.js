import express from "express";

import { upload } from "../middlewares/upload.middleware.js";

import { subirArchivo } from "../controllers/archivos.controller.js";

const router = express.Router();

router.post(
    "/envios",
    upload.single("archivo"),
    subirArchivo
);

export default router;


