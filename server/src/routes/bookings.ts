import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { hasBookingConflict } from '../services/bookingService'

const prisma = new PrismaClient()
const router = Router()

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { roomId, title, description, start, end, participants } = req.body
  const s = new Date(start)
  const e = new Date(end)
  if (await hasBookingConflict(roomId, s, e)) return res.status(409).json({ error: 'Time conflict' })
  const booking = await prisma.booking.create({
    data: {
      roomId,
      title,
      description,
      start: s,
      end: e,
      createdById: req.user!.id,
      participants: { create: (participants || []).map((uId: number) => ({ userId: uId })) }
    }
  })
  res.status(201).json(booking)
})

router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id)
  const { start, end } = req.body
  if (start && end) {
    const s = new Date(start)
    const e = new Date(end)
    if (await hasBookingConflict(req.body.roomId, s, e, id)) return res.status(409).json({ error: 'Time conflict' })
  }
  const booking = await prisma.booking.update({ where: { id }, data: req.body })
  res.json(booking)
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id)
  await prisma.booking.delete({ where: { id } })
  res.status(204).end()
})

export default router
