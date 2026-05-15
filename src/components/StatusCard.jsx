import {
  Paper,
  Typography,
  Box
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

import data from "./dataCardsResumen";
const { cardsHeader } = data;

export default function StatusCard() {

    const total = cardsHeader.filter(c => c.titulo === "Total envíos")[0].cantidad;

    const subTotales = 
    cardsHeader.filter(d => d.titulo !== "Total envíos")
    .map(
      c => (
        {name: c.titulo, value: c.cantidad, color: c.colorTorta}
      )
    );

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #e5e7eb",
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* TITULO */}
      <Typography
            sx={{
            fontSize: 20,
            fontWeight: 600,
            mb: 3,
            textAlign: "center",
            }}
        >
            Estado de envíos
      </Typography>

      {/* CONTENIDO */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "180px 1fr"
          },
          alignItems: "center",
          gap: 3
        }}
      >
        {/* GRAFICO */}
        <Box
          sx={{
            width: 180,
            height: 180,
            position: "relative",
            mx: "auto"
          }}
        >
          <ResponsiveContainer>
            <PieChart>

              <Pie
                data={subTotales}
                dataKey="value"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={0}
                startAngle={90}
                endAngle={450}
                stroke="none"
              >
                {subTotales.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                  />
                ))}
              </Pie>

            </PieChart>
          </ResponsiveContainer>

          {/* TEXTO CENTRAL */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center"
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                color: "#9ca3af"
              }}
            >
              Total
            </Typography>

            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 700
              }}
            >
              {total}
            </Typography>
          </Box>
        </Box>

        {/* LEYENDA */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            minWidth: 0
          }}
        >
          {subTotales.map((item) => (
            <Box
              key={item.name}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              {/* ETIQUETA */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: 0
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: item.color,
                    flexShrink: 0
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#4b5563",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {item.name}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  flexShrink: 0
                }}
              >
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>

      </Box>
    </Paper>
  );
}