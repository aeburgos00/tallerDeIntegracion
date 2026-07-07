import TotalIcon from "@mui/icons-material/Groups";
import ActivosIcon from "@mui/icons-material/CheckCircle";
import InactivosIcon from "@mui/icons-material/PersonOff";
import TarifaIcon from "@mui/icons-material/AttachMoney";

const cardsTransportistas = [
  {
    id: "total",
    icono: TotalIcon,
    titulo: "Total Transportistas",
    color: "#3b82f6",
    colorTorta: "#ffffff"
  },
  {
    id: "activos",
    icono: ActivosIcon,
    titulo: "Activos",
    color: "#65a30d",
    colorTorta: "#65a30d"
  },
  {
    id: "inactivos",
    icono: InactivosIcon,
    titulo: "Inactivos",
    color: "#ef4444",
    colorTorta: "#ef4444"
  },
  {
    id: "tarifa_promedio",
    icono: TarifaIcon,
    titulo: "Tarifa Promedio",
    color: "#f59e0b",
    colorTorta: "#f59e0b"
  }
];

export default cardsTransportistas;