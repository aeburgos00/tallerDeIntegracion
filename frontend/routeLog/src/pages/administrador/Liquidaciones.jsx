import {
  Box,
} from "@mui/material"

import TableResumenCard from "../../components/TableResumenCard.jsx"
import SummaryCard from "../../components/SummaryCard"

import AbcIcon from '@mui/icons-material/Abc';

const kpi = [
    {"titulo":"KP1"},
    {"titulo":"KP2"},
    {"titulo":"KP3"},
    {"titulo":"KP4"}]


export default function Liquidaciones() {

  return (
    //Contenedor total
    <Box
    sx={{
      display:"flex",
      flexDirection:"column",
      gap: 2
    }}
    >
      {/* KPI x4 */}
      <Box 
      sx={{
        display:"grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap:2
      }}
      >
        {
        kpi.map((e) => (
          <SummaryCard 
          titulo= {e.titulo}
          cantidad={"0"}
          descripcion={""}
          icono={AbcIcon}
          />
        ))
        }
        
      </Box>

      {/* Filtros */}
      <Box sx={{background:"#ff2233"}}>
      <h2>
        Filtros
      </h2>
      </Box>


      {/* Grilla */}
      <Box>
        {/* Grilla */}
        <TableResumenCard></TableResumenCard>
        {/* Filtros y paginacion */}
        <Box sx={{
          display:"grid",
          gridTemplateColumns: "8fr 4fr",
          gap:2
        }}
        >
          <h3>Filas x pag</h3>
          <Box
          sx={{
            display:"flex",
            gap:4,
          }}
          >
            <p>Pagina 1 de 3</p>
            <p> ant </p>
            <p> 1 </p>
            <p> 2 </p>
            <p> 3 </p>
            <p> sig </p>
          </Box>
        </Box>
      </Box>

    </Box>
  )
}
