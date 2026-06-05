import express from 'express';
import { callExternalAPI, testIntegration } from '../../services/integrationService';
const router = express.Router();

router.post('/test', async (req, res) => {
  const { type } = req.body;
  const ok = await testIntegration(type);
  res.json({ success: ok, message: ok ? '✅ Working' : '❌ Missing key' });
});

router.post('/call', async (req, res) => {
  const { apiUrl, method = 'GET', headers = {}, body = null } = req.body;
  const result = await callExternalAPI(apiUrl, method, headers, body);
  res.json(result);
});

export default router;