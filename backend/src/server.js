import express from 'express'
import cors from 'cors'
import transportistasRoutes from './routes/transportistas.route.js'

import enviosPorTransportistasRoutes from './routes/enviosPorTransportista.route.js'
import enviosTotales from './routes/enviosTotales.route.js'
import enviosRecientes from './routes/enviosRecientes.route.js'
import liquidacionesTotales from './routes/liquidacionesTotales.route.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(cors(
  {origin: [
  'http://localhost:5173',
  'https://tallerdeintegracionroutelog.vercel.app/'
  ]}
))

app.use(express.json())

// ACA SE LISTAN LOS ENDPOINTS

app.get('/', (req, res) => {
  res.send('Backend funcionando')
})

app.use('/transportistas', transportistasRoutes)

app.use('/envios-por-transportista',enviosPorTransportistasRoutes)
app.use('/envios-totales', enviosTotales)
app.use('/envios-recientes',enviosRecientes)
app.use('/liquidaciones-totales',liquidacionesTotales)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

