import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth'
import roomRoutes from './routes/rooms'
import bookingRoutes from './routes/bookings'

dotenv.config()

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 3001

app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/rooms', roomRoutes)
app.use('/bookings', bookingRoutes)

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
