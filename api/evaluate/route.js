// Vercel serverless function for /api/evaluate
import { z } from 'zod';
import { evaluate } from '../../web/logic/index.js';
import { users, rules, categorize } from '../../web/data/store.js';

const evalSchema = z.object({
  userId: z.string(),
  url: z.string().url(),
  isoDateTime: z.string().datetime().optional(),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const parsed = evalSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const input = parsed.data;
    let url = null;
    try { url = new URL(input.url); } catch { url = null; }
    const categories = categorize(url);
    const result = evaluate(input, rules, users, categories);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Evaluation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
