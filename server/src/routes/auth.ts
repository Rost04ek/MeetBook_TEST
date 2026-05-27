import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

const prisma = new PrismaClient()
const router = Router()

function isValidGmail(email: unknown) {
  if (typeof email !== 'string') return false
  const e = email.trim().toLowerCase()
  // basic email shape + gmail domain
  return /^[a-z0-9._%+-]+@gmail\.com$/i.test(e)
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
  if (!isValidGmail(email)) return res.status(400).json({ error: 'Email must be a valid Gmail address' })
  const hashed = await bcrypt.hash(password, 10)
  try {
    const user = await prisma.user.create({ data: { email: email.toLowerCase().trim(), name, password: hashed } })
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '3d' })
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
  if (!isValidGmail(email)) return res.status(400).json({ error: 'Email must be a valid Gmail address' })
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

export default router
