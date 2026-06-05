import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// YOURS
import chatRoutes from './routes/chat';

// NEW
import webBuilder from './routes/builder/web-app';
import mobileBuilder from './routes/builder/mobile-app';
import gameBuilder from './routes/builder/game';
import websiteBuilder from './routes/builder/website';
import integrationRoutes from './routes/integrations/connect';
import paymentRoutes from './routes/integrations/payments';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// YOUR ENDPOINT
app.use('/api/chat', chatRoutes);

// NEW ENDPOINTS
app.use('/api/build/web', webBuilder);
app.use('/api/build/mobile', mobileBuilder);
app.use('/api/build/game', gameBuilder);
app.use('/api/build/website', websiteBuilder);
app.use('/api/integrations', integrationRoutes);
app.use('/api/payments', paymentRoutes);

app.use('/download', express.static(path.join(__dirname, '../generated')));

app.listen(PORT, () => {
  console.log(`✅ Freedom Forge: http://localhost:${PORT}`);
});