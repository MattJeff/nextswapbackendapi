import morgan from 'morgan';
import { Request, Response } from 'express';

// Format: method url status - response time ms
export const logger = morgan(':method :url :status - :response-time ms');
