import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
import { json } from 'express';
import apiRouter from './api';
import { errorHandler } from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import rateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import conversationRoutes from './routes/conversation.routes';
import uploadRoutes from './routes/upload.routes';
import videoMatchmakingRoutes from './routes/videoMatchmaking.routes';
import liveMatchmakingRouter from './matchmaking/routes/live.routes';
import { logger } from './middleware/logger';
import healthRoutes from './routes/health.routes';
const swaggerDocument = YAML.load('./swagger.yaml');

// Sentry monitoring (prod only)
if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

const app = express();

app.use(json()); // D'abord parser le body

// Logger HTTP (affiche méthode, URL, code retour, temps)
app.use(morgan('dev'));

// Logger custom pour afficher le body de la requête ET la réponse
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  console.log('[HEADERS]', req.headers);
  console.log('[BODY]', req.body);

  // Capture la réponse
  const oldJson = res.json;
  const oldSend = res.send;
  res.json = function (body) {
    console.log('[RESPONSE][res.json]', body);
    return oldJson.call(this, body);
  };
  res.send = function (body) {
    console.log('[RESPONSE][res.send]', body);
    return oldSend.call(this, body);
  };
  next();
});

app.use(cors());
app.use(logger); // Ajout du logger HTTP

// Endpoint de santé
app.use('/health', healthRoutes);

// Rate limiter (exemple: 100 requêtes/15min par IP sur les routes sensibles)
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(['/api/v1/auth', '/api/v1/matchmaking', '/api/v1/friendships'], sensitiveLimiter);

app.use('/api/v1/conversations', conversationRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/video-matchmaking', videoMatchmakingRoutes);
app.use('/api/v1/video-live-matchmaking', liveMatchmakingRouter);
app.use('/api', apiRouter);

// Serve Swagger docs at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

export default app;
