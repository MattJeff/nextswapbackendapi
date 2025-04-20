import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Assure que les variables d'environnement de test sont chargées
dotenv.config({ path: '.env.test' });

export const getAuthHeader = (userId: string): { Authorization: string } => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in .env.test');
  }
  const token = jwt.sign({ userId }, secret, { expiresIn: '1h' });
  return { Authorization: `Bearer ${token}` };
};
