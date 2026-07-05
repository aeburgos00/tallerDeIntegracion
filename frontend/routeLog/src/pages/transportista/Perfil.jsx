import {
  Box,
  Typography,
  Button,
  Divider,
  Switch,
} from "@mui/material"

import { useState } from "react";

import LogoutIcon from '@mui/icons-material/Logout'

import { useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

export default function Perfil() {

  const navigate = useNavigate()

  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const [notif, setNotif] = useState(true);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #185fa5 0%, #2563eb 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          pt: 4,
        }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "#fff",
            color: "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {user?.nombre?.charAt(0)}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: 18,
            }}>
            {user.nombre}
          </Typography>
          <Typography
            sx={{
              color: "#aaa",
              fontSize: 16,
            }}>
            {user.usuario}
          </Typography>
        </Box>
      </Box>

      {/* Datos personales */}
      <Box
        sx={{
          p: 2,
        }}>
        <Typography
          sx={{
            fontSize: 16,
            py: 1,
            color: "#aaa",
          }}>
          Datos personales
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 2,
            gap: 2,
            backgroundColor: "#fff",
            borderRadius: 2,
          }}>
          <Box >
            <Typography sx={{ color: "#aaa" }}>Nombre completo</Typography>
            <Typography>{user.nombre}</Typography>
          </Box>
          <Divider />

          <Box>
            <Typography sx={{ color: "#aaa" }}>DNI</Typography>
            <Typography>{user.dni}</Typography>
          </Box>
          <Divider />

          <Box>
            <Typography sx={{ color: "#aaa" }}>Correo electrónico</Typography>
            <Typography>{user.correo}</Typography>
          </Box>
          <Divider />

          <Box>
            <Typography sx={{ color: "#aaa" }}>Costo envío</Typography>
            <Typography> {Number(user.costo_envio).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Opciones */}
      <Box
        sx={{
          px: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            py: 1,
            color: "#aaa",
          }}
        >
          Opciones
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 2,
            gap: 2,
            backgroundColor: "#fff",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography>Notificaciones</Typography>
            <Switch checked={notif} onChange={() => setNotif(!notif)} />
          </Box>
          <Divider />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5
            }}>
            <Typography>Idioma</Typography>
            <Typography sx={{ color: "#aaa" }}>Español</Typography>
          </Box>
        </Box>
      </Box>

      {/* Cierre de sesión */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
        }}>
        <Button
          onClick={handleLogout}
          endIcon={<LogoutIcon />}
          sx={{
            backgroundColor: "#ef4444",
            color: "#fff",
            fontWeight: 700,
            px: 4,
            py: 1.5,
          }}
        >
          Cerrar sesión
        </Button>
      </Box>

    </Box>
  );
}