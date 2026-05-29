import { 
  Box,
  Button,
  Divider,
  Typography
} from "@mui/material"

import ArchivoIcon from '@mui/icons-material/InsertDriveFileOutlined';
import InfoIcon from '@mui/icons-material/InfoOutlined';

import FlechaIcon from '@mui/icons-material/ArrowCircleUpRounded';

import { useDropzone } from 'react-dropzone'
import { useState } from 'react'

const colores = {
  primario: "#3b82f6",
  textos: "#111827",
  textosSec: "#9ca3af",
  background: "#E6F1FB",
}

export default function SubidaDeArchivos() {
  
  const [archivo, setArchivo] = useState(null)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setArchivo(file)
    }
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'text/csv': ['.csv']
    }
  })

  const subirArchivo = async () => {
    if (!archivo) return
    try {
      const formData = new FormData()
      formData.append('archivo', archivo)
      const response = await fetch(
        'http://localhost:3000/subir-archivo',
        {
          method: 'POST',
          body: formData
        }
      )
      const result = await response.json()
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box
    sx={{
      display:"flex",
      flexDirection:"column",
      gap:2
    }}
    >
      {/* Card principal */}
      <Box 
      sx={{
        background:"#fff",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
      }}
      >
          {/* Header */}
          <Box
          sx={{
            display:"flex",
            alignItems:"center",
            gap:2,
            p:3,
          }}
          >
           <Box sx={{
              backgroundColor:colores.background,
              p:1.5,
              borderRadius:2,              
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
           }}>
            <ArchivoIcon sx={{
              color:colores.primario,
              fontSize:32
            }}/>
           </Box>

           <Box>
              <Typography sx={{
                fontSize:20,
                fontWeight: 700,
                color:colores.textos
              }}>Subir archivo</Typography>
              
              <Typography sx={{
                fontSize: 14,
                color: colores.textosSec
              }}>Seleccione el archivo a subir</Typography>
           </Box>

          </Box>

          <Divider sx={{mx:3}} />
          
          {/* DROPZONE */}
          <Box sx={{
            p:3,
            display:"flex",
            justifyContent:"center",  
          }}>
             <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed",
              borderColor:
                isDragActive
                  ? 
                  colores.primario
                  : "#CBD5E1",
              backgroundColor:
                isDragActive
                  ? 
                  `${colores.primario}08`
                  : "#fff",
              borderRadius: 3,
              width: "100%",
              maxWidth: 950,
              minHeight: 350,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            <input {...getInputProps()} />
           
           <ArchivoIcon
              sx={{
                fontSize: 48,
                color: colores.primario
              }}
            />
            
            {
              archivo
                ? (
                  <>
                    <Typography sx={{fontWeight: 600}}>
                      {archivo.name}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 14,
                        color: colores.textosSec
                      }}
                    >
                      {(archivo.size / 1024).toFixed(2)} KB
                    </Typography>
                  </>
                )
                : (
                  <>
                    <Typography sx={{fontWeight: 500}} >
                      Arrastrá y soltá tu archivo aquí
                    </Typography>

                    <Typography sx={{color: colores.textosSec}} >
                      o hacé click para seleccionarlo
                    </Typography>
                  </>
                )
            }
            </Box>
          </Box>

          {/* FOOTER */}
          <Box sx={{
            display:"flex",
            justifyContent:"flex-end",
            p:3,
            gap:2
          }}>
            <Button
            variant="outlined"
            onClick={() => setArchivo(null)}
            sx={{
                borderColor:colores.textosSec,
                color:colores.textosSec,
                borderRadius:2,
                textTransform:"none",
            }}
            >Cancelar</Button>

            <Button 
            variant="contained"
            disabled={!archivo}
            onClick={subirArchivo}
            startIcon={<FlechaIcon />}
            sx={{
                background:colores.primario,
                borderRadius:2,
                textTransform: "none"
            }}
            >Subir archivo </Button>
          </Box>

      </Box>

      {/* Card Info */}
      <Box 
      sx={{
        backgroundColor:colores.background,
        border:"1px solid",
        borderColor:`${colores.primario}30`,
        borderRadius:3,
        display:"flex",
        alignItems:"center",
        gap:2,
        px:3,
        py:2,
      }}
      >
        <InfoIcon sx={{
          color:colores.primario,
          fontSize: 32
        }}/>

        <Box>
          <Typography sx={{
            fontSize:18,
            fontWeight: 700,
            color:colores.primario
          }}>Formatos aceptados:</Typography>

          <Typography sx={{
            fontSize: 14,
            color: colores.primario
          }} >• csv - Plantilla de Envios de Paquetes</Typography>
        </Box>
      </Box>
    </Box>
  )
}
