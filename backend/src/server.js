import express from 'express'
import transportistasRoutes from './routes/transportistas.route.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend funcionando')
})

app.use('/transportistas', transportistasRoutes)

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000')
})

