import express from 'express';
import { buildMobileApp } from '../../services/buildService';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { description, integrations = [] } = req.body;
    const result = await buildMobileApp(description, integrations);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;