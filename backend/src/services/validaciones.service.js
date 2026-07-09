import dayjs from "dayjs";

const validarArchivoVacio = (registros) => {
    if (registros.length === 0) {
        throw new Error("El archivo está vacío.");
    }
};

//==========================================Archivo de envíos==========================================

const validarColumnasEnvios = (registros) => {
    const COLUMNAS_ESPERADAS = [
        "DNI_CLIENTE",
        "NOMBRE_CLIENTE",
        "DIRECCION_CLIENTE",
        "ID_LOCALIDAD",
        "ID_TRANSPORTISTA",
        "FECHA"
    ];

    const columnasArchivo = Object.keys(registros[0]);

    const columnasFaltantes = COLUMNAS_ESPERADAS.filter(
        columna => !columnasArchivo.includes(columna)
    );

    if (columnasFaltantes.length > 0) {
        throw new Error(`El archivo CSV no contiene las columnas esperadas: ${columnasFaltantes.join(", ")}`);
    }
}

const validarContenidoEnvios = (registros) => {
    
    const errores = [];
    const duplicados = new Set();

    registros.forEach((fila, indice) => {
        if (!fila.DNI_CLIENTE?.trim()) {
            errores.push(`Fila ${indice + 2}: DNI_CLIENTE vacío`);
        }
        if (Number.isNaN(Number(fila.DNI_CLIENTE))) {
            errores.push(`Fila ${indice + 2}: DNI_CLIENTE no es un número válido`);
        }
        if (!fila.NOMBRE_CLIENTE?.trim()) {
            errores.push(`Fila ${indice + 2}: NOMBRE_CLIENTE vacío`);
        }
        if (!fila.DIRECCION_CLIENTE?.trim()) {
            errores.push(`Fila ${indice + 2}: DIRECCION_CLIENTE vacía`);
        }
        if (!fila.ID_LOCALIDAD?.trim()) {
            errores.push(`Fila ${indice + 2}: ID_LOCALIDAD vacío`);
        }
        if (Number.isNaN(Number(fila.ID_LOCALIDAD))) {
            errores.push(`Fila ${indice + 2}: ID_LOCALIDAD no es un número válido`);
        }
        if (!fila.ID_TRANSPORTISTA?.trim()) {
            errores.push(`Fila ${indice + 2}: ID_TRANSPORTISTA vacío`);
        }
        if (Number.isNaN(Number(fila.ID_TRANSPORTISTA))) {
            errores.push(`Fila ${indice + 2}: ID_TRANSPORTISTA no es un número válido`);
        }
        if (!fila.FECHA?.trim()) {
            errores.push(`Fila ${indice + 2}: FECHA vacía`);
        }
        
        const fecha = dayjs(fila.FECHA.trim(),"YYYY-MM-DD",true);

        if (!fecha.isValid()) {
            errores.push(`Fila ${indice + 2}: FECHA no es una fecha válida`);
        }

        const hoy = dayjs().startOf('day');

        if (fecha.isBefore(hoy)) {
            errores.push(`Fila ${indice + 2}: FECHA no puede ser menor a hoy`);
        }

        const claveDuplicado = `${fila.DNI_CLIENTE}-${fila.FECHA}-${fila.DIRECCION_CLIENTE}`;
        if (duplicados.has(claveDuplicado)) {
            errores.push(`Fila ${indice + 2}: Combinación de DNI_CLIENTE, DIRECCION_CLIENTE y FECHA duplicada`);
        } else {
            duplicados.add(claveDuplicado);
        }
    });

    if (errores.length > 0) {
        const error = new Error("El archivo contiene errores de validación.");
        error.errores = errores;
        throw error;
    }
};

export {
    validarArchivoVacio,
    validarColumnasEnvios,
    validarContenidoEnvios
};

