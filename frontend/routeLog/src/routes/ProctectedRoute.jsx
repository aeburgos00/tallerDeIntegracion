import { Navigate } from 'react-router-dom'
import  useAuth  from '../hooks/useAuth'

export default function ProtectedRoute({
  children,
  rol
}) {

   const {
    token,
    user,
    loading
  } = useAuth()

  // NO logueado
  if(loading) {
    return null
  }

  // token incorrecto
  if(!token) {
    return (
      <Navigate to="/login" replace />
    )
  }
  // rol incorrecto
  if(rol && user?.rol !== rol) {
    return (
      <Navigate to="/login" replace />
    )
  }

  // puede entrar
  return children
}