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

import menu from "./data"

import logo from "./../../public/LogoSinTexto.svg"

const drawerWidth = 290;

export default function Sidebar({
                selectedIndex,
                setSelectedIndex
}) 
  {
  
  const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };

  return (
    
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box"
        }
      }}
    >
      {/* HEADER */}
      <Box  
      sx={{  
        display: "flex",
        alignItems: "center",
        gap:1,
        p: 2
      }}
      >
           <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                objectFit: "contain"
              }}
              width={100}
              height={100}
            />
          </Box>

          <Box>
          <Box
          sx={{
            display: "inline",
            textAlign:"initial"
          }}
          >
            <Typography
            sx={{
                fontSize:16,
                fontWeight: 700
            }}
          >
            Ruteo y Liquidación
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              color: "#9ca3af"
            }}
          >
            Sistema Logístico
          </Typography>
          </Box>
        </Box>
        
      </Box>

      <Divider />

      {/* MENU */}     
      <List 
      sx={{
          flexGrow: 1
      }}
      >
       {menu.map((e,index) => {
          const Icono = e.icono;
          return (
         <ListItem key={e.id} disablePadding>
          <ListItemButton sx={{borderRadius:3}}
            selected={selectedIndex === index}
            onClick={(event) => handleListItemClick(event, index)}
          >
            <ListItemIcon>
              <Icono sx={{fontSize:24 }} />
            </ListItemIcon>
            <ListItemText primary={e.descripcion} />
          </ListItemButton>
        </ListItem>
        );
        })}
      </List>

      <Divider />
      
      {/* USUARIO */}
       <Box sx={{p: 1}}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Usuario" src="/static/images/avatar/1.jpg"/>
            </ListItemAvatar>
            <ListItemText
              primary="NombreUsuario"
              secondary="DescripcionUsuario"
            />
      </ListItem>
      </Box>
    </Drawer>
  );
}

