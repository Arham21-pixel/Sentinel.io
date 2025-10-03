import type { Token } from './tokenizer.js';

export type AstNode =
  | { type: 'IDENT'; name: string }
  | { type: 'NOT'; expr: AstNode }
  | { type: 'AND'; left: AstNode; right: AstNode }
  | { type: 'OR'; left: AstNode; right: AstNode }
  | { type: 'IMPLIES'; left: AstNode; right: AstNode }
  | { type: 'IFF'; left: AstNode; right: AstNode };

export function parse(tokens: Token[]): AstNode {
  let i = 0;

  function peek(): Token | undefined {
    return tokens[i];
  }

  function consume(): Token {
    const t = tokens[i];
    if (!t) throw new Error('Unexpected end of input');
    i += 1;
    return t;
  }

  // Grammar (precedence: NOT > AND > OR > IMPLIES > IFF)
  // expr := iff
  // iff := implies ( IFF implies )*
  // implies := or ( IMPLIES or )*
  // or := and ( OR and )*
  // and := unary ( AND unary )*
  // unary := NOT unary | primary
  // primary := IDENT | '(' expr ')'

  function parseExpr(): AstNode {
    return parseIff();
  }

  function parseIff(): AstNode {
    let node = parseImplies();
    while (peek()?.type === 'IFF') {
      consume();
      const right = parseImplies();
      node = { type: 'IFF', left: node, right };
    }
    return node;
  }

  function parseImplies(): AstNode {
    let node = parseOr();
    while (peek()?.type === 'IMPLIES') {
      consume();
      const right = parseOr();
      node = { type: 'IMPLIES', left: node, right };
    }
    return node;
  }

  function parseOr(): AstNode {
    let node = parseAnd();
    while (peek()?.type === 'OR') {
      consume();
      const right = parseAnd();
      node = { type: 'OR', left: node, right };
    }
    return node;
  }

  function parseAnd(): AstNode {
    let node = parseUnary();
    while (peek()?.type === 'AND') {
      consume();
      const right = parseUnary();
      node = { type: 'AND', left: node, right };
    }
    return node;
  }

  function parseUnary(): AstNode {
    if (peek()?.type === 'NOT') {
      consume();
      return { type: 'NOT', expr: parseUnary() };
    }
    return parsePrimary();
  }

  function parsePrimary(): AstNode {
    const t = peek();
    if (!t) throw new Error('Unexpected end of input in primary');
    if (t.type === 'IDENT') {
      consume();
      return { type: 'IDENT', name: t.value };
    }
    if (t.type === 'LPAREN') {
      consume();
      const node = parseExpr();
      const r = consume();
      if (r.type !== 'RPAREN') throw new Error('Expected )');
      return node;
    }
    throw new Error(`Unexpected token ${t.type} in primary`);
  }

  const node = parseExpr();
  if (i !== tokens.length) throw new Error('Unexpected trailing tokens');
  return node;
}


