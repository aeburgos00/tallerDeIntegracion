import ValorTotalIcon from '@mui/icons-material/MonetizationOnOutlined';
import PagoRealizadoIcon from '@mui/icons-material/PriceCheckOutlined';
import PagoPendienteIcon from '@mui/icons-material/IncompleteCircleRounded';
import PorcentajeIcon from '@mui/icons-material/Percent';

const cardsDashboardFooter = [
{id:"valor_total", icono: ValorTotalIcon, titulo: "Valor Total de Envíos", color:"#65a30d"},
{id:"pago_realizado", icono: PagoRealizadoIcon, titulo: "Pago Realizado", color:"#3b82f6"},
{id:"pago_pendiente", icono: PagoPendienteIcon, titulo: "Pago Pendiente", color:"#713dfe"},
{id:"pct_paquetes_liquidados", icono: PorcentajeIcon, titulo: "% Envíos Liquidados", color:"#f59e0b"},
];

export default cardsDashboardFooter;