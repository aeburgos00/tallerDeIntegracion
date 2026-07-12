import TotalEnviosIcon from '@mui/icons-material/Inventory';
import ValorTotalIcon from '@mui/icons-material/MonetizationOnOutlined';
import EnviosLiquidadosIcon from "@mui/icons-material/LocalShipping";
import ValorLiquidadoIcon from '@mui/icons-material/PriceCheckOutlined';
import PorcentajeIcon from '@mui/icons-material/Percent';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import PagoPendienteIcon from '@mui/icons-material/AccountBalanceOutlined';

export const cardLiquidaciones = [
{id:"cantidad_liquidaciones", icono: ReceiptLongIcon, titulo: "Total liquidaciones", color:"#3b82f6"},
{id:"valor_total", icono: ValorTotalIcon, titulo: "Valor total de liquidaciones", color:"#f59e0b"},
{id:"pago_realizado", icono: PriceCheckIcon, titulo: "Pago realizado", color:"#65a30d"},
{id:"pago_pendiente", icono: PagoPendienteIcon, titulo: "Pago pendiente", color:"#718096"},
{id:"pct_paquetes_liquidados", icono: PorcentajeIcon, titulo: "% Liquidaciones cerradas", color:"#713dfe"},
];

export default cardLiquidaciones;
