// Vercel serverless function for /api/rules
import { rules } from '../../web/data/store.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json(rules);
}
