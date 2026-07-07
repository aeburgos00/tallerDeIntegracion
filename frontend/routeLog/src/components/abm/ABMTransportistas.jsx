import { TextField, Box, InputAdornment, Grid, Autocomplete, IconButton, } from "@mui/material";
import AddIcon from '@mui/icons-material/AddCircleOutlined';
import { useEffect, useState } from "react";
import FormularioABM from "../../layouts/FormularioABM";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import "dayjs/locale/es"; dayjs.extend(customParseFormat)
import {
    crearTransportista,
    modificarTransportista,
    eliminarTransportista,
    obtenerTransportistaPorId,
} from "../../services/api";

export default function ABMTransportistas({
    open,
    transportistaId,
    onClose,
    onSave,
    onDelete
}) {
    /// VARIABLES
    const formularioInicial = {
        // Usuarios
        usuario: "",
        contrasena: "",
        nombre: "",
        dni: "",
        correo: "",

        // Transportista
        costo_envio: "",

        //para editar
        fecha_baja: null,

        //para eliminar
        id_transportista: null
    }

    const esEdicion = Boolean(transportistaId);
    const [formulario, setFormulario] = useState(formularioInicial);

    /// FUNCIONES
    const handleGuardar = async () => {
        try {

            let respuesta;

            if (esEdicion) {
                respuesta = await modificarTransportista(
                    transportistaId,
                    formulario
                );
            } else {
                respuesta = await crearTransportista(formulario);
            }

            if (!respuesta.ok) {
                throw new Error(respuesta.error);
            }

            onSave?.();
            handleClose();

        } catch (error) {
            console.error(error);
        }
    };

    const handleEliminar = async () => {
        try {
            await eliminarTransportista(transportistaId);

            onDelete?.(transportistaId);
            handleClose();

        } catch (error) {
            console.error(error);
        }
    };

    const limpiarFormulario = () => {
        setFormulario(formularioInicial);
    };

    const handleClose = () => {
        setFormulario(formularioInicial);
        onClose?.();
    };

    /// USE EFECTS
    useEffect(() => {
        const cargarTransportista = async () => {

            if (!esEdicion) {
                setFormulario(formularioInicial);
                return;
            }

            try {
                const respuesta = await obtenerTransportistaPorId(transportistaId);
                const datos = respuesta.data;

                setFormulario({
                    id_transportista: datos.id,
                    nombre: datos.nombre,
                    dni: datos.dni,
                    correo: datos.correo,
                    usuario: datos.usuario,
                    costo_envio: datos.costo_envio,

                    contrasena: "",

                    fecha_baja: datos.fecha_baja
                        ? dayjs(datos.fecha_baja, "DD/MM/YYYY")
                        : null,
                });

            } catch (error) {
                console.error(error);
            }
        };

        cargarTransportista();

    }, [transportistaId, open]);

    /// RETURN
    return (
        <FormularioABM
            open={open}
            titulo={
                esEdicion
                    ? "Editar Transportista"
                    : "Nuevo Transportista"
            }
            onClose={handleClose}
            onSave={handleGuardar}
            onDelete={transportistaId ? handleEliminar : null}
        >
            <Box component="form">
                <Grid container spacing={2}>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Nombre y Apellido"
                            value={formulario.nombre || ""}
                            onChange={(e) =>
                                setFormulario({ ...formulario, nombre: e.target.value })
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="DNI"
                            value={formulario.dni || ""}
                            onChange={(e) =>
                                setFormulario({ ...formulario, dni: e.target.value })
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Correo"
                            value={formulario.correo || ""}
                            onChange={(e) =>
                                setFormulario({ ...formulario, correo: e.target.value })
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Costo de Envío"
                            value={formulario.costo_envio || ""}
                            onChange={(e) =>
                                setFormulario({ ...formulario, costo_envio: e.target.value })
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Nombre de Usuario"
                            value={formulario.usuario || ""}
                            onChange={(e) =>
                                setFormulario({ ...formulario, usuario: e.target.value })
                            }
                        />
                    </Grid>

                    {/* EDITAR */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        {!esEdicion && (
                        <TextField
                            fullWidth
                            required
                            label="Contraseña"
                            type="password"
                            value={formulario.contrasena}
                            onChange={(e) =>
                                setFormulario((prev) => ({
                                    ...prev,
                                    contrasena: e.target.value,
                                }))
                            }
                        />
                    )}
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                    {esEdicion && formulario.fecha_baja && (
                        <DatePicker
                            label="Fecha de baja"
                            value={formulario.fecha_baja}
                            onChange={(value) =>
                                setFormulario((prev) => ({
                                    ...prev,
                                    fecha_baja: value,
                                }))
                            }
                        />
                    )}
                    </Grid>
                </Grid>
            </Box>
        </FormularioABM>
    );
}