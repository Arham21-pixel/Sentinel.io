import express from 'express';
import { z } from 'zod';
import { evaluate } from './logic/index.js';
import { users, rules, categorize } from './data/store.js';
import type { EvaluationInput } from './types.js';

export const router = express.Router();

router.get('/users', (_req, res) => {
  res.json(users);
});

router.get('/rules', (_req, res) => {
  res.json(rules);
});

const evalSchema = z.object({
  userId: z.string(),
  url: z.string().url(),
  isoDateTime: z.string().datetime().optional(),
});

router.post('/evaluate', (req, res) => {
  const parsed = evalSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const input = parsed.data as EvaluationInput;
  let url: URL | null = null;
  try { url = new URL(input.url); } catch { url = null; }
  const categories = categorize(url);
  const result = evaluate(input, rules, users, categories);
  return res.json(result);
});


