import { Navigate } from 'react-router-dom'
import  useAuth  from '../hooks/useAuth'

export default function ProtectedRoute({
  children
}) {

   const {
    token,
    loading
  } = useAuth()

  // NO logueado
  if(loading) {
    return null
  }

  // rol incorrecto
  if(!token) {
    return (
      <Navigate to="/login" />
    )
  }

  // puede entrar
  return children
}