import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from './ProctectedRoute.jsx'

import Login from '../pages/Login'

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

export default function AppRoutes() {
    return (
        <Routes>

            {/* Ruta inicial */}
            <Route
                path="/"
                element={<Navigate to="/login" />}
            />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Administrador */}
            <Route path="/" element={
                //<ProtectedRoute rol="ADMINISTRADOR">
                <DashboardLayout />
                //</ProtectedRoute>
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

        </Routes>
    );
}
