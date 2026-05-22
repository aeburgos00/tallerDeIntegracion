import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({
  children,
  rol
}) {

  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  )

  // NO logueado
  if (!usuario) {
    return <Navigate to="/login" />
  }

  // rol incorrecto
  if (rol && usuario.rol !== rol) {
    return <Navigate to="/login" />
  }

  // puede entrar
  return children
}