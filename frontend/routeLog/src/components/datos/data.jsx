import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import EnviosIcon from "@mui/icons-material/LocalShipping";
import TransportistaIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import LocalidadIcon from '@mui/icons-material/LocationCity';
import LiquidacionIcon from '@mui/icons-material/MonetizationOn';
import SubidaArchivosIcon from '@mui/icons-material/InsertDriveFile';

import InicioIcon from '@mui/icons-material/Home';
import PerfilIcon from '@mui/icons-material/Person';

const menuAdministrador = [
{id:0, icono: DashboardIcon, descripcion: "Dashboard", ruta: "/"},
{id:1, icono: EnviosIcon, descripcion: "Envío de Paquetes", ruta: "/envios"},
{id:2, icono: TransportistaIcon, descripcion: "Transportistas", ruta: "/transportistas"},
{id:3, icono: LocalidadIcon, descripcion: "Localidades", ruta: "/localidades"},
{id:4, icono: LiquidacionIcon, descripcion: "Liquidaciones", ruta: "/liquidaciones"},
{id:5, icono: SubidaArchivosIcon, descripcion: "Subida de Archivos", ruta: "/archivos"},
];

const menuTransportista = [
{id:0, icono: InicioIcon, descripcion: "Inicio", ruta: ""},
{id:1, icono: EnviosIcon, descripcion: "Envíos", ruta: "envios"},
{id:2, icono: LiquidacionIcon, descripcion: "Liquidaciones", ruta: "liquidaciones"},
{id:3, icono: PerfilIcon, descripcion: "Perfil", ruta: "perfil"}
];

export {menuAdministrador, menuTransportista};
