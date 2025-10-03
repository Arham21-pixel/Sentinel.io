export type Token =
  | { type: 'LPAREN' }
  | { type: 'RPAREN' }
  | { type: 'AND' }
  | { type: 'OR' }
  | { type: 'NOT' }
  | { type: 'IMPLIES' }
  | { type: 'IFF' }
  | { type: 'IDENT'; value: string };

const KEYWORDS: Record<string, Token['type']> = {
  and: 'AND',
  or: 'OR',
  not: 'NOT',
  '->': 'IMPLIES',
  '=>': 'IMPLIES',
  '<->': 'IFF',
  '<=>': 'IFF',
};

export function tokenize(input: string): Token[] {
  const s = input.trim();
  const tokens: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      i += 1;
      continue;
    }
    if (c === '(') {
      tokens.push({ type: 'LPAREN' });
      i += 1;
      continue;
    }
    if (c === ')') {
      tokens.push({ type: 'RPAREN' });
      i += 1;
      continue;
    }
    // multi-char operators
    if (s.startsWith('<=>', i) || s.startsWith('<->', i)) {
      tokens.push({ type: 'IFF' });
      i += 3;
      continue;
    }
    if (s.startsWith('=>', i) || s.startsWith('->', i)) {
      tokens.push({ type: 'IMPLIES' });
      i += 2;
      continue;
    }
    // word operators and identifiers (including function calls with colons and parentheses)
    if (/[A-Za-z_]/.test(c)) {
      let j = i + 1;
      // Allow letters, numbers, underscores, colons, dots, hyphens, and parentheses in identifiers
      while (j < s.length && /[A-Za-z0-9_:\-.,()]/.test(s[j])) {
        j += 1;
      }
      const word = s.slice(i, j);
      const lower = word.toLowerCase();
      
      // Check if it's a keyword (but not if it contains colons or parentheses)
      if (!word.includes(':') && !word.includes('(') && lower in KEYWORDS) {
        const t = KEYWORDS[lower];
        if (t === 'IMPLIES' || t === 'IFF') {
          // Not expected via words, but keep for completeness
          tokens.push({ type: t });
        } else if (t === 'AND') tokens.push({ type: 'AND' });
        else if (t === 'OR') tokens.push({ type: 'OR' });
        else if (t === 'NOT') tokens.push({ type: 'NOT' });
      } else {
        tokens.push({ type: 'IDENT', value: word });
      }
      i = j;
      continue;
    }
    throw new Error(`Unexpected character '${c}' at ${i}`);
  }
  return tokens;
}


