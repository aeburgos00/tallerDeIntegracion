import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import EnviosIcon from "@mui/icons-material/LocalShipping";
import TransportistaIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import LocalidadIcon from '@mui/icons-material/LocationCity';
import LiquidacionIcon from '@mui/icons-material/MonetizationOn';
import SubidaArchivosIcon from '@mui/icons-material/InsertDriveFile';
import ConfiguracionIcon from '@mui/icons-material/Settings';

const menu = [
{id:0, icono: DashboardIcon, descripcion: "Dashboard", ruta: "/"},
{id:1, icono: EnviosIcon, descripcion: "Envío de Paquetes", ruta: "/envios"},
{id:2, icono: TransportistaIcon, descripcion: "Transportistas", ruta: "/transportistas"},
{id:3, icono: LocalidadIcon, descripcion: "Localidades", ruta: "/localidades"},
{id:4, icono: LiquidacionIcon, descripcion: "Liquidaciones", ruta: "/liquidaciones"},
{id:5, icono: SubidaArchivosIcon, descripcion: "Subida de Archivos", ruta: "/archivos"},
{id:6, icono: ConfiguracionIcon, descripcion: "Configuración", ruta: "/configuracion"}
];

export default menu;
