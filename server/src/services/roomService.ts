import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getUserRole(userId: number, roomId: number) {
  const member = await prisma.roomMember.findUnique({ where: { userId_roomId: { userId, roomId } } })
  return member?.role || null
}

export async function isUserAdmin(userId: number, roomId: number) {
  const role = await getUserRole(userId, roomId)
  return role === 'ADMIN'
}
