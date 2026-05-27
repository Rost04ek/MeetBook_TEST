import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { isUserAdmin } from '../services/roomService'

const prisma = new PrismaClient()
const router = Router()

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { name, description } = req.body
  const room = await prisma.room.create({ data: { name, description } })
  // add creator as admin
  await prisma.roomMember.create({ data: { roomId: room.id, userId: req.user!.id, role: 'ADMIN' } })
  res.status(201).json(room)
})

router.get('/', requireAuth, async (_req: AuthRequest, res) => {
  const rooms = await prisma.room.findMany({ include: { members: { include: { user: true } } } })
  res.json(rooms)
})

router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id)
  const room = await prisma.room.findUnique({ where: { id }, include: { members: { include: { user: true } }, bookings: true } })
  if (!room) return res.status(404).json({ error: 'Room not found' })
  res.json(room)
})

router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id)
  const room = await prisma.room.update({ where: { id }, data: req.body })
  res.json(room)
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id)
  await prisma.room.delete({ where: { id } })
  res.status(204).end()
})

router.post('/:id/members', requireAuth, async (req: AuthRequest, res) => {
  const roomId = Number(req.params.id)
  const { email, role } = req.body
  // only admins can add members
  if (!(await isUserAdmin(req.user!.id, roomId))) return res.status(403).json({ error: 'Forbidden' })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(404).json({ error: 'User not found' })
  const member = await prisma.roomMember.upsert({
    where: { userId_roomId: { userId: user.id, roomId } },
    update: { role },
    create: { userId: user.id, roomId, role }
  })
  res.json(member)
})

export default router
