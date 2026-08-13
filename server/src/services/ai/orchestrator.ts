// Mock AI Orchestrator — no API key needed, works 100% offline
// Simulates: Language Detection, Complaint Analysis, Duplicate Check,
// Incident Detection, Priority Calculation, Department Routing

export interface AIAnalysisResult {
  language: string;
  languageConfidence: number;
  category: string;
  issue: string;
  severity: string;
  timeReference: string;
  affectedPopulation: string;
  ward?: string;
  isDuplicate: boolean;
  relatedIncident?: string;
  relatedComplaintCount?: number;
  priority: PriorityResult;
  department: DepartmentResult;
  confidence: number;
  steps: AIStep[];
}

export interface AIStep {
  agent: string;
  action: string;
  result: string;
  status: 'done' | 'processing' | 'pending';
}

export interface PriorityResult {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  breakdown: { label: string; score: number; max: number }[];
  reasons: string[];
}

export interface DepartmentResult {
  lead: string;
  supporting?: string;
  reason: string;
  confidence: number;
}

// Language detection patterns
const TANGLISH_PATTERNS = [
  /\bla\b|\blai\b|\bachu\b|\bvarala\b|\billai\b|\bparunga\b|\bporu\b|\booru\b|\bkooda\b|\benna\b|\boru\b|\bkashtam/i,
  /\binga\b|\banga\b|\bunnai\b|\bnamma\b|\bsollu\b|\bpaarunga\b/i
];
const TAMIL_PATTERNS = [/[\u0B80-\u0BFF]/];

function detectLanguage(text: string): { lang: string; confidence: number } {
  if (TAMIL_PATTERNS.some(p => p.test(text))) return { lang: 'Tamil', confidence: 98 };
  if (TANGLISH_PATTERNS.some(p => p.test(text))) return { lang: 'Tanglish', confidence: 94 };
  return { lang: 'English', confidence: 97 };
}

// Category classification rules
const CATEGORY_RULES: { keywords: RegExp[]; category: string; issue: string }[] = [
  {
    keywords: [/water/i, /tanneer/i, /tap/i, /supply/i, /pipe/i, /pipeline/i, /varala/i, /illai.*water|water.*illai/i],
    category: 'Water Supply',
    issue: 'No Water Supply'
  },
  {
    keywords: [/road/i, /pothole/i, /street.*damage/i, /broken.*road/i, /highway/i],
    category: 'Road Damage',
    issue: 'Road Surface Damage'
  },
  {
    keywords: [/garbage/i, /waste/i, /trash/i, /dustbin/i, /sanitation/i, /smell/i, /dirty/i],
    category: 'Garbage',
    issue: 'Garbage Accumulation'
  },
  {
    keywords: [/drain/i, /drainage/i, /sewage/i, /flood/i, /overflow/i, /block/i],
    category: 'Drainage',
    issue: 'Drainage Blockage'
  },
  {
    keywords: [/light/i, /streetlight/i, /lamp/i, /dark/i, /power/i, /electricity/i],
    category: 'Streetlight',
    issue: 'Streetlight Failure'
  },
  {
    keywords: [/traffic/i, /signal/i, /junction/i, /accident/i],
    category: 'Traffic',
    issue: 'Traffic Signal Failure'
  }
];

function classifyComplaint(text: string): { category: string; issue: string } {
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(kw => kw.test(text))) {
      return { category: rule.category, issue: rule.issue };
    }
  }
  return { category: 'Public Infrastructure', issue: 'Infrastructure Problem' };
}

// Severity detection
function detectSeverity(text: string): string {
  const criticalKeywords = /urgent|emergency|critical|dangerous|children|elderly|baby|sick|hospital|72 hour|3 days|romba|kashtam/i;
  const highKeywords = /severe|serious|major|multiple|many|families|houses|2 days|problem|kashtapadur/i;
  const mediumKeywords = /issue|problem|inconvenience|need attention|fix/i;

  if (criticalKeywords.test(text)) return 'Critical';
  if (highKeywords.test(text)) return 'High';
  if (mediumKeywords.test(text)) return 'Medium';
  return 'Medium';
}

// Time reference extraction
function extractTimeReference(text: string): string {
  if (/3 days?|3 naal|72 hour/i.test(text)) return 'Since 3 days';
  if (/2 days?|48 hour/i.test(text)) return 'Since 2 days';
  if (/morning|kaaalai/i.test(text)) return 'Since morning';
  if (/week/i.test(text)) return 'Since 1 week';
  if (/yesterday/i.test(text)) return 'Since yesterday';
  return 'Recently';
}

// Ward detection
function detectWard(text: string, providedWard?: string): string {
  if (providedWard) return providedWard;
  const match = text.match(/ward\s*(\d+)/i);
  if (match) return `Ward ${match[1]}`;
  return 'Unknown';
}

// Affected population
function detectAffectedPopulation(text: string): string {
  if (/many families|multiple houses|kooda vettu|kooda ooru|entire area|whole street/i.test(text)) {
    return 'Multiple Households';
  }
  if (/building|apartment|complex/i.test(text)) return 'Apartment Building';
  if (/street|road/i.test(text)) return 'Entire Street';
  return 'Local Residents';
}

// Department routing
const DEPARTMENT_MAP: Record<string, { lead: string; supporting?: string; reason: string }> = {
  'Water Supply': {
    lead: 'Water Supply Department',
    supporting: 'Municipal Engineering',
    reason: 'Water supply disruption requires Water Board pipeline team and Municipal Engineering support for infrastructure repair.'
  },
  'Road Damage': {
    lead: 'Roads & Infrastructure',
    supporting: 'Municipal Engineering',
    reason: 'Road surface damage requires Roads department repair crew and Municipal Engineering for structural assessment.'
  },
  'Garbage': {
    lead: 'Sanitation Department',
    reason: 'Garbage accumulation requires Sanitation department waste collection and disposal team.'
  },
  'Drainage': {
    lead: 'Municipal Engineering',
    supporting: 'Sanitation Department',
    reason: 'Drainage blockage requires Municipal Engineering desilting team and Sanitation support.'
  },
  'Streetlight': {
    lead: 'Electrical Department',
    reason: 'Streetlight failure requires Electrical department technicians for fault identification and repair.'
  },
  'Traffic': {
    lead: 'Roads & Infrastructure',
    supporting: 'Electrical Department',
    reason: 'Traffic signal issues require Roads department and Electrical team for signal system repair.'
  }
};

// Priority calculation
function calculatePriority(
  category: string,
  severity: string,
  relatedCount: number,
  ward: string,
  timeRef: string
): PriorityResult {
  // Volume score (30 points max)
  const volumeScore = Math.min(30, Math.round((relatedCount / 50) * 30));

  // Severity score (25 points max)
  const severityMap: Record<string, number> = { 'Critical': 25, 'High': 20, 'Medium': 13, 'Low': 6 };
  const severityScore = severityMap[severity] ?? 13;

  // Recency score (20 points max)
  const recencyMap: Record<string, number> = {
    'Since 3 days': 19, 'Since 2 days': 16, 'Since morning': 14,
    'Since yesterday': 12, 'Since 1 week': 8, 'Recently': 10
  };
  const recencyScore = recencyMap[timeRef] ?? 10;

  // Geographic density score (15 points max)
  const geoScore = relatedCount > 30 ? 13 : relatedCount > 15 ? 10 : relatedCount > 5 ? 7 : 4;

  // Safety risk score (10 points max)
  const safetyRisk: Record<string, number> = {
    'Water Supply': 9, 'Flooding': 10, 'Road Damage': 7,
    'Garbage': 6, 'Drainage': 8, 'Streetlight': 5, 'Traffic': 7
  };
  const safetyScore = safetyRisk[category] ?? 5;

  const total = volumeScore + severityScore + recencyScore + geoScore + safetyScore;
  const level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' =
    total >= 85 ? 'CRITICAL' : total >= 70 ? 'HIGH' : total >= 50 ? 'MEDIUM' : 'LOW';

  const reasons: string[] = [];
  if (relatedCount > 20) reasons.push(`${relatedCount} related complaints reported`);
  if (severity === 'Critical' || severity === 'High') reasons.push(`${severity} severity — essential service affected`);
  if (timeRef.includes('3 days') || timeRef.includes('2 days')) reasons.push(`Unresolved for ${timeRef.toLowerCase()}`);
  if (geoScore >= 10) reasons.push('High geographic concentration — same ward cluster');
  if (safetyScore >= 8) reasons.push('Essential public service — health & safety risk');

  return {
    score: total,
    level: level === 'CRITICAL' ? 'HIGH' : level,
    breakdown: [
      { label: 'Complaint Volume', score: volumeScore, max: 30 },
      { label: 'Severity', score: severityScore, max: 25 },
      { label: 'Recency', score: recencyScore, max: 20 },
      { label: 'Geographic Density', score: geoScore, max: 15 },
      { label: 'Safety Risk', score: safetyScore, max: 10 }
    ],
    reasons
  };
}

// Incident detection — check if complaint matches any existing incident
function detectRelatedIncident(
  category: string,
  ward: string,
  allIncidents: any[]
): { incidentId?: string; count?: number; match: boolean } {
  for (const incident of allIncidents) {
    if (
      incident.category === category &&
      incident.ward === ward &&
      incident.status !== 'resolved' &&
      incident.status !== 'closed'
    ) {
      return {
        incidentId: incident.id,
        count: incident.affectedCitizenCount,
        match: true
      };
    }
  }
  return { match: false };
}

// Main orchestrator function
export function runAIOrchestrator(
  text: string,
  ward: string | undefined,
  allIncidents: any[],
  existingCitizenComplaints: string[]
): AIAnalysisResult {
  // 1. Language detection
  const { lang, confidence: langConf } = detectLanguage(text);

  // 2. Complaint understanding
  const { category, issue } = classifyComplaint(text);
  const severity = detectSeverity(text);
  const timeRef = extractTimeReference(text);
  const detectedWard = detectWard(text, ward);
  const affectedPop = detectAffectedPopulation(text);

  // 3. Duplicate detection (same citizen text similarity)
  const isDuplicate = existingCitizenComplaints.some(prev => {
    const overlap = prev.toLowerCase().split(' ').filter(w => text.toLowerCase().includes(w)).length;
    return overlap > 3;
  });

  // 4. Incident detection
  const incidentResult = detectRelatedIncident(category, detectedWard, allIncidents);

  // 5. Priority calculation
  const relatedCount = incidentResult.count ? incidentResult.count + 1 : 1;
  const priority = calculatePriority(category, severity, relatedCount, detectedWard, timeRef);

  // 6. Department routing
  const deptInfo = DEPARTMENT_MAP[category] || {
    lead: 'Municipal Engineering',
    reason: 'General infrastructure issue requiring municipal team attention.'
  };

  const steps: AIStep[] = [
    { agent: 'Language Agent', action: 'Detecting language', result: `${lang} detected (${langConf}% confidence)`, status: 'done' },
    { agent: 'Complaint Agent', action: 'Understanding complaint', result: `${issue} — ${severity} severity`, status: 'done' },
    { agent: 'Complaint Agent', action: 'Extracting category', result: category, status: 'done' },
    { agent: 'Complaint Agent', action: 'Extracting severity', result: severity, status: 'done' },
    { agent: 'Complaint Agent', action: 'Extracting location', result: detectedWard || 'Searching...', status: 'done' },
    { agent: 'Evidence Agent', action: 'Processing evidence', result: 'Image/location processed', status: 'done' },
    { agent: 'Duplicate Agent', action: 'Checking for duplicates', result: isDuplicate ? 'Possible duplicate detected' : 'No duplicate found', status: 'done' },
    { agent: 'Incident Agent', action: 'Searching related complaints', result: incidentResult.match ? `${incidentResult.count} related complaints found` : 'Searching existing incidents...', status: 'done' },
    { agent: 'Priority Agent', action: 'Calculating priority', result: `Score: ${priority.score}/100 — ${priority.level}`, status: 'done' },
    { agent: 'Routing Agent', action: 'Finding responsible department', result: deptInfo.lead, status: 'done' }
  ];

  return {
    language: lang,
    languageConfidence: langConf,
    category,
    issue,
    severity,
    timeReference: timeRef,
    affectedPopulation: affectedPop,
    ward: detectedWard,
    isDuplicate,
    relatedIncident: incidentResult.incidentId,
    relatedComplaintCount: incidentResult.count,
    priority,
    department: {
      lead: deptInfo.lead,
      supporting: deptInfo.supporting,
      reason: deptInfo.reason,
      confidence: 94
    },
    confidence: Math.round((langConf + 94 + 91) / 3),
    steps
  };
}
