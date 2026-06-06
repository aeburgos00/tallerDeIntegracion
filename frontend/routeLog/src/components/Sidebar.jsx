import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";

import { Link, useNavigate } from 'react-router-dom'

import LogoutIcon from '@mui/icons-material/Logout'
import IconButton from '@mui/material/IconButton'

import {menuAdministrador} from "./data"

import logo from "./../assets/LogoSinTexto.svg"

import  useAuth  from '../hooks/useAuth'

const drawerWidth = 280;

export default function Sidebar() 
  {

    const navigate = useNavigate()

    const { user, logout } = useAuth()

    const handleLogout = () => {
      logout()
      navigate('/login')
    }

  return (
    
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }
      }}
    >
      {/* HEADER */}
      <Box  
      sx={{  
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1.5
      }}
      >
           {/* LOGO */}
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: 56,
                height: 56,
                objectFit: "contain",
                flexShrink: 0
              }}
            />

          {/* TEXTOS */}
          <Box
          sx={{
            minWidth: 0
          }}
          >
            <Typography
            sx={{
                fontSize:15,
                fontWeight: 700,
                lineHeight: 1.2
            }}
          >
            Ruteo y Liquidación
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: "#9ca3af"
            }}
          >
            Sistema Logístico
          </Typography>
          </Box>
        </Box>
        

      <Divider />

      {/* MENU */}     
      <List 
      sx={{
          flexGrow: 1,
          px: 1,
          overflowY: "auto"
      }}
      >
       {menuAdministrador.map((e) => {
          const Icono = e.icono;
          
          return (
         <ListItem 
          key={e.id} 
          disablePadding
          sx={{
            mb:0.5
          }}
          >
            <ListItemButton
              component={Link}
              to={e.ruta}
              sx={{
                borderRadius:3,
                minHeight: 44,
                "$&.Mui-selected": {
                  backgroundColor: "#eef2ff",
                  color: "#4338ca",
                  "& .MuiListItemIcon-root": {
                        color: "#4338ca"
                  }
                }
              }}
            >
            <ListItemIcon 
            sx={{
              minWidth: 40
            }}>
              <Icono 
              sx={{
                fontSize:32
              }} />
            </ListItemIcon>

            <ListItemText 
            primary={e.descripcion} 
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 900
            }}
            />
          
          </ListItemButton>
        </ListItem>
        );
        })}
      </List>

      <Divider />
      
      {/* USUARIO */}
      <Box
        sx={{
          mt: "auto",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box sx={{
          display:"flex",
          gap:1.5
        }}
        >
          {/* Avatar */}
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
              color: "#fff",
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

          {/* Info */}
          <Box
            sx={{
              overflow: "hidden"
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 14,
                color: "#111827",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.nombre || "Usuario"}
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              {user?.rol || "Sin rol"}
            </Typography>
          </Box>
        
        </Box>

        {/* Logout */}
        <IconButton
          onClick={handleLogout}
          sx={{
            color: "#6b7280",
            transition: "0.2s",
            "&:hover": {
              backgroundColor: "#fee2e2",
              color: "#ef4444"
            }
          }}
        >
          <LogoutIcon />
        </IconButton>

      </Box>

    </Drawer>
  );
}

