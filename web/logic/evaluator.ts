import type { AstNode } from './parser.js';
import type { AtomContext } from '../types.js';

export type AtomResolver = (name: string, ctx: AtomContext) => boolean;

export function evaluateAst(node: AstNode, ctx: AtomContext, resolve: AtomResolver): boolean {
  switch (node.type) {
    case 'IDENT':
      return resolve(node.name, ctx);
    case 'NOT':
      return !evaluateAst(node.expr, ctx, resolve);
    case 'AND':
      return evaluateAst(node.left, ctx, resolve) && evaluateAst(node.right, ctx, resolve);
    case 'OR':
      return evaluateAst(node.left, ctx, resolve) || evaluateAst(node.right, ctx, resolve);
    case 'IMPLIES': {
      const l = evaluateAst(node.left, ctx, resolve);
      const r = evaluateAst(node.right, ctx, resolve);
      return !l || r;
    }
    case 'IFF': {
      const l = evaluateAst(node.left, ctx, resolve);
      const r = evaluateAst(node.right, ctx, resolve);
      return l === r;
    }
  }
}


