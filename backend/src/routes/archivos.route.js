import express from "express";

import { upload } from "../middlewares/upload.middleware.js";

import { subirArchivo } from "../controllers/archivos.controller.js";

const router = express.Router();

router.post(
    "/envios",
    upload.single("archivo"),
    subirArchivo
);

router.get("/plantilla-envios", (req, res) => {
    res.download("./public/plantilla_envios.csv");
});

export default router;


