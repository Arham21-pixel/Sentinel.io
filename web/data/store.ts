import { nanoid } from 'nanoid';
import type { Rule, User } from '../types.js';

export const users: User[] = [
  { id: 'u_alex', name: 'Alex', role: 'child' },
  { id: 'u_bella', name: 'Bella', role: 'child' },
  { id: 'u_parent', name: 'Parent', role: 'parent' },
  { id: 'u_admin', name: 'Admin', role: 'admin' },
];

// Enhanced URL categorization with comprehensive site recognition
export function categorize(url: URL | null): string[] {
  if (!url) return [];
  const host = url.host.toLowerCase();
  const fullUrl = url.href.toLowerCase();
  
  // Gaming sites - comprehensive list
  const gamingSites = [
    'roblox', 'minecraft', 'steam', 'friv', 'poki', 'coolmathgames',
    'addictinggames', 'miniclip', 'armor', 'kongregate', 'newgrounds',
    'y8', 'kizi', 'agame', 'gamesgames', 'primarygames', 'funbrain',
    'abcya', 'mathplayground', 'prodigy', 'scratch.mit.edu'
  ];
  
  // Entertainment/Video sites
  const entertainmentSites = [
    'youtube', 'netflix', 'hulu', 'twitch', 'tiktok', 'disney',
    'hbo', 'amazon.com/prime', 'crunchyroll', 'funimation',
    'cartoon', 'nick', 'pbskids', 'boomerang'
  ];
  
  // Social media sites
  const socialSites = [
    'facebook', 'instagram', 'twitter', 'x.com', 'snapchat',
    'discord', 'reddit', 'pinterest', 'tumblr', 'whatsapp'
  ];
  
  // Educational sites
  const educationalSites = [
    'wikipedia', 'khan', 'coursera', 'edx', 'duolingo',
    'britannica', 'nationalgeographic', 'smithsonian',
    'ted.com', 'crash', 'bbc.co.uk/bitesize'
  ];
  
  // Check gaming sites
  if (gamingSites.some(site => host.includes(site) || fullUrl.includes(site))) {
    return ['games', 'entertainment'];
  }
  
  // Check entertainment sites
  if (entertainmentSites.some(site => host.includes(site) || fullUrl.includes(site))) {
    return ['video', 'entertainment'];
  }
  
  // Check social media
  if (socialSites.some(site => host.includes(site))) {
    return ['social', 'entertainment'];
  }
  
  // Check educational sites
  if (educationalSites.some(site => host.includes(site)) || host.includes('.edu')) {
    return ['education'];
  }
  
  // News sites
  if (host.includes('cnn') || host.includes('bbc') || host.includes('reuters') ||
      host.includes('news') || host.includes('npr') || host.includes('ap.org')) {
    return ['news'];
  }
  
  // Shopping sites
  if (host.includes('amazon') || host.includes('ebay') || host.includes('shop') ||
      host.includes('store') || host.includes('buy')) {
    return ['shopping'];
  }
  
  // Default: if we can't categorize, assume it might be entertainment for safety
  return ['uncategorized'];
}

export const rules: Rule[] = [
  {
    id: nanoid(),
    name: 'Parent override allows all',
    expression: "role:is(parent)",
    effect: 'allow',
    priority: 1000,
    enabled: true,
  },
  {
    id: nanoid(),
    name: 'Admin override allows all',
    expression: "role:is(admin)",
    effect: 'allow',
    priority: 999,
    enabled: true,
  },
  {
    id: nanoid(),
    name: 'Allow educational sites anytime',
    expression: "url:category(is,education)",
    effect: 'allow',
    priority: 500,
    enabled: true,
  },
  {
    id: nanoid(),
    name: 'Allow Wikipedia anytime',
    expression: "url:host(is,wikipedia.org) or url:host(endsWith,.wikipedia.org)",
    effect: 'allow',
    priority: 450,
    enabled: true,
  },
  {
    id: nanoid(),
    name: 'Block all games for children',
    expression: "role:is(child) and url:category(is,games)",
    effect: 'block',
    priority: 300,
    enabled: true,
  },
  {
    id: nanoid(),
    name: 'Block social media for children',
    expression: "role:is(child) and url:category(is,social)",
    effect: 'block',
    priority: 250,
    enabled: true,
  },
  {
    id: nanoid(),
    name: 'Homework hours block entertainment (weekdays 17:00-20:00)',
    expression: "role:is(child) and isWeekday and time:between(17:00,20:00) and url:category(is,entertainment)",
    effect: 'block',
    priority: 200,
    enabled: true,
  },
  {
    id: nanoid(),
    name: 'Block video entertainment after 21:00',
    expression: "role:is(child) and time:between(21:00,23:59) and url:category(is,video)",
    effect: 'block',
    priority: 150,
    enabled: true,
  },
  {
    id: nanoid(),
    name: 'Allow news sites for children',
    expression: "url:category(is,news)",
    effect: 'allow',
    priority: 100,
    enabled: true,
  },
];


