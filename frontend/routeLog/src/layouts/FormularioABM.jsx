import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const colores = {
  azul: "#3b82f6",
  gris: "#9ca3af",
}

export default function FormularioABM({
  open,
  titulo,
  onClose,
  onSave,
  children
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
      sx={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:colores.azul,
        color:"#fff",
        py: 2,
      }}>
        {titulo}
      </DialogTitle>
      
      <DialogContent
      sx={{
      p: 3,
      "&.MuiDialogContent-root": {
        paddingTop: 3
      }
      }}
      >
        {children}
      </DialogContent>

      <DialogActions
      sx={{
        p: 2,
        pt:0,
        gap: 1.5
      }}
      >
        <Button 
        variant="outlined"
        onClick={onClose}
        sx={{
          borderColor:colores.gris,
          color:colores.azul,
          borderRadius:2,
          textTransform:"none",
        }}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={onSave}
        sx={{
          background:colores.azul,
          borderRadius:2,
          textTransform: "none"
        }}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  )
}