import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function hasBookingConflict(roomId: number, start: Date, end: Date, excludeBookingId?: number) {
  const where: any = {
    roomId,
    AND: [
      { end: { gt: start } },
      { start: { lt: end } }
    ]
  }
  if (excludeBookingId) where.id = { not: excludeBookingId }
  const conflict = await prisma.booking.findFirst({ where })
  return !!conflict
}
