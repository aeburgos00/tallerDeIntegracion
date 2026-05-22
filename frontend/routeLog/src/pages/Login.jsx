import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import logo from '../assets/LogoSinTexto.svg'

export default function Login() {

  const navigate = useNavigate()

  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    // acá llamariamos al back
    //const usuarioMock = {
     // rol: 'ADMINISTRADOR'
    //}

    const usuarioMock = {
        nombre: 'aburgos',
        rol: 'ADMINISTRADOR'
    }

    localStorage.setItem(
        'usuario',
        JSON.stringify(usuarioMock)
    )

    if(usuarioMock.rol === 'ADMINISTRADOR') {
      navigate('/')
    }
    else {
      navigate('/login')
    }
  }

  return (
    
    <Box 
    sx={{
        backgroundColor: '#F0EEE8', 
        height:"100vh",
        alignContent:'center',
        justifyItems:'center',
    }}>
         <Box
        sx={{
            display: 'flex',
            backgroundColor: '#F7F5F0',
            borderRadius:4,
            boxShadow: 2,
            gap: 2,
            height:800
        }}
        >
            <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
                width: 600,
                objectFit: "contain",
                flexShrink: 0
            }}
            />

        <Box
        sx={{
            backgroundColor: '#FFF',
            width: 600,
            boxShadow: 0,
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 16,
            gap:4,
            p:4
        }}
        >
            <Typography
            sx={{
                fontSize: 32,
                fontWeight: 600,
                fontFamily:"Roboto",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
                ,px:2          
            }}
            >
            Iniciar Sesión
            </Typography>

            <Box>
                <TextField
                fullWidth
                type='text'
                label="Usuario"
                sx={{ mb: 2 }}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                />

                <TextField
                fullWidth
                type="password"
                label="Contraseña"
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                fullWidth
                variant="contained"
                sx={{
                    color:"#fff",
                    backgroundColor:"#3b82f6"
                }}
                onClick={handleLogin}
                >
                Ingresar
                </Button>
            </Box>
        </Box>

        </Box>
    </Box>
  )
}