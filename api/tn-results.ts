const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-IN,en;q=0.9',
};

const CONSTITUENCY_MAP: Record<string, string> = {
  'r k nagar': 'rk-nagar',
  'rk nagar': 'rk-nagar',
  'kolathur': 'kolathur',
  'bodinayakanur': 'bodinayakkanur',
  'bodinayakkanur': 'bodinayakkanur',
  'coimbatore south': 'coimbatore-south',
  'edapadi': 'edappadi',
  'edappadi': 'edappadi',
  'dindigul': 'dindigul',
  'madurai central': 'madurai-central',
  'tiruchirappalli east': 'trichy-east',
  'trichy east': 'trichy-east',
  'trichy (east)': 'trichy-east',
  'villupuram': 'villupuram',
  'thanjavur': 'thanjavur',
  'coimbatore north': 'coimbatore-north',
  'salem south': 'salem-south',
  'erode east': 'erode-east',
  'tiruppur south': 'tiruppur-south',
  'thoothukudi': 'thoothukudi',
  'ramanathapuram': 'ramanathapuram',
  'kancheepuram': 'kancheepuram',
};

const PARTY_MAP: Record<string, string> = {
  'dravida munnetra kazhagam': 'DMK',
  'dmk': 'DMK',
  'all india anna dravida munnetra kazhagam': 'AIADMK',
  'aiadmk': 'AIADMK',
  'tamilaga vettri kazhagam': 'TVK',
  'tvk': 'TVK',
  'naam tamilar katchi': 'NTK',
  'ntk': 'NTK',
  'bharatiya janata party': 'BJP',
  'bjp': 'BJP',
  'indian national congress': 'INC',
  'inc': 'INC',
  'independent': 'IND',
};

function norm(s: string) { return s.trim().toLowerCase(); }

function mapParty(raw: string): string {
  const n = norm(raw);
  for (const [key, val] of Object.entries(PARTY_MAP)) {
    if (n.includes(key)) return val;
  }
  return raw.trim().toUpperCase().slice(0, 12);
}

function mapConst(raw: string): string | null {
  return CONSTITUENCY_MAP[norm(raw)] ?? null;
}

interface Result {
  id: string;
  winner: string;
  winnerCandidate: string;
  actualMargin: string;
  status: string;
  predictionCorrect: null;
}

function makeResult(id: string, party: string, candidate: string, margin: string | number, status = 'Declared'): Result {
  return {
    id,
    winner: mapParty(party),
    winnerCandidate: candidate.trim(),
    actualMargin: String(margin).replace(/,/g, '').trim(),
    status,
    predictionCorrect: null,
  };
}

async function fetchOpenCity(): Promise<Result[]> {
  try {
    const url = 'https://data.opencity.in/api/3/action/datastore_search?resource_id=tn-assembly-2026-results&limit=300';
    const r = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return [];
    const data = await r.json() as any;
    if (!data.success) return [];
    const out: Result[] = [];
    for (const rec of data.result?.records ?? []) {
      const id = mapConst(rec.constituency_name ?? '');
      if (!id || !rec.winner_candidate) continue;
      out.push(makeResult(id, rec.party_name ?? '', rec.winner_candidate, rec.margin ?? 'N/A', rec.result_status ?? 'Declared'));
    }
    return out;
  } catch { return []; }
}

async function fetchNDTV(): Promise<Result[]> {
  try {
    const url = 'https://results.ndtv.com/results/assembly/tamil-nadu-2026/data.json';
    const r = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return [];
    const data = await r.json() as any;
    const out: Result[] = [];
    for (const item of (data.constituencies ?? data.results ?? [])) {
      const id = mapConst(item.name ?? item.constituency ?? '');
      if (!id) continue;
      out.push(makeResult(
        id,
        item.leading_party ?? item.party ?? '',
        item.leading_candidate ?? item.candidate ?? '',
        item.margin ?? 'N/A',
        item.result_type?.toLowerCase() === 'won' ? 'Won' : 'Leading',
      ));
    }
    return out;
  } catch { return []; }
}

async function fetchHindu(): Promise<Result[]> {
  try {
    const url = 'https://www.thehindu.com/elections/results/tamil-nadu-2026/data.json';
    const r = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return [];
    const data = await r.json() as any;
    const out: Result[] = [];
    for (const item of (data.data ?? [])) {
      const id = mapConst(item.constituency_name ?? '');
      if (!id) continue;
      out.push(makeResult(id, item.party_name ?? '', item.candidate_name ?? '', item.vote_margin ?? 'N/A'));
    }
    return out;
  } catch { return []; }
}

function parseEciHtml(html: string): Result[] {
  const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) ?? [];
  const out: Result[] = [];
  for (const row of rows.slice(1)) {
    const cells = (row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) ?? [])
      .map(td => td.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim());
    if (cells.length < 4) continue;
    const id = mapConst(cells[0]);
    if (!id) continue;
    out.push(makeResult(id, cells[2] ?? '', cells[1] ?? '', cells[4] ?? cells[3] ?? 'N/A', cells[cells.length - 1] ?? 'Leading'));
  }
  return out;
}

async function fetchECIUrl(url: string): Promise<{ results: Result[]; status: number | string }> {
  try {
    const r = await fetch(url, {
      headers: { ...HEADERS, Referer: 'https://results.eci.gov.in/' },
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) return { results: [], status: r.status };
    const html = await r.text();
    return { results: parseEciHtml(html), status: 200 };
  } catch (e: any) {
    return { results: [], status: e?.message ?? 'error' };
  }
}

async function fetchECI(): Promise<Result[]> {
  const urls = [
    'https://results.eci.gov.in/ResultAcGenMay2026/statewiseS22.htm',
    'https://results.eci.gov.in/ResultAcGenMay2026/ConstituencywiseS22.htm',
    'https://results.eci.gov.in/ResultAcGenMay2026/partywiseleadresult-234S22.htm',
  ];
  for (const url of urls) {
    const { results } = await fetchECIUrl(url);
    if (results.length) return results;
  }
  return [];
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

  // ?debug=1 shows status of each source for troubleshooting
  const debug = req.query?.debug === '1';

  if (debug) {
    const eciUrls = [
      'https://results.eci.gov.in/ResultAcGenMay2026/statewiseS22.htm',
      'https://results.eci.gov.in/ResultAcGenMay2026/ConstituencywiseS22.htm',
      'https://results.eci.gov.in/ResultAcGenMay2026/partywiseleadresult-234S22.htm',
    ];
    const eciResults = await Promise.all(eciUrls.map(async url => {
      const { results, status } = await fetchECIUrl(url);
      return { url, status, count: results.length };
    }));

    const [openCity, ndtv, hindu] = await Promise.all([
      fetchOpenCity(), fetchNDTV(), fetchHindu(),
    ]);

    return res.json({
      eci: eciResults,
      openCity: openCity.length,
      ndtv: ndtv.length,
      hindu: hindu.length,
    });
  }

  const sources: [string, () => Promise<Result[]>][] = [
    ['OpenCity', fetchOpenCity],
    ['ECI', fetchECI],
    ['NDTV', fetchNDTV],
    ['TheHindu', fetchHindu],
  ];

  for (const [name, fn] of sources) {
    const results = await fn();
    if (results.length) {
      return res.json({ ok: true, results, source: name, count: results.length });
    }
  }

  res.status(200).json({ ok: false, results: [], source: null, count: 0, message: 'No results available yet' });
}
