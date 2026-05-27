import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export interface AuthRequest extends Request {
  user?: { id: number; email: string }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' })
  const token = authHeader.replace(/^Bearer\s+/i, '')
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    req.user = { id: payload.sub, email: payload.email }
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
