import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error.message);
  
  if (error.name === 'ValidationError') {
    res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    res.status(401).json({ error: 'Invalid token' });
  } else if (error.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'Token expired' });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
};