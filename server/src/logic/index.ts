import dayjs from 'dayjs';
import { tokenize } from './tokenizer.js';
import { parse } from './parser.js';
import { evaluateAst, type AtomResolver } from './evaluator.js';
import type { AtomContext, EvaluationInput, EvaluationResult, Rule, User } from '../types.js';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export function compileExpression(expr: string) {
  const tokens = tokenize(expr);
  const ast = parse(tokens);
  return ast;
}

export function buildContext(input: EvaluationInput, users: User[], categories: string[]): AtomContext {
  const d = input.isoDateTime ? dayjs(input.isoDateTime) : dayjs();
  const dayOfWeek = WEEKDAYS[d.day() === 0 ? 6 : d.day() - 1];
  const time24 = d.format('HH:mm');
  let parsedUrl: URL | null = null;
  try {
    parsedUrl = new URL(input.url);
  } catch {
    parsedUrl = null;
  }
  const user = users.find((u) => u.id === input.userId) ?? null;
  return { user, url: parsedUrl, categories, dayOfWeek, time24 };
}

// Example atoms supported:
// user:is(<id>)
// role:is(child|parent|admin)
// day:is(Mon..Sun)
// time:between(HH:mm,HH:mm)
// url:host(is|endsWith|includes)(value)
// url:category(is)(categoryName)
export const defaultAtomResolver: AtomResolver = (name, ctx) => {
  // Simple DSL using name and colon segments
  const [ns, rest] = name.split(':', 2);
  if (!rest) return resolveSimple(name, ctx);
  const [op, argStrRaw] = splitOnce(rest, '(');
  const argStr = argStrRaw?.endsWith(')') ? argStrRaw.slice(0, -1) : argStrRaw;
  const args = (argStr ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  switch (ns) {
    case 'user':
      if (op === 'is' && args[0]) return ctx.user?.id === args[0];
      return false;
    case 'role':
      if (op === 'is' && args[0]) return ctx.user?.role === (args[0] as User['role']);
      return false;
    case 'day':
      if (op === 'is' && args[0]) return ctx.dayOfWeek === args[0];
      return false;
    case 'time':
      if (op === 'between' && args.length === 2) {
        const [start, end] = args;
        return ctx.time24 >= start && ctx.time24 <= end;
      }
      return false;
    case 'url':
      if (!ctx.url) return false;
      if (op === 'host') {
        const subop = args[0];
        const val = args[1];
        if (!subop || !val) return false;
        if (subop === 'is') return ctx.url.host === val;
        if (subop === 'endsWith') return ctx.url.host.endsWith(val);
        if (subop === 'includes') return ctx.url.host.includes(val);
        return false;
      }
      if (op === 'category' && args.length >= 2) {
        const subop = args[0];
        const val = args[1];
        if (subop === 'is' && val) {
          return ctx.categories.includes(val);
        }
        return false;
      }
      return false;
    default:
      return resolveSimple(name, ctx);
  }
};

function splitOnce(s: string, ch: string): [string, string | undefined] {
  const idx = s.indexOf(ch);
  if (idx === -1) return [s, undefined];
  return [s.slice(0, idx), s.slice(idx + 1)];
}

function resolveSimple(name: string, ctx: AtomContext): boolean {
  switch (name) {
    case 'isWeekend':
      return ctx.dayOfWeek === 'Sat' || ctx.dayOfWeek === 'Sun';
    case 'isWeekday':
      return !['Sat', 'Sun'].includes(ctx.dayOfWeek);
    default:
      return false;
  }
}

export function evaluate(input: EvaluationInput, rules: Rule[], users: User[], categories: string[], resolver: AtomResolver = defaultAtomResolver): EvaluationResult {
  const ctx = buildContext(input, users, categories);
  const activeRules = rules.filter((r) => r.enabled);
  const sorted = [...activeRules].sort((a, b) => b.priority - a.priority);
  const matched: string[] = [];
  const reasons: string[] = [];
  for (const r of sorted) {
    try {
      const ast = compileExpression(r.expression);
      const ok = evaluateAst(ast, ctx, resolver);
      if (ok) {
        matched.push(r.id);
        reasons.push(`${r.effect.toUpperCase()} by rule '${r.name}'`);
        // First match decides due to priority ordering
        return { decision: r.effect, matchedRuleIds: matched, reasons };
      }
    } catch (err) {
      reasons.push(`Rule '${r.name}' parse/eval error: ${(err as Error).message}`);
    }
  }
  // Default deny for safety
  return { decision: 'block', matchedRuleIds: matched, reasons: reasons.length ? reasons : ['No rule matched; default BLOCK'] };
}


