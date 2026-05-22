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
  Avatar,
  ListItemAvatar
} from "@mui/material";

import {Link} from "react-router-dom"

import menu from "./data"

import logo from "./../assets/LogoSinTexto.svg"

const drawerWidth = 280;

export default function Sidebar() 
  {
  
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
       {menu.map((e) => {
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
        p: 1.5
      }}>
          <ListItem 
          disablePadding
          >
            <ListItemAvatar>
              <Avatar alt="Usuario" src="/static/images/avatar/1.jpg"/>
            </ListItemAvatar>

            <ListItemText
              primary="NombreUsuario"
              secondary="DescripcionUsuario"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 500
              }}
              secondaryTypographyProps={{
                fontSize: 12
              }}
            />
      </ListItem>
      </Box>
    </Drawer>
  );
}

