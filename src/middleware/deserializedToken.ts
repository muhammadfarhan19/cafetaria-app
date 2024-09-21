import { NextFunction, Request, Response } from 'express'
import { verifyJWT } from '../utils/jwt'
import { logger } from '../utils/logger'

const deserializeToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '')

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const { decoded, expired } = verifyJWT(accessToken)

    if (decoded) {
      res.locals.user = decoded
      return next()
    }

    if (expired) {
      return res.status(401).json({ message: 'Token expired' })
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error('JWT Verification Error:', error.message)
    }
    return res.status(401).json({ message: 'Invalid Token' })
  }
}

export default deserializeToken
