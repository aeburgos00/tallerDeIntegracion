import TotalIcon from '@mui/icons-material/Inventory';
import EnTransitoIcon from "@mui/icons-material/LocalShipping";
import EntregadosIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PendientesIcon from '@mui/icons-material/PendingOutlined';
import FallidosIcon from '@mui/icons-material/CancelOutlined';


import ValorTotalIcon from '@mui/icons-material/MonetizationOnOutlined';
import PagoRealizadoIcon from '@mui/icons-material/PriceCheckOutlined';
import PagoPendienteIcon from '@mui/icons-material/IncompleteCircleRounded';
import TransportistasIcon from '@mui/icons-material/PeopleRounded';


const  cardsHeader = [
{id:0, icono: TotalIcon, titulo: "Total envíos", cantidad: 1248, descripcion:"", color:"#3b82f6", colorTorta:"#ffffff"},
{id:1, icono: EnTransitoIcon, titulo: "En tránsito", cantidad: 632, descripcion: "50.6% del total", color:"#65a30d", colorTorta:"#3b82f6"},
{id:2, icono: EntregadosIcon, titulo: "Entregados", cantidad: 544, descripcion: "43.6% del total", color:"#f59e0b", colorTorta:"#65a30d"},
{id:3, icono: PendientesIcon, titulo: "Pendientes", cantidad: 72, descripcion: "5.8% del total", color:"#713dfe", colorTorta:"#f59e0b"},
{id:4, icono: FallidosIcon, titulo: "Visitas Fallidas", cantidad: 18, descripcion: "", color:"#ef4444", colorTorta:"#ef4444"},
];


const cardsFooter = [
{id:0, icono: ValorTotalIcon, titulo: "Valor total de envíos", cantidad: "$1.248.560.000", descripcion:"", color:"#65a30d"},
{id:1, icono: PagoRealizadoIcon, titulo: "Pago realizado", cantidad: "$842.350.000", descripcion:"65,5% del total", color:"#3b82f6"},
{id:2, icono: PagoPendienteIcon, titulo: "Pago pendiente", cantidad: "$406.210.000", descripcion:"32,5% del total", color:"#713dfe"},
{id:3, icono: TransportistasIcon, titulo: "Transportistas activos", cantidad: 24, descripcion: "", color:"#639922"},
];

export default { cardsHeader, cardsFooter };
