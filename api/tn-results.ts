const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-IN,en;q=0.9',
};

const CONSTITUENCY_MAP: Record<string, string> = {
  // RK Nagar
  'r k nagar': 'rk-nagar',
  'rk nagar': 'rk-nagar',
  'dr.radhakrishnan nagar': 'rk-nagar',
  'dr. radhakrishnan nagar': 'rk-nagar',
  'radhakrishnan nagar': 'rk-nagar',
  // Kolathur
  'kolathur': 'kolathur',
  // Bodinayakkanur
  'bodinayakanur': 'bodinayakkanur',
  'bodinayakkanur': 'bodinayakkanur',
  'bodinayakanoor': 'bodinayakkanur',
  // Coimbatore
  'coimbatore south': 'coimbatore-south',
  'coimbatore (south)': 'coimbatore-south',
  'coimbatore north': 'coimbatore-north',
  'coimbatore (north)': 'coimbatore-north',
  // Edappadi
  'edapadi': 'edappadi',
  'edappadi': 'edappadi',
  // Dindigul
  'dindigul': 'dindigul',
  // Madurai Central
  'madurai central': 'madurai-central',
  'madurai (central)': 'madurai-central',
  // Trichy East
  'tiruchirappalli east': 'trichy-east',
  'tiruchirappalli (east)': 'trichy-east',
  'trichy east': 'trichy-east',
  'trichy (east)': 'trichy-east',
  // Villupuram
  'villupuram': 'villupuram',
  'viluppuram': 'villupuram',
  // Thanjavur
  'thanjavur': 'thanjavur',
  // Salem South
  'salem south': 'salem-south',
  'salem (south)': 'salem-south',
  // Erode East
  'erode east': 'erode-east',
  'erode (east)': 'erode-east',
  // Tiruppur South
  'tiruppur south': 'tiruppur-south',
  'tiruppur (south)': 'tiruppur-south',
  'tirupur south': 'tiruppur-south',
  'tirupur (south)': 'tiruppur-south',
  // Thoothukudi
  'thoothukudi': 'thoothukudi',
  'thoothukkudi': 'thoothukudi',
  'tuticorin': 'thoothukudi',
  // Ramanathapuram
  'ramanathapuram': 'ramanathapuram',
  // Kancheepuram
  'kancheepuram': 'kancheepuram',
  'kanchipuram': 'kancheepuram',
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

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/\s*\(sc\)/gi, '-sc').replace(/\s*\(st\)/gi, '-st')
    .replace(/[()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

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
  name: string;
  winner: string;
  winnerCandidate: string;
  actualMargin: string;
  status: string;
  predictionCorrect: null;
}

function makeResult(id: string, name: string, party: string, candidate: string, margin: string | number, status = 'Declared'): Result {
  return {
    id,
    name,
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
      const raw = rec.constituency_name ?? '';
      const id = mapConst(raw) ?? slugify(raw);
      if (!id || !rec.winner_candidate) continue;
      out.push(makeResult(id, raw, rec.party_name ?? '', rec.winner_candidate, rec.margin ?? 'N/A', rec.result_status ?? 'Declared'));
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
      const raw = item.name ?? item.constituency ?? '';
      const id = mapConst(raw) ?? slugify(raw);
      if (!id) continue;
      out.push(makeResult(
        id, raw,
        item.leading_party ?? item.party ?? '',
        item.leading_candidate ?? item.candidate ?? '',
        item.margin ?? 'N/A',
        item.result_type?.toLowerCase() === 'won' ? 'Won' : 'Leading',
      ));
    }
    return out;
  } catch { return []; }
}

async function fetchTNUpdates(): Promise<Result[]> {
  try {
    const url = 'https://tnupdates.com/tn-assembly-elections-winners-2026/';
    const r = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return [];
    const html = await r.text();
    const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) ?? [];
    const out: Result[] = [];
    for (const row of rows) {
      if (/<th/i.test(row)) continue;
      const cells = (row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) ?? [])
        .map(td => td.replace(/<[^>]+>/g, ' ').replace(/—/g, '').replace(/\s+/g, ' ').trim());
      if (cells.length < 3) continue;
      // columns: #, Constituency Name, Leading, Winner
      const rawName = cells[1]?.trim() ?? '';
      if (!rawName || /^\d+$/.test(rawName)) continue; // skip empty or number-only cells
      // Use CONSTITUENCY_MAP if available (for ID consistency with hardcoded frontend data),
      // otherwise slugify the raw name
      const id = mapConst(rawName) ?? slugify(rawName);
      // Only use declared winners (col 3). Leading trends (col 2) are unreliable
      // and cause inflated seat counts that don't match ECI declared results.
      const winner = cells[3]?.trim() || '';
      if (!winner) continue;
      out.push(makeResult(id, rawName, winner, '', 'N/A', 'Declared'));
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
      const raw = item.constituency_name ?? '';
      const id = mapConst(raw) ?? slugify(raw);
      if (!id) continue;
      out.push(makeResult(id, raw, item.party_name ?? '', item.candidate_name ?? '', item.vote_margin ?? 'N/A'));
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
    const raw = cells[0];
    const id = mapConst(raw) ?? slugify(raw);
    if (!id) continue;
    out.push(makeResult(id, raw, cells[2] ?? '', cells[1] ?? '', cells[4] ?? cells[3] ?? 'N/A', cells[cells.length - 1] ?? 'Leading'));
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
    ['TNUpdates', fetchTNUpdates],
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
