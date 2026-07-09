import { procesarArchivoEnvios } from "../services/archivos.service.js";

const subirArchivo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                ok: false,
                mensaje: "No se recibió ningún archivo."
            });
        }

        const resultado = await procesarArchivoEnvios(req.file.path);

        return res.status(200).json(resultado);
    }
    catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message,
            errores: error.errores ?? []
        });
    }
};

export {subirArchivo};