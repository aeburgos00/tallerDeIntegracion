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
      process.env.FRONT_URL,
      process.env.FRONT_URL_PROD
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
))

app.use(express.json())


app.get('/', (req, res) => {
  res.send('Backend funcionando')
})

app.use('/auth', authRoutes)

app.use('/transportistas', transportistas)

app.use('/localidades', localidades)

app.use('/envios', envios)

app.use('/liquidaciones',liquidaciones)

app.use('/estados', estados)

app.use('/clientes', clientes)

app.use('/direcciones', direcciones)

app.use('/tarifas', tarifas)

app.use('/archivos', archivos)

app.use('/provincias', provincias)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
