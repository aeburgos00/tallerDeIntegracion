import { 
  Box,
  Button,
  Divider
} from "@mui/material"

import AbcIcon from '@mui/icons-material/Abc';


export default function SubidaDeArchivos() {
  return (
    <Box
    sx={{
      display:"flex",
      flexDirection:"column",
      gap:2
    }}
    >
      {/* Subida de archivos */}
      <Box 
      sx={{
        background:"#fff",
        borderRadius:2,
        height:450
      }}
      >
          <Box
          sx={{
            display:"flex",
            gap:2
          }}
          >
           <AbcIcon/>
           <Box>
              <h2>Subir archivo</h2>
              <p>Seleccione el archivo a subir</p>
           </Box>
          </Box>

          <Divider/>

          <Box
          sx={{
            backgroundColor:"#0099ff",
          }}
          >
            <p>Arrastrá y soltá tu archivo aquí</p>
            <p>o</p>
            <Button>Seleccionar archivo</Button>
          </Box>

          <Box>
            <Button>Cancelar</Button>
            <Button>Subir archivo</Button>
          </Box>

          <Divider/>
      </Box>

      {/* Modelo de archivos permitidos */}
      <Box 
      sx={{
        background:"#fff",
        borderRadius:2
      }}
      >
        <h2>Formatos aceptados:</h2>
        <h4>• csv - Plantilla de Envios de Paquetes</h4>
      </Box>
    </Box>
  )
}
