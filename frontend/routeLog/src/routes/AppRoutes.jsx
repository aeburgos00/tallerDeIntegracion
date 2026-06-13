import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from './ProctectedRoute.jsx'

import Login from '../pages/Login'

//ADMINSTRADOR
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/administrador/Dashboard";
import Envios from "../pages/administrador/EnvioDePaquetes";
/*import Transportistas from "../pages/administrador/Transportistas";*/
import Transportistas from "../pages/administrador/TransportistasV2";
/*import Localidades from "../pages/administrador/Localidades";*/
import Localidades from "../pages/administrador/LocalidadeV2";
import Liquidaciones from "../pages/administrador/Liquidaciones";
import SubidaArchivos from "../pages/administrador/SubidaDeArchivos";
import Configuracion from "../pages/administrador/Configuracion";

//TRANSPORTISTA
import MobileLayout from "../layouts/MobileLayout";
import Inicio from "../pages/transportista/Inicio";
import EnviosMob from "../pages/transportista/Envios";
import LiquidacionesMob from "../pages/transportista/Liquidaciones";
import Perfil from "../pages/transportista/Perfil";

export default function AppRoutes() {
    return (
        <Routes>
<<<<<<< HEAD

            {/* Ruta inicial */}
            <Route
                path="/"
                element={<Navigate to="/login" />}
            />

=======
            
>>>>>>> origin/dev-agustin
            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Administrador */}
<<<<<<< HEAD
            <Route path="/" element={
                //<ProtectedRoute rol="ADMINISTRADOR">
                <DashboardLayout />
                //</ProtectedRoute>
=======
            <Route 
            path="/" 
            element={
                <ProtectedRoute rol="ADMINISTRADOR">
                    <DashboardLayout />
                </ProtectedRoute>
>>>>>>> origin/dev-agustin
            }>
                <Route index element={<Dashboard />} />

                <Route path="/Envios" element={<Envios />} />
                <Route path="/Transportistas" element={<Transportistas />} />
                <Route path="/Localidades" element={<Localidades />} />
                <Route path="/Liquidaciones" element={<Liquidaciones />} />
                <Route path="/Archivos" element={<SubidaArchivos />} />
                <Route path="/Configuracion" element={<Configuracion />} />
            </Route>

            {/* Transportista */}
            <Route 
            path="/transportista" 
            element={
                    <ProtectedRoute rol="TRANSPORTISTA">
                        <MobileLayout />
                    </ProtectedRoute>
            }>
                <Route index element={<Inicio />} />
                <Route path="Envios"  element={<EnviosMob />} />
                <Route path="Liquidaciones"  element={<LiquidacionesMob />} />
                <Route path="Perfil"  element={<Perfil />} />
            </Route>

            {/* Ruta Default */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}
