import {
  Grid,
  Paper,
  Typography
} from "@mui/material";

export default function Dashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">
            Envíos Totales
          </Typography>

          <Typography variant="h4">
            152
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">
            Entregados
          </Typography>

          <Typography variant="h4">
            134
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">
            Pendientes
          </Typography>

          <Typography variant="h4">
            18
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}