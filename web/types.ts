export type User = {
  id: string;
  name: string;
  role: 'child' | 'parent' | 'admin';
  allowedCategories?: string[];
  blockedCategories?: string[];
};

export type Rule = {
  id: string;
  name: string;
  expression: string; // propositional logic expression
  effect: 'allow' | 'block';
  priority: number; // higher number wins when multiple rules match
  enabled: boolean;
};

export type EvaluationInput = {
  userId: string;
  url: string;
  isoDateTime?: string; // if omitted, use now
};

export type EvaluationResult = {
  decision: 'allow' | 'block';
  matchedRuleIds: string[];
  reasons: string[];
};

export type AtomContext = {
  user: User | null;
  url: URL | null;
  categories: string[]; // derived categories for url
  dayOfWeek: string; // Mon..Sun
  time24: string; // HH:mm
};


