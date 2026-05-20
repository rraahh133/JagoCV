import express from 'express';
import cors from 'cors';
import { PORT, CORS_ORIGINS } from './config';
import { httpLogger } from './middleware/logger';
import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/documents.routes';
import chatRoutes from './routes/chat.routes';
import experienceRoutes from './routes/experience.routes';
import educationRoutes from './routes/education.routes';
import aiUsageRoutes from './routes/aiUsage.routes';

// Config validation + dotenv sudah dijalankan di dalam config.ts
// (import config.ts di atas melalui PORT/CORS_ORIGINS sudah memicu proses.exit jika invalid)

const app = express();

// ===================================================================
// MIDDLEWARE GLOBAL
// ===================================================================

app.use(cors({ origin: CORS_ORIGINS, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(httpLogger);

// ===================================================================
// ROUTES
// ===================================================================

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/ai-usage', aiUsageRoutes);

// ===================================================================
// START
// ===================================================================

app.listen(PORT, () => {
  console.log(`✅ JagoCV Backend aktif di http://localhost:${PORT}`);
});
