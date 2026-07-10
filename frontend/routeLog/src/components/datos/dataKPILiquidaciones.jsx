import TotalEnviosIcon from '@mui/icons-material/Inventory';
import ValorTotalIcon from '@mui/icons-material/MonetizationOnOutlined';
import EnviosLiquidadosIcon from "@mui/icons-material/LocalShipping";
import ValorLiquidadoIcon from '@mui/icons-material/PriceCheckOutlined';
import PorcentajeIcon from '@mui/icons-material/Percent';

const cardLiquidaciones = [
{id:"total_envios", icono: TotalEnviosIcon, titulo: "Total envíos", color:"#3b82f6"},
{id:"valor_total", icono: ValorTotalIcon, titulo: "Valor total de envíos", color:"#3b82f6"},
{id:"envios_liquidados", icono: EnviosLiquidadosIcon, titulo: "Envíos liquidados", color:"#65a30d", colorTorta:"#65a30d"},
{id:"valor_liquidado", icono: ValorLiquidadoIcon, titulo: "Valor liquidado", color:"#65a30d", colorTorta:"#65a30d"},
{id:"pct_paquetes_liquidados", icono: PorcentajeIcon, titulo: "% Envíos liquidados", color:"#f59e0b"},
];

export default cardLiquidaciones;
