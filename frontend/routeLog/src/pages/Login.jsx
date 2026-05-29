import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput
} from '@mui/material'

import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import { motion } from "framer-motion"

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import logo from '../assets/LogoSinTexto.svg'

import  useAuth  from '../hooks/useAuth'
import { loginRequest } from '../services/api'

export default function Login() {

  const navigate = useNavigate()

  const { login } = useAuth()

  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPasword] = useState(false)

  const handleLogin = async () => {
    setError("");

    // VALIDACIONES
    if (!user.trim()) {
      setError("Ingrese un usuario")
      return
    }
    if (!password.trim()) {
      setError("Ingrese una contraseña")
      return
    }

    try {
      setLoading(true)

      const result = await loginRequest(
                          user,
                          password
                        )
      if(!result.ok) {
        setError(result.message)
        return
      }
      
      login({
        token:result.token,
        user:result.user
      })

      if (result.user.rol === "ADMINISTRADOR") {
        navigate("/")
      }
      else {
        navigate('/login')
      }

    } catch (err) {
      console.log(err)
      setError("Usuario o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  const handleClickShowPassword = () => setShowPasword((show) => !show);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    
    <Box 
    sx={{
        minHeight:"100vh",
        backgroundColor: '#F0EEE8', 
        display:"flex",
        alignItems:'center',
        justifyContent:'center',
    }}>
        
        <Box
        component={motion.div}
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4
        }}
        sx={{
            width: "90%",
            maxWidth: 1200,
            minHeight: {
            xs: "auto",
            md: 650
            },
            display: 'flex',
            flexDirection:{
               xs: 'column',
               md: 'row'
            },
            borderRadius:4,
            boxShadow:"0 10px 40px rgba(0,0,0,0.20)",
            overflow: "hidden",
            backgroundColor: "#fff",
        }}
        >
            {/* Logo */}
            <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
                width: '50%',
                display: {
                xs: 'none',
                md: 'block'
                },
                objectFit: "contain",
                flexShrink: 0,
                backgroundColor: '#F7F5F0',
            }}
            />

            {/* Form */}
            <Box
            sx={{
                width: {
                xs: "100%",
                md: "50%"
                },
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                gap:3,
                p: {
                xs: 4,
                md: 6
                },
            }}
            >
                {/* Titulo */}
                <Box>
                    <Typography
                    sx={{
                        fontSize: {
                        xs: 28,
                        md: 36
                        },
                        fontWeight: 700,
                        color: "#111827",  
                    }}
                    >
                    Bienvenido
                    </Typography>
                    <Typography
                    sx={{
                        fontSize: {
                        xs: 14,
                        md: 16
                        },
                        color: "#6b7280",
                        mt: 1
                    }}
                    >
                    Iniciar sesión
                    </Typography>
                </Box>
                
                {/* ERROR */}
                {
                    error && (

                    <Alert severity="error">
                        {error}
                    </Alert>
                    )
                }
                
                {/* INPUTS */}
                <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                }}
                >
                    <TextField
                    label="Usuario"
                    fullWidth
                    value={user}
                    onChange={(e) => {
                      setUser(e.target.value)
                      setError("")
                    }}
                    onKeyDown={handleKeyDown}
                    />

                    <FormControl variant="outlined">
                        <InputLabel>Contraseña</InputLabel>
                        <OutlinedInput
                        label="Contraseña"
                        fullWidth
                        value={password}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setError("")
                        }}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                onClick={handleClickShowPassword}
                                edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        />
                    </FormControl>

                </Box>

                {/* Boton */}
                <Button
                variant="contained"
                size='large'
                fullWidth
                disabled={loading}
                onClick={handleLogin}
                sx={{
                    color:"#fff",
                    backgroundColor:"#3b82f6",
                    textTransform: "none",
                     boxShadow: "none",
                     borderRadius: 3,
                     fontWeight: 600,
                     fontSize: 16,
                }}
                >
                {
                loading
                ? (
                    <CircularProgress
                        size={24}
                        color="inherit"
                    />
                )
                : (
                    "Ingresar"
                )
                }
                </Button>
                
            </Box>

        </Box>
    </Box>
  )
}