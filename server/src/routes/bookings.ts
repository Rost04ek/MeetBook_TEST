import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { hasBookingConflict } from '../services/bookingService'
import { isUserAdmin } from '../services/roomService'

const prisma = new PrismaClient()
const router = Router()

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { roomId, title, description, start, end, participants } = req.body
  // only admins of the room can create bookings
  if (!(await isUserAdmin(req.user!.id, roomId))) return res.status(403).json({ error: 'Forbidden' })
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

// list bookings, optional filter by roomId
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const roomId = req.query.roomId ? Number(req.query.roomId) : undefined
  const where = roomId ? { where: { roomId } } : {}
  const bookings = await (roomId ? prisma.booking.findMany({ where: { roomId } }) : prisma.booking.findMany())
  res.json(bookings)
})

router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id)
  const existing = await prisma.booking.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: 'Booking not found' })
  // only admins of the room can edit bookings
  if (!(await isUserAdmin(req.user!.id, existing.roomId))) return res.status(403).json({ error: 'Forbidden' })
  const { start, end } = req.body
  if (start && end) {
    const s = new Date(start)
    const e = new Date(end)
    if (await hasBookingConflict(existing.roomId, s, e, id)) return res.status(409).json({ error: 'Time conflict' })
  }
  const booking = await prisma.booking.update({ where: { id }, data: req.body })
  res.json(booking)
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id)
  const existing = await prisma.booking.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: 'Booking not found' })
  if (!(await isUserAdmin(req.user!.id, existing.roomId))) return res.status(403).json({ error: 'Forbidden' })
  await prisma.booking.delete({ where: { id } })
  res.status(204).end()
})

// join booking as current user
router.post('/:id/participants', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id)
  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) return res.status(404).json({ error: 'Booking not found' })
  const participant = await prisma.bookingParticipant.create({ data: { bookingId: id, userId: req.user!.id } })
  res.status(201).json(participant)
})

// leave booking (remove participant)
router.delete('/:id/participants', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id)
  await prisma.bookingParticipant.deleteMany({ where: { bookingId: id, userId: req.user!.id } })
  res.status(204).end()
})

export default router
