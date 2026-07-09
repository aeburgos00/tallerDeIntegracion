import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const nombre =
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "_");

        cb(null, nombre);
    }
});

const fileFilter = (req, file, cb) => {

    const extension = path.extname(file.originalname);

    if (extension.toLowerCase() !== ".csv") {
        return cb(
            new Error("Solo se permiten archivos de extension .csv"),
            false
        );
    }

    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});