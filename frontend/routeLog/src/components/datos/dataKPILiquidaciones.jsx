import ValorTotalIcon from '@mui/icons-material/MonetizationOnOutlined';
import PagoRealizadoIcon from '@mui/icons-material/PriceCheckOutlined';
import PagoPendienteIcon from '@mui/icons-material/IncompleteCircleRounded';
import PorcentajeIcon from '@mui/icons-material/Percent';
import EnviosIcon from '@mui/icons-material/LocalShippingOutlined';

const cardsLiquidaciones = [
{id:"valor_total", icono: ValorTotalIcon, titulo: "Valor total de envíos", color:"#65a30d"},
{id:"pago_realizado", icono: PagoRealizadoIcon, titulo: "Pago realizado", color:"#3b82f6"},
{id:"pago_pendiente", icono: PagoPendienteIcon, titulo: "Pago pendiente", color:"#713dfe"},
{id:"pct_paquetes_liquidados", icono: PorcentajeIcon, titulo: "% Envíos liquidados", color:"#f59e0b"},
];

export const cardsLiquidacionesAdmin = [
{id:"valor_total", icono: ValorTotalIcon, titulo: "Valor total de envíos", color:"#65a30d"},
{id:"pago_realizado", icono: PagoRealizadoIcon, titulo: "Pago realizado", color:"#3b82f6"},
{id:"pago_pendiente", icono: PagoPendienteIcon, titulo: "Pago pendiente", color:"#713dfe"},
{id:"pct_paquetes_liquidados", icono: PorcentajeIcon, titulo: "% Envíos liquidados", color:"#f59e0b"},
{id:"cantidad_envios", icono: EnviosIcon, titulo: "Cantidad de envíos", color:"#3b82f6"},
];

export default cardsLiquidaciones;