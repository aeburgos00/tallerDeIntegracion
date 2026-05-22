import TotalIcon from '@mui/icons-material/Inventory';
import PendientesIcon from "@mui/icons-material/LocalShipping";
import EntregadosIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import NoVisitadosIcon from '@mui/icons-material/PendingOutlined';
import FallidosIcon from '@mui/icons-material/CancelOutlined';


import ValorTotalIcon from '@mui/icons-material/MonetizationOnOutlined';
import PagoRealizadoIcon from '@mui/icons-material/PriceCheckOutlined';
import PagoPendienteIcon from '@mui/icons-material/IncompleteCircleRounded';
import TransportistasIcon from '@mui/icons-material/PeopleRounded';

const  cardsHeader = [
{id:"total", icono: TotalIcon, titulo: "Total envíos", color:"#3b82f6", colorTorta:"#ffffff"},
{id:"entregados", icono: EntregadosIcon, titulo: "Entregados", color:"#65a30d", colorTorta:"#65a30d"},
{id:"no_visitados", icono: NoVisitadosIcon, titulo: "No visitados", color:"#f59e0b", colorTorta:"#f59e0b"},
{id:"visitas_fallidas", icono: FallidosIcon, titulo: "Visitas Fallidas", color:"#ef4444", colorTorta:"#ef4444"},
{id:"pendientes", icono: PendientesIcon, titulo: "Pendientes", color:"#713dfe", colorTorta:"#3b82f6"},
];


const cardsFooter = [
{id:"valor_total", icono: ValorTotalIcon, titulo: "Valor total de envíos", color:"#65a30d"},
{id:"pago_realizado", icono: PagoRealizadoIcon, titulo: "Pago realizado", color:"#3b82f6"},
{id:"pago_pendiente", icono: PagoPendienteIcon, titulo: "Pago pendiente", color:"#713dfe"},
{id:"transportistas_activos", icono: TransportistasIcon, titulo: "Transportistas activos", color:"#639922"},
];

export default { cardsHeader, cardsFooter };
