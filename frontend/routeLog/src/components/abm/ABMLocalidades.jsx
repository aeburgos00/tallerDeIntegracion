import {
    TextField,
    Box,
    Grid,
    MenuItem,
    InputAdornment
} from "@mui/material";

import { useEffect, useState } from "react";

import FormularioABM from "../../layouts/FormularioABM";

// IMPORTAR CUANDO EXISTA LA API
/*
import {
  crearLocalidad,
  modificarLocalidad,
  obtenerLocalidadPorId
} from "../../services/api";
*/

export default function ABMLocalidades({
    open,
    onClose,
    idLocalidad
}) {

    const [formulario, setFormulario] = useState({
        nombre: "",
        codigo_postal: "",
        provincia: "",
        costo_envio: "",
        estado: true
    });

    const handleChange = (campo) => (e) => {

        setFormulario(prev => ({

            ...prev,

            [campo]: e.target.value

        }));

    };

    const handleGuardar = async () => {

        try {

            if (idLocalidad) {

                console.log("Modificar localidad");

                console.log(formulario);

                /*
                await modificarLocalidad(
                  idLocalidad,
                  formulario
                )
                */

            } else {

                console.log("Crear localidad");

                console.log(formulario);

                /*
                await crearLocalidad(
                  formulario
                )
                */

            }

            onClose();

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        if (!idLocalidad) {

            setFormulario({

                nombre: "",
                codigo_postal: "",
                provincia: "",
                costo_envio: "",
                estado: true

            });

            return;

        }

        // CUANDO TENGAN BACK

        /*
        const cargarLocalidad = async () => {
    
          try {
            const response = await obtenerLocalidadPorId(idLocalidad);
            const localidad = response.data;
    
            setFormulario({    
              nombre: localidad.nombre || "",    
              codigo_postal: localidad.codigo_postal || "",

              provincia: localidad.provincia || "", 
              costo_envio: localidad.costo_envio || "",    
              estado: localidad.estado

            });
              } catch(error){
 
            console.error(error);
          }
        }

        cargarLocalidad();
        */

    }, [idLocalidad]);



    return (

        <FormularioABM

            open={open}

            titulo={

                idLocalidad

                    ? "Modificar Localidad"

                    : "Nueva Localidad"

            }

            onClose={onClose}

            onSave={handleGuardar}

        >

            <Box component="form">

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Nombre"
                            value={formulario.nombre}
                            onChange={handleChange("nombre")}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Código Postal"
                            value={formulario.codigo_postal}
                            onChange={handleChange("codigo_postal")}
                        />
                    </Grid>


                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Provincia"
                            value={formulario.provincia}
                            onChange={handleChange("provincia")}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Costo de Envío"
                            value={formulario.costo_envio}
                            onChange={handleChange("costo_envio")}
                            slotProps={{
                                input: {
                                    startAdornment:
                                        <InputAdornment position="start">
                                            $
                                        </InputAdornment>
                                }
                            }}
                        />
                    </Grid>
                </Grid>

            </Box>

        </FormularioABM>

    )

}