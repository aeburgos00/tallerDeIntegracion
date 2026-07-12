import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.route.js'

import transportistas from './routes/transportistas.route.js'
import liquidaciones from './routes/liquidaciones.route.js'
import localidades from './routes/localidades.route.js'
import envios from "./routes/envios.route.js"
import estados from "./routes/estados.route.js"
import clientes from "./routes/clientes.route.js"
import direcciones from "./routes/direcciones.route.js"
import tarifas from "./routes/tarifas.route.js"
import provincias from './routes/provincias.route.js'
import archivos from "./routes/archivos.route.js"

const PORT = process.env.PORT || 3000

const app = express()

app.use(cors(
  {
    origin: [
      'http://localhost:5173',
      'https://tallerdeintegracionroutelog.vercel.app/'
    ]
  }
))

app.use(express.json())


app.get('/', (req, res) => {
  res.send('Backend funcionando')
})

app.use('/auth', authRoutes)

app.use('/transportistas', transportistas)
app.use('/transportistas/activos', transportistas)
app.use('/transportistas/totales', transportistas)


app.use('/localidades', localidades)
app.use('/localidades/activas', localidades)
app.use('/localidades/totales', localidades)

app.use('/envios', envios)
app.use('/envios/transportistas', envios)
app.use('/envios/totales', envios)
app.use('/envios/recientes', envios)

app.use('/liquidaciones', liquidaciones)
app.use('/liquidaciones/totales', liquidaciones)
app.use('/liquidaciones/transportistas', liquidaciones)

app.use('/estados', estados)

app.use('/clientes', clientes)

app.use('/direcciones', direcciones)
app.use('/direcciones/cliente/localidad', direcciones)
app.use('/tarifas', tarifas)
app.use('/tarifas/transportista/localidad', tarifas)

app.use('/archivos', archivos)
app.use('/archivos/envios', archivos)

app.use('/provincias', provincias)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})