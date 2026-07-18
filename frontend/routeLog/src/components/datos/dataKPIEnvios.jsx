import TotalIcon from '@mui/icons-material/Inventory';
import PendientesIcon from "@mui/icons-material/LocalShipping";
import EntregadosIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import NoVisitadosIcon from '@mui/icons-material/PendingOutlined';
import FallidosIcon from '@mui/icons-material/CancelOutlined';
import CanceladosIcon from '@mui/icons-material/DoDisturbOn';

const cardsEnvios = [
    { id: "total", icono: TotalIcon, titulo: "Total Envíos", color: "#3b82f6", colorTorta: "#ffffff" },
    { id: "entregados", icono: EntregadosIcon, titulo: "Entregados", color: "#65a30d", colorTorta: "#65a30d" },
    { id: "no_visitados", icono: NoVisitadosIcon, titulo: "No Visitados", color: "#f59e0b", colorTorta: "#f59e0b" },
    { id: "visitas_fallidas", icono: FallidosIcon, titulo: "Visitas Fallidas", color: "#ef4444", colorTorta: "#ef4444" },
    { id: "pendientes", icono: PendientesIcon, titulo: "Pendientes", color: "#713dfe", colorTorta: "#3b82f6" },
    { id: "cancelados", icono: CanceladosIcon, titulo: "Cancelados", color: "#718096", colorTorta: "#CCCCCC" }
];


export default cardsEnvios
