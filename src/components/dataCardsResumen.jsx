import TotalIcon from '@mui/icons-material/Inventory';
import EnTransitoIcon from "@mui/icons-material/LocalShipping";
import EntregadosIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PendientesIcon from '@mui/icons-material/PendingOutlined';
import FallidosIcon from '@mui/icons-material/CancelOutlined';

const cards = [
{id:0, icono: TotalIcon, titulo: "Total envíos", cantidad: 1248, descripcion:"", color:"#3b82f6", colorTorta:"#ffffff"},
{id:1, icono: EnTransitoIcon, titulo: "En tránsito", cantidad: 632, descripcion: "50.6% del total", color:"#65a30d", colorTorta:"#3b82f6"},
{id:2, icono: EntregadosIcon, titulo: "Entregados", cantidad: 544, descripcion: "43.6% del total", color:"#f59e0b", colorTorta:"#65a30d"},
{id:3, icono: PendientesIcon, titulo: "Pendientes", cantidad: 72, descripcion: "5.8% del total", color:"#713dfe", colorTorta:"#f59e0b"},
{id:4, icono: FallidosIcon, titulo: "Visitas Fallidas", cantidad: 18, descripcion: "", color:"#ef4444", colorTorta:"#ef4444"},
];

export default cards;
