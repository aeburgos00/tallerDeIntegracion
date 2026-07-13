import TotalLiqIcon from '@mui/icons-material/ReceiptLong';
import LiqCerradasIcon from '@mui/icons-material/Task';
import LiqAbiertasIcon from '@mui/icons-material/RequestPage';
import TransporistasIcon from "@mui/icons-material/LocalShipping";

export const cardLiquidaciones = [
{id:"total_liquidado", icono: TotalLiqIcon, titulo: "Total liquidado", color:"#3b82f6"},
{id:"liq_cerradas", icono: LiqCerradasIcon, titulo: "Liquidaciones cerradas", color:"#65a30d"},
{id:"liq_abiertas", icono: LiqAbiertasIcon, titulo: "Liquidaciones abiertas", color:"#ef9227"},
{id:"transportistas_en_periodo", icono: TransporistasIcon, titulo: "Transportistas en periodo", color:"#713dfe", }
];

export default cardLiquidaciones;
