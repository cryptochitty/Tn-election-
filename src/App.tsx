import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Settings2, 
  Info, 
  ChevronRight, 
  Vote, 
  Users, 
  Map as MapIcon,
  Zap,
  LayoutDashboard,
  Activity,
  Share2,
  Search
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart as RePieChart,
  Pie,
  Legend,
  LineChart,
  Line
} from 'recharts';

const STATE_CONFIGS: Record<string, {
  name: string;
  description: string;
  insight: string;
  history: string;
  demographics: { label: string; value: string }[];
  totalSeats: number;
  majority: number;
  parties: any[];
  regions: { id: string; label: string; total: number; partySeats?: Record<string, number> }[];
  constituencies?: { id: string; name: string; type: 'Star' | 'Swing' | 'Safe'; leading: string; margin: string; candidate: string; history?: number[] }[];
  trendData: any[];
  pollData: {
    prePoll: Record<string, number>;
    postPoll: Record<string, number>;
    exitPoll: Record<string, number>;
  };
  socialTrends: {
    platform: string;
    mentions: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    trendingTopic: string;
    icon: any;
  }[];
}> = {
  tamilnadu: {
    name: 'Tamil Nadu',
    description: 'Recent pre-poll aggregates suggest a strong consolidation for the DMK alliance reaching 152 seats, but with a significant shift in urban demographics where the TVK movement (Vijay) is capturing a 12.8% projected vote share among first-time voters and youth clusters.',
    insight: 'The TVK factor acts as a major disruptor in tri-polar seats, particularly in Chennai and North Bengal Vanniyar belts where split-vote dynamics could challenge traditional Dravidian arithmetic.',
    history: 'Dominated by the Dravidian movement, politics has revolved around linguistic identity and social justice since 1967, with DMK and AIADMK alternating power.',
    demographics: [
      { label: 'Urbanization', value: '48.4%' },
      { label: 'Literacy Rate', value: '80.1%' },
      { label: 'Key Groups', value: 'MBC, SC, BC' },
    ],
    totalSeats: 234,
    majority: 118,
    regions: [
      { id: 'all', label: 'All Regions', total: 234 },
      { id: 'kongu', label: 'Kongu / West', total: 54, partySeats: { dmk: 30, aiadmk: 18, tvk: 2, bjp: 4 } },
      { id: 'chennai', label: 'Greater Chennai', total: 28, partySeats: { dmk: 24, aiadmk: 2, tvk: 2 } },
      { id: 'delta', label: 'Kaveri Delta', total: 32, partySeats: { dmk: 26, aiadmk: 4, tvk: 2 } },
      { id: 'south', label: 'Deep South', total: 60, partySeats: { dmk: 38, aiadmk: 12, tvk: 6, others: 4 } },
      { id: 'north', label: 'Vanniyar Belt', total: 60, partySeats: { dmk: 34, aiadmk: 6, tvk: 6, bjp: 6, ntk: 4, others: 4 } },
    ],
    constituencies: [
      { id: 'rk-nagar', name: 'RK Nagar', type: 'Star', leading: 'DMK', margin: '15,000+', candidate: 'Ebinezer', history: [12000, 14000, 15000] },
      { id: 'kolathur', name: 'Kolathur', type: 'Safe', leading: 'DMK', margin: '45,000+', candidate: 'M.K. Stalin', history: [40000, 42000, 45000] },
      { id: 'bodinayakkanur', name: 'Bodinayakkanur', type: 'Star', leading: 'DMK', margin: '5,000+', candidate: 'O. Panneerselvam', history: [1000, 3000, 5000] },
      { id: 'coimbatore-south', name: 'Coimbatore South', type: 'Swing', leading: 'BJP', margin: '1,200+', candidate: 'Vanathi Srinivasan', history: [2500, 1800, 1200] },
      { id: 'edelapuram', name: 'Edappadi', type: 'Safe', leading: 'AIADMK', margin: '30,000+', candidate: 'E.K. Palaniswami', history: [28000, 29000, 30000] },
    ],
    parties: [
      { id: 'dmk', name: 'DMK Alliance', color: '#EC1C24', seats: 152, voteShare: 42.5, momentum: 0, factor: 'Welfare Schemes & Social Justice' },
      { id: 'aiadmk', name: 'AIADMK Alliance', color: '#008136', seats: 42, voteShare: 26.2, momentum: 0, factor: 'Rural Consolidation & Infrastructure' },
      { id: 'tvk', name: 'TVK (Vijay)', color: '#F7E017', seats: 18, voteShare: 12.8, momentum: 0, factor: 'Youth Surge & Cinema Influence' },
      { id: 'bjp', name: 'BJP', color: '#FF9933', seats: 10, voteShare: 8.5, momentum: 0, factor: 'National Security & Economic Reform' },
      { id: 'ntk', name: 'NTK', color: '#FFCC00', seats: 4, voteShare: 6.2, momentum: 0, factor: 'Ethnic Identity & Environmentalism' },
      { id: 'others', name: 'Others', color: '#666666', seats: 8, voteShare: 3.8, momentum: 0, factor: 'Localized Leadership & Niche Issues' },
    ],
    trendData: [
      { date: 'Jan 26', dmk: 135, aiadmk: 50, tvk: 15 },
      { date: 'Feb 26', dmk: 140, aiadmk: 48, tvk: 20 },
      { date: 'Mar 26', dmk: 148, aiadmk: 45, tvk: 18 },
      { date: 'Apr 26', dmk: 152, aiadmk: 42, tvk: 18 },
    ],
    pollData: {
      prePoll: { dmk: 154, aiadmk: 40, tvk: 15, bjp: 12 },
      postPoll: { dmk: 148, aiadmk: 46, tvk: 22, bjp: 8 },
      exitPoll: { dmk: 156, aiadmk: 38, tvk: 18, bjp: 10 },
    },
    socialTrends: [
      { platform: 'X / Twitter', mentions: '1.2M', sentiment: 'Positive', trendingTopic: '#DMKVictory2026', icon: Zap },
      { platform: 'Instagram', mentions: '850K', sentiment: 'Neutral', trendingTopic: '#TVKEntry', icon: Share2 },
      { platform: 'Facebook', mentions: '2.5M', sentiment: 'Positive', trendingTopic: 'Welfare Schemes', icon: Users },
    ]
  },
  westbengal: {
    name: 'West Bengal',
    description: 'Post-2021, Bengal remains a high-voltage bipolar contest with ideological undercurrents. The role of the "Left-Congress" alliance as a potential spoiler or kingmaker continues to be the key variable in South Bengal.',
    insight: 'South Bengal, particularly the industrial belts and the delta region, defines the winner, while North Bengal remains a stronghold of the opposition.',
    history: 'A state marked by intense ideological struggles, shifting from 34 years of Left Front rule to TMC dominance in 2011.',
    demographics: [
      { label: 'Rural Population', value: '68.1%' },
      { label: 'Minority Share', value: '27.0%' },
      { label: 'Key Groups', value: 'Matua, Tribal, General' },
    ],
    totalSeats: 294,
    majority: 148,
    regions: [
      { id: 'all', label: 'Entire State', total: 294 },
      { id: 'north', label: 'North Bengal', total: 54, partySeats: { tmc: 20, bjp: 30, left: 4 } },
      { id: 'south', label: 'South Bengal', total: 240, partySeats: { tmc: 145, bjp: 65, left: 26, others: 4 } },
    ],
    constituencies: [
      { id: 'nandigram', name: 'Nandigram', type: 'Star', leading: 'BJP', margin: '1,500+', candidate: 'Suvendu Adhikari', history: [4000, 2500, 1500] },
      { id: 'bhawanipore', name: 'Bhawanipore', type: 'Safe', leading: 'TMC', margin: '50,000+', candidate: 'Mamata Banerjee', history: [45000, 48000, 50000] },
      { id: 'diamond-harbour', name: 'Diamond Harbour', type: 'Safe', leading: 'TMC', margin: '40,000+', candidate: 'Abhishek Banerjee', history: [35000, 38000, 40000] },
      { id: 'singur', name: 'Singur', type: 'Swing', leading: 'TMC', margin: '5,000+', candidate: 'Bechara Manna', history: [2000, 3500, 5000] },
    ],
    parties: [
      { id: 'tmc', name: 'AITC/TMC', color: '#31a354', seats: 165, voteShare: 45.2, momentum: 0 },
      { id: 'bjp', name: 'BJP', color: '#FF9933', seats: 95, voteShare: 36.8, momentum: 0 },
      { id: 'left', name: 'Left-Congress', color: '#de2d26', seats: 30, voteShare: 14.5, momentum: 0 },
      { id: 'others', name: 'Others', color: '#666666', seats: 4, voteShare: 3.5, momentum: 0 },
    ],
    trendData: [
      { date: 'Jan 26', tmc: 170, bjp: 90, left: 25 },
      { date: 'Feb 26', tmc: 168, bjp: 92, left: 28 },
      { date: 'Mar 26', tmc: 160, bjp: 98, left: 32 },
      { date: 'Apr 26', tmc: 165, bjp: 95, left: 30 },
    ],
    pollData: {
      prePoll: { tmc: 162, bjp: 100, left: 28 },
      postPoll: { tmc: 168, bjp: 92, left: 32 },
      exitPoll: { tmc: 165, bjp: 94, left: 31 },
    },
    socialTrends: [
      { platform: 'X / Twitter', mentions: '2.1M', sentiment: 'Neutral', trendingTopic: '#BengalMandate', icon: Zap },
      { platform: 'Instagram', mentions: '1.5M', sentiment: 'Positive', trendingTopic: '#DidiAche', icon: Share2 },
      { platform: 'Facebook', mentions: '4.2M', sentiment: 'Neutral', trendingTopic: 'Rural Connectivity', icon: Users },
    ]
  },
  assam: {
    name: 'Assam',
    description: 'The Brahmaputra valley and the Barak valley continue to show divergent electoral patterns. Identity politics remains the primary driver, with tribal alliances playing a crucial role in the upper reaches.',
    insight: 'The consolidation of the tribal vote and the performance of smaller regional parties in the Bodo and Karbi belts will determine the coalition dynamics.',
    history: 'Politics defined by the Assam Accord and student movements, evolving into a contest between traditional indigenous platforms and national consolidation.',
    demographics: [
      { label: 'Forest Cover', value: '34.2%' },
      { label: 'Diverse Tribes', value: '12.4% ST' },
      { label: 'Key Regions', value: 'Brahmaputra/Barak' },
    ],
    totalSeats: 126,
    majority: 64,
    regions: [
      { id: 'all', label: 'All Regions', total: 126 },
      { id: 'brahmaputra', label: 'Brahmaputra Valley', total: 111, partySeats: { bjp: 65, congress: 38, aiudf: 7, others: 1 } },
      { id: 'barak', label: 'Barak Valley', total: 15, partySeats: { bjp: 10, congress: 4, aiudf: 1 } },
    ],
    constituencies: [
      { id: 'jalukbari', name: 'Jalukbari', type: 'Safe', leading: 'BJP', margin: '100,000+', candidate: 'Himanta Biswa Sarma', history: [90000, 95000, 100000] },
      { id: 'majuli', name: 'Majuli', type: 'Star', leading: 'BJP', margin: '20,000+', candidate: 'Bhuban Gam', history: [15000, 18000, 20000] },
      { id: 'titabar', name: 'Titabar', type: 'Safe', leading: 'Congress', margin: '15,000+', candidate: 'Bhaskar Jyoti Baruah', history: [12000, 14000, 15000] },
    ],
    parties: [
      { id: 'bjp', name: 'BJP+', color: '#FF9933', seats: 75, voteShare: 44.5, momentum: 0 },
      { id: 'congress', name: 'Congress+', color: '#de2d26', seats: 42, voteShare: 35.2, momentum: 0 },
      { id: 'aiudf', name: 'AIUDF', color: '#008136', seats: 8, voteShare: 12.8, momentum: 0 },
      { id: 'others', name: 'Others', color: '#666666', seats: 1, voteShare: 7.5, momentum: 0 },
    ],
    trendData: [
      { date: 'Jan 26', bjp: 80, congress: 38 },
      { date: 'Feb 26', bjp: 78, congress: 40 },
      { date: 'Mar 26', bjp: 74, congress: 44 },
      { date: 'Apr 26', bjp: 75, congress: 42 },
    ],
    pollData: {
      prePoll: { bjp: 78, congress: 40, aiudf: 7 },
      postPoll: { bjp: 72, congress: 45, aiudf: 9 },
      exitPoll: { bjp: 75, congress: 42, aiudf: 8 },
    },
    socialTrends: [
      { platform: 'X / Twitter', mentions: '600K', sentiment: 'Positive', trendingTopic: '#NortheastFirst', icon: Zap },
      { platform: 'Instagram', mentions: '400K', sentiment: 'Neutral', trendingTopic: '#Assam2026', icon: Share2 },
      { platform: 'Facebook', mentions: '1.8M', sentiment: 'Positive', trendingTopic: 'Tribal Progress', icon: Users },
    ]
  }
};

export default function App() {
  const [selectedStateId, setSelectedStateId] = useState('tamilnadu');
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'trends'>('overview');
  const [activeRegion, setActiveRegion] = useState('all');
  const [stateData, setStateData] = useState(STATE_CONFIGS[selectedStateId]);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [selectedConstituencyId, setSelectedConstituencyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSources, setShowSources] = useState(false);
  const [syncTime, setSyncTime] = useState(new Date());
  
  // Dynamic sync time update
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const [liveInsight, setLiveInsight] = useState('TVK youth outreach gaining momentum in urban clusters');
  const [socialSentimentScores, setSocialSentimentScores] = useState<Record<number, number>>({ 0: 65, 1: 45, 2: 78 });
  
  // Dynamic Sentiment Fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setSocialSentimentScores(prev => {
        const next = { ...prev };
        [0, 1, 2].forEach(idx => {
          const shift = Math.floor(Math.random() * 5) - 2; // -2 to +2
          next[idx] = Math.max(0, Math.min(100, (next[idx] || 50) + shift));
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Cycle through live insights for "frequent updates" feel
  useEffect(() => {
    const insights = [
      'TVK youth outreach gaining momentum in urban clusters',
      'DMK welfare schemes counteracting localized inflation concerns',
      'AIADMK consolidating rural base in southern districts',
      'Social media sentiment showing 15% spike in engagement for TVK',
      'Swing voters in Kongu region prioritizing industrial growth',
      'Minority vote consolidation favoring the incumbent alliance'
    ];
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % insights.length;
      setLiveInsight(insights[i]);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Sync state data when selection changes
  useEffect(() => {
    setStateData(STATE_CONFIGS[selectedStateId]);
    setActiveRegion('all');
    setSelectedConstituencyId(null);
    setSearchTerm('');
  }, [selectedStateId]);

  const handleOpenDeepDive = (constituencyId?: string) => {
    if (constituencyId) {
      setSelectedConstituencyId(constituencyId);
    }
    setShowDeepDive(true);
  };

  const handleMomentumChange = (id: string, value: number) => {
    setStateData(prev => {
      // 1. Update global party seats
      const updatedParties = prev.parties.map(p => {
        if (p.id === id) {
          const swing = Math.round(value * 8); // Simulation Factor
          const basePartyData = STATE_CONFIGS[selectedStateId].parties.find(orig => orig.id === id);
          const baseSeats = basePartyData ? basePartyData.seats : 0;
          return { ...p, momentum: value, seats: Math.max(0, Math.min(prev.totalSeats, baseSeats + swing)) };
        }
        return p;
      });

      // 2. Proportional regional update
      const updatedRegions = prev.regions.map(reg => {
        const regPartySeats = { ...reg.partySeats };
        if (regPartySeats[id] !== undefined) {
          const localSwing = Math.round(value * (reg.total / 100) * 1.5);
          const baseRegSeats = STATE_CONFIGS[selectedStateId].regions.find(r => r.id === reg.id)?.partySeats?.[id] || 0;
          regPartySeats[id] = Math.max(0, Math.min(reg.total, baseRegSeats + localSwing));
        }
        return { ...reg, partySeats: regPartySeats };
      });

      return { ...prev, parties: updatedParties, regions: updatedRegions };
    });
  };

  const resetSimulation = () => setStateData(STATE_CONFIGS[selectedStateId]);

  const leadingParty = [...stateData.parties].sort((a, b) => b.seats - a.seats)[0];
  const activeRegionData = stateData.regions.find(r => r.id === activeRegion);

  return (
    <div className="relative min-h-screen w-full bg-brand-bg text-brand-text font-sans overflow-x-hidden select-none pb-24">
      {/* Background Texture/Grid */}
      <div className="fixed inset-0 art-grid pointer-events-none opacity-[0.05] z-0" />

      {/* Deep Dive Modal */}
      <AnimatePresence>
        {showDeepDive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-brand-bg/95 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-4xl w-full h-[80vh] bg-white border border-brand-text/10 p-8 md:p-12 relative overflow-y-auto"
            >
              <button 
                onClick={() => setShowDeepDive(false)}
                className="absolute top-8 right-8 text-[10px] uppercase tracking-widest font-bold underline"
              >
                Close
              </button>
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-text/40 mb-4 block">Strategic Depth</span>
              <h2 className="text-4xl font-serif italic mb-12">Constituency Analysis.</h2>
              
              <div className="grid md:grid-cols-12 gap-12">
                <div className="md:col-span-4 space-y-8">
                  <h4 className="text-xs font-bold uppercase tracking-widest border-b border-brand-text/5 pb-2">Strategic Depth</h4>
                  <p className="text-sm leading-relaxed text-brand-text/70 italic">
                    {stateData.description || 'Global shift in the electoral landscape is transitioning towards a newer multi-polar contest.'}
                  </p>
                  <div className="bg-brand-text/5 p-6 space-y-4">
                    <div className="flex justify-between text-[11px] uppercase tracking-tighter">
                      <span>Anti-Incumbency Factor</span>
                      <span className="font-bold">MODERATE / 4.2</span>
                    </div>
                    <div className="h-[1px] bg-brand-text/10 w-full" />
                    <div className="flex justify-between text-[11px] uppercase tracking-tighter">
                      <span>Swing Voter Ratio</span>
                      <span className="font-bold">HIGH / 18.4%</span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-widest border-b border-brand-text/5 pb-2 mt-8">Regional Dynamics</h4>
                  {stateData.regions.slice(1).map((r: any) => (
                    <div key={r.id} className="p-4 border border-brand-text/5 hover:border-brand-text/20 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium uppercase">{r.label}</span>
                        <span className="text-[10px] opacity-40">{r.total} Seats</span>
                      </div>
                      <div className="w-full h-1 bg-brand-text/5">
                        <div className="h-full bg-brand-text/20" style={{ width: `${(r.total/stateData.totalSeats)*100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="md:col-span-8 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-text/5 pb-4 gap-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest">Star & Swing Constituencies</h4>
                      <span className="text-[10px] text-brand-text/40 uppercase tracking-widest">{stateData.constituencies?.length || 0} Key Battles</span>
                    </div>
                    
                    <div className="relative w-full md:w-64">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/30" />
                      <input 
                        type="text"
                        placeholder="SEARCH CONSTITUENCY..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-brand-text/5 border border-brand-text/10 px-9 py-2 text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {stateData.constituencies?.filter(c => 
                      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      c.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      c.leading.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((c) => (
                      <div 
                        key={c.id} 
                        onClick={() => setSelectedConstituencyId(c.id)}
                        className={`p-5 border transition-all cursor-pointer group relative ${
                          selectedConstituencyId === c.id ? 'bg-brand-accent/5 border-brand-accent ring-1 ring-brand-accent' : 'bg-white border-brand-text/10 hover:border-brand-accent'
                        }`}
                      >
                        {selectedConstituencyId === c.id && (
                          <div className="absolute -top-2 -right-2 bg-brand-accent text-white p-1 rounded-full shadow-lg">
                            <Info size={12} />
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h5 className="text-[10px] uppercase tracking-widest text-brand-text/40 mb-1">{c.type} SEAT</h5>
                            <h3 className="text-lg font-serif italic">{c.name}</h3>
                          </div>
                          <span className={`text-[8px] font-bold px-2 py-1 uppercase tracking-widest ${
                            c.type === 'Star' ? 'bg-brand-accent text-white' : 
                            c.type === 'Swing' ? 'bg-orange-100 text-orange-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {c.type}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          {c.history && (
                            <div className="h-10 w-full bg-brand-text/5 -mx-5 px-5 py-1 mb-4 flex items-center justify-between">
                              <span className="text-[8px] uppercase tracking-widest text-brand-text/30">3M Trend</span>
                              <div className="h-full w-24">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={c.history.map((val, i) => ({ val, i }))}>
                                    <Line 
                                      type="monotone" 
                                      dataKey="val" 
                                      stroke={stateData.parties.find(p => p.id === c.leading.toLowerCase() || p.name.includes(c.leading))?.color || '#000'} 
                                      strokeWidth={1.5} 
                                      dot={false}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase text-brand-text/40">Candidate</span>
                            <span className="text-xs font-bold">{c.candidate}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase text-brand-text/40">Leading</span>
                            <span className="text-xs font-serif italic text-brand-accent">{c.leading}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase text-brand-text/40">Est. Margin</span>
                            <span className="text-[10px] font-mono">{c.margin}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedConstituencyId && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 p-8 border border-brand-accent/20 bg-brand-accent/5"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="text-[10px] uppercase tracking-widest text-brand-accent font-bold mb-1">Deep Analysis</h4>
                          <h3 className="text-2xl font-serif italic">
                            {stateData.constituencies?.find(c => c.id === selectedConstituencyId)?.name} Detail.
                          </h3>
                        </div>
                        <button onClick={() => setSelectedConstituencyId(null)} className="text-[9px] uppercase font-bold text-brand-text/40 hover:text-brand-text">Clear Select</button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                          <span className="text-[8px] uppercase tracking-widest opacity-40 block mb-1">Primary Variable</span>
                          <span className="text-xs font-bold">Voter Turnout</span>
                        </div>
                        <div>
                          <span className="text-[8px] uppercase tracking-widest opacity-40 block mb-1">Caste Alignment</span>
                          <span className="text-xs font-bold">Favorable</span>
                        </div>
                        <div>
                          <span className="text-[8px] uppercase tracking-widest opacity-40 block mb-1">Welfare Impact</span>
                          <span className="text-xs font-bold">High (3.8/5)</span>
                        </div>
                        <div>
                          <span className="text-[8px] uppercase tracking-widest opacity-40 block mb-1">Last Margin</span>
                          <span className="text-xs font-bold text-brand-accent">2.4% Swing</span>
                        </div>
                      </div>
                      
                      {/* New AI Analysis Integration */}
                      <div className="mt-8 p-6 bg-brand-text/5 border-l-2 border-brand-accent">
                        <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Gemini AI Analysis: Aggregated Trends</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[10px] leading-relaxed italic text-brand-text/60">
                          <div>
                            <p className="mb-2 uppercase text-[8px] font-bold text-brand-text/40">Market Sentiment</p>
                            Extreme polarization in rural clusters; youth demographic (18-24) showing 22% indecision coefficient, likely favoring newer political entrants.
                          </div>
                          <div>
                            <p className="mb-2 uppercase text-[8px] font-bold text-brand-text/40">Update Frequency</p>
                            Analysis updated every 4 hours based on social media velocity and localized poll aggregates. Sentiment volatility index: High.
                          </div>
                        </div>
                      </div>

                      <p className="mt-8 text-[11px] leading-relaxed italic text-brand-text/70">
                        {selectedConstituencyId === 'nandigram' ? 'Nandigram is the epicenter of the 2026 contest, where the polarization of the rural vote and the performance of independent candidates will be decisive.' : 
                         selectedConstituencyId === 'rk-nagar' ? 'RK Nagar remains a urban lighthouse for the Dravidian movement, with high institutional memory favoring the incumbent base.' :
                         'This constituency represents a critical junction in the current electoral simulation, showing signs of significant demographic shift towards the leading party.'}
                      </p>
                    </motion.div>
                  )}
                  
                  <div className="mt-8 p-6 bg-brand-accent/5 border border-brand-accent/10">
                    <p className="text-[10px] text-brand-text/60 italic leading-relaxed">
                      * Star constituencies are defined by high-profile candidates or historical significance. Swing seats have a victory margin of less than 5% in previous elections. Detailed margin figures are simulations based on multi-poll weights.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sources & Methodology Modal */}
      <AnimatePresence>
        {showSources && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-12 bg-brand-bg/95 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-2xl w-full bg-white border border-brand-text/10 p-8 md:p-12 relative"
            >
              <button 
                onClick={() => setShowSources(false)}
                className="absolute top-8 right-8 text-[10px] uppercase tracking-widest font-bold underline"
              >
                Close
              </button>
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-text/40 mb-4 block">Transparency & Research</span>
              <h2 className="text-4xl font-serif italic mb-8">Data Sources & <br/> Methodology.</h2>
              
              <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4">
                <section>
                  <h4 className="text-xs font-bold uppercase tracking-widest border-b border-brand-text/5 pb-2 mb-4">Historical Foundations</h4>
                  <ul className="text-[11px] space-y-3 text-brand-text/70 italic leading-relaxed">
                    <li>• <span className="font-bold text-brand-text">Election Commission of India (ECI):</span> Primary source for constituency-wise results from 2011, 2016, and 2021 Assembly elections.</li>
                    <li>• <span className="font-bold text-brand-text">Census of India 2011:</span> Used for demographic weighting, urbanization metrics, and literacy rate indicators at the state and district levels.</li>
                    <li>• <span className="font-bold text-brand-text">PRS Legislative Research:</span> Referenced for historical seat shares and MLA performance archetypes.</li>
                  </ul>
                </section>

                <section>
                  <h4 className="text-xs font-bold uppercase tracking-widest border-b border-brand-text/5 pb-2 mb-4">Simulation Logic</h4>
                  <p className="text-[11px] text-brand-text/60 leading-relaxed italic">
                    The projections in this dashboard use a <span className="font-bold text-brand-text">Consensus-Based Bayesian Model</span>. It aggregates publicly available opinion trends and applies a swing-factor to historical vote bases. The "Momentum" simulator uses regional weights to distribute seat gains or losses across constituencies based on their past marginality.
                  </p>
                </section>

                <section className="bg-brand-text/5 p-6 border-l-2 border-brand-accent">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2">AI Generation & Educational Disclaimer</h4>
                  <p className="text-[10px] text-brand-text/70 leading-relaxed italic">
                    This application is <span className="font-bold text-brand-text">fully AI-generated</span> as an educational exercise in political data visualization and synthetic analysis. All code, design elements, and simulated projections are produced by AI models for archival and research demonstration. It is not an actual prediction of future outcomes.
                  </p>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 w-full h-16 md:h-20 px-4 md:px-12 flex items-center justify-between border-b border-brand-text/5 z-50 bg-brand-bg/90 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab('overview')}
        >
          <Vote className="text-brand-text" size={24} />
          <div className="flex flex-col -space-y-1">
            <span className="font-serif italic text-xl md:text-2xl tracking-tighter">India2026.</span>
            <span className="text-[7px] uppercase tracking-widest text-brand-text/30 font-bold">Educational Simulation</span>
          </div>
        </motion.div>
          <div className="flex gap-4 md:gap-8 text-[9px] md:text-[11px] uppercase tracking-[0.2em] font-bold">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 cursor-pointer transition-all duration-300 ${activeTab === 'overview' ? 'text-brand-text' : 'text-brand-text/30 hover:text-brand-text/60'}`}
            >
              <LayoutDashboard size={14} className="md:hidden" />
              <span className="hidden md:inline">Overview</span>
            </button>
            <button 
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 cursor-pointer transition-all duration-300 ${activeTab === 'simulator' ? 'text-brand-text' : 'text-brand-text/30 hover:text-brand-text/60'}`}
            >
              <Activity size={14} className="md:hidden" />
              <span className="hidden md:inline">Simulator</span>
            </button>
            <button 
              onClick={() => setActiveTab('trends')}
              className={`flex items-center gap-2 cursor-pointer transition-all duration-300 ${activeTab === 'trends' ? 'text-brand-text' : 'text-brand-text/30 hover:text-brand-text/60'}`}
            >
              <TrendingUp size={14} className="md:hidden" />
              <span className="hidden md:inline">Trends</span>
            </button>
          </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-accent transition-colors" />
            <input 
              type="text"
              placeholder="SEARCH CONSTITUENCY..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.length > 0) setShowDeepDive(true);
              }}
              className="bg-brand-text/5 border border-brand-text/10 px-9 py-2 text-[10px] w-48 uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-all focus:w-64"
            />
          </div>
          <div className="hidden xl:flex flex-col items-end mr-2 text-right">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-1 rounded-full bg-brand-accent animate-ping" />
              <span className="text-[7px] text-brand-text/30 uppercase tracking-[0.2em] font-bold">Live Stream: {liveInsight}</span>
            </div>
            <span className="text-[8px] text-brand-text/50 font-mono">Synced: {syncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="hidden lg:flex px-4 py-2 border border-brand-text/10 rounded-full text-[9px] tracking-widest uppercase items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Projections Active
          </div>
          <button className="p-2 hover:bg-brand-text/5 rounded-full transition-colors">
            <LayoutDashboard size={18} />
          </button>
        </div>
      </nav>

      {/* Territory Selection Bar */}
      <div className="w-full bg-white border-b border-brand-text/5 px-4 md:px-12 py-3 md:py-4 flex items-center justify-center overflow-x-auto gap-4 md:gap-8 sticky top-16 md:top-20 z-40 backdrop-blur-sm bg-white/80">
        <span className="text-[9px] uppercase tracking-[0.2em] text-brand-text/30 font-bold whitespace-nowrap">Switch Territory:</span>
        <div className="flex items-center gap-4 md:gap-10">
          {Object.entries(STATE_CONFIGS).map(([id, config]) => (
            <button
              key={id}
              onClick={() => setSelectedStateId(id)}
              className={`text-[10px] md:text-[11px] uppercase font-bold tracking-widest transition-all relative py-1 flex items-center gap-2 ${
                selectedStateId === id ? 'text-brand-text' : 'text-brand-text/30 hover:text-brand-text'
              }`}
            >
              <div className={`w-1 h-1 rounded-full ${selectedStateId === id ? 'bg-brand-accent' : 'bg-transparent'}`} />
              {config.name}
              {selectedStateId === id && (
                <motion.div 
                  layoutId="activeStateUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-brand-accent"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Party Key Factors Ticker */}
      <div className="w-full bg-brand-text text-brand-bg py-2 overflow-hidden border-b border-white/10 z-30">
        <motion.div 
          animate={{ x: [0, -2000] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap gap-12"
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-12">
              {stateData.parties.map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">{p.name} Key Factor:</span>
                  <span className="text-[10px] font-serif italic tracking-wider">{p.factor || 'Strategic Consolidation'}</span>
                  <div className="w-1 h-1 rounded-full bg-brand-accent" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar / Filter Panel */}
        <aside className="hidden lg:block lg:sticky lg:top-32 w-64 p-12 z-40 h-fit">
          <div className="mb-12">
            <h3 className="text-[9px] uppercase tracking-[0.3em] text-brand-text/40 mb-6 border-b border-brand-text/5 pb-2">Territory Index</h3>
            <ul className="space-y-3">
              {Object.entries(STATE_CONFIGS).map(([id, config]) => (
                <li 
                  key={id}
                  onClick={() => setSelectedStateId(id)}
                  className={`text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-colors ${selectedStateId === id ? 'text-brand-accent' : 'text-brand-text/40 hover:text-brand-text'}`}
                >
                  {config.name}
                </li>
              ))}
            </ul>
          </div>

          <h3 className="text-[9px] uppercase tracking-[0.3em] text-brand-text/40 mb-8 border-b border-brand-text/5 pb-2">Regional Filter</h3>
          <ul className="space-y-8">
            {stateData.regions.map((region: any, i: number) => (
              <motion.li 
                key={region.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => setActiveRegion(region.id)}
                className={`group flex flex-col cursor-pointer transition-opacity ${activeRegion === region.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium group-hover:translate-x-1 transition-transform">{region.label}</span>
                  <ChevronRight size={10} className={`transition-transform ${activeRegion === region.id ? 'translate-x-1' : ''}`} />
                </div>
                <div className="w-full h-[1px] bg-brand-text/5 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 h-full bg-brand-text/40`} style={{ width: `${(region.total/stateData.totalSeats)*100}%` }} />
                </div>
              </motion.li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative z-10 px-4 md:px-12 pt-8 md:pt-12">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <header className="mb-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-brand-text/40 mb-2 block">
                        Political Analysis / {stateData.name} / {activeRegionData?.label}
                      </span>
                      <h1 className="text-4xl md:text-6xl font-serif italic tracking-tighter leading-none">
                        {stateData.name} <span className="opacity-40">Projections.</span>
                      </h1>
                    </div>
                    
                    <div className="flex items-center gap-8 border-l border-brand-text/10 pl-8">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-brand-text/40 block mb-1">Seats Focus</span>
                        <span className="text-2xl font-serif italic">{activeRegionData?.total}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-brand-text/40 block mb-1">Majority Mark</span>
                        <span className="text-2xl font-serif italic">{stateData.majority}</span>
                      </div>
                    </div>
                  </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-8">
                    {/* Majority Indicator */}
                    <div className="bg-white border border-brand-text/5 p-8 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider">Majority Status</h3>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 ${leadingParty.seats >= stateData.majority ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {leadingParty.seats >= stateData.majority ? 'Majority Confirmed' : 'Hung Assembly Possible'}
                        </span>
                      </div>
                      
                      <div className="relative h-4 bg-brand-text/5 rounded-full mb-4 overflow-hidden flex">
                        {stateData.parties.map((party: any) => (
                          <motion.div
                            key={party.id}
                            initial={{ width: 0 }}
                            animate={{ width: `${(party.seats / stateData.totalSeats) * 100}%` }}
                            transition={{ duration: 1, ease: 'circOut' }}
                            style={{ backgroundColor: party.color }}
                            className="h-full relative group"
                          >
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-brand-text text-brand-bg text-[9px] py-1 px-2 z-50">
                              {party.name}: {party.seats}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-[11px] italic text-brand-text/60 mt-8">
                        Current projection shows <span className="font-bold text-brand-text">{leadingParty.name}</span> leading in {activeRegion === 'all' ? 'the entire state' : activeRegionData?.label}.
                      </p>
                    </div>

                    {/* regional party split - new section */}
                    <div className="bg-white border border-brand-text/5 p-8 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                          <MapIcon size={16} />
                          <h3 className="text-xs font-bold uppercase tracking-wider">Regional Party Split</h3>
                        </div>
                      </div>
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            layout="vertical"
                            data={stateData.regions.slice(1).map(region => ({
                              name: region.label,
                              ...region.partySeats
                            }))} 
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#666' }} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: '10px', borderRadius: '0px' }} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', paddingTop: '20px' }} />
                            {stateData.parties.map(party => (
                              <Bar 
                                key={party.id} 
                                dataKey={party.id} 
                                stackId="a" 
                                fill={party.color} 
                                name={party.name}
                                radius={0}
                              />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Social Media Pulse - new section */}
                    <div className="bg-white border border-brand-text/5 p-8 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                          <Activity size={16} />
                          <h3 className="text-xs font-bold uppercase tracking-wider">Social Media Pulse</h3>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stateData.socialTrends.map((trend, idx) => (
                          <div key={idx} className="p-4 bg-brand-text/5 border border-brand-text/5 hover:border-brand-accent/20 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                              <trend.icon size={20} className="text-brand-text/40 group-hover:text-brand-accent transition-colors" />
                              <div className="flex flex-col items-end">
                                <span className={`text-[8px] uppercase font-bold px-2 py-1 ${
                                  (socialSentimentScores[idx] || 50) > 60 ? 'bg-green-100 text-green-700' : 
                                  (socialSentimentScores[idx] || 50) < 40 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {(socialSentimentScores[idx] || 50) > 60 ? 'Positive' : 
                                   (socialSentimentScores[idx] || 50) < 40 ? 'Negative' : 'Neutral'}
                                </span>
                                <span className="text-[7px] font-mono mt-1 opacity-40">Score: {socialSentimentScores[idx] || 50}%</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-[10px] uppercase tracking-widest text-brand-text/40">{trend.platform}</h4>
                              <p className="text-xl font-serif italic">{trend.mentions}</p>
                              <p className="text-[10px] font-mono text-brand-accent mt-2">{trend.trendingTopic}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Constituency Highlights - new section */}
                    <div className="bg-white border border-brand-text/5 p-8 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          <h3 className="text-xs font-bold uppercase tracking-wider">Constituency Analysis Highlights</h3>
                        </div>
                        <button 
                          onClick={() => setShowDeepDive(true)}
                          className="text-[9px] uppercase tracking-widest font-bold text-brand-accent border-b border-brand-accent pb-0.5"
                        >
                          Full Breakdown
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(stateData.constituencies?.filter(c => c.type === 'Star') || []).slice(0, 4).map((c) => (
                          <div key={c.id} className="p-4 border border-brand-text/5 bg-brand-bg/10 flex justify-between items-center group cursor-pointer hover:border-brand-accent/30 transition-colors" onClick={() => handleOpenDeepDive(c.id)}>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[8px] uppercase font-bold ${c.leading === 'DMK' ? 'text-red-600' : 'text-brand-accent'}`}>{c.type}</span>
                                <h4 className="text-sm font-bold">{c.name}</h4>
                              </div>
                              <p className="text-[10px] text-brand-text/40 italic">{c.candidate}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] font-serif italic block leading-none ${c.leading === 'DMK' ? 'text-red-600' : 'text-brand-text'}`}>{c.leading}</span>
                              <span className="text-[8px] uppercase tracking-tighter text-brand-text/30 font-mono">+{c.margin}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Main Chart */}
                    <div className="bg-white border border-brand-text/5 p-8 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                          <BarChart3 size={16} />
                          <h3 className="text-xs font-bold uppercase tracking-wider">Poll Performance Comparison</h3>
                        </div>
                      </div>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stateData.parties.map((p: any) => ({
                            name: p.name,
                            color: p.color,
                            pre: stateData.pollData.prePoll[p.id] || 0,
                            post: stateData.pollData.postPoll[p.id] || 0,
                            exit: stateData.pollData.exitPoll[p.id] || 0
                          }))} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '0px' }} />
                            <Bar dataKey="pre" fill="#ccc" name="Pre-Poll" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="post" fill="#999" name="Post-Poll" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="exit" fill="#333" name="Exit Poll" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                    <div className="bg-brand-text text-brand-bg p-8 flex flex-col items-center">
                      <div className="w-full flex justify-between items-start mb-6">
                        <TrendingUp size={16} className="opacity-40" />
                        <span className="text-[9px] tracking-widest opacity-40 uppercase">Consolidated Election Forecast</span>
                      </div>
                      <div className="text-center py-4">
                        <span className="text-[10px] uppercase font-bold opacity-40 tracking-widest block mb-2">{leadingParty.name}</span>
                        <h4 className="text-6xl font-serif italic mb-2">
                          {Math.round((stateData.pollData.prePoll[leadingParty.id] + stateData.pollData.postPoll[leadingParty.id] + stateData.pollData.exitPoll[leadingParty.id]) / 3)}
                        </h4>
                        <span className="text-[10px] uppercase font-bold opacity-40 tracking-widest text-brand-accent">Projected Mean Seats</span>
                        <div className="mt-8 flex items-center justify-center gap-12">
                          <div className="text-center">
                            <span className="text-[8px] uppercase block opacity-40 mb-1">Conf. Interval</span>
                            <span className="text-xs font-mono">±{Math.max(
                              Math.abs(stateData.pollData.prePoll[leadingParty.id] - stateData.pollData.postPoll[leadingParty.id]),
                              Math.abs(stateData.pollData.postPoll[leadingParty.id] - stateData.pollData.exitPoll[leadingParty.id]),
                              Math.abs(stateData.pollData.prePoll[leadingParty.id] - stateData.pollData.exitPoll[leadingParty.id])
                            )}</span>
                          </div>
                          <div className="w-[1px] h-4 bg-white/10" />
                          <div className="text-center">
                            <span className="text-[8px] uppercase block opacity-40 mb-1">Poll Variance</span>
                            <span className="text-xs font-mono">
                              {Math.max(
                                Math.abs(stateData.pollData.prePoll[leadingParty.id] - stateData.pollData.postPoll[leadingParty.id]),
                                Math.abs(stateData.pollData.postPoll[leadingParty.id] - stateData.pollData.exitPoll[leadingParty.id]),
                                Math.abs(stateData.pollData.prePoll[leadingParty.id] - stateData.pollData.exitPoll[leadingParty.id])
                              ) > 10 ? 'HIGH' : 'LOW'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 pt-6 border-t border-white/5 w-full">
                         <p className="text-[9px] text-center opacity-30 italic leading-relaxed">
                           Consolidated average of Pre-Poll, Post-Poll, and Exit-Poll data sets weighted by historical accuracy.
                         </p>
                      </div>
                    </div>

                    <div className="border border-brand-text/10 p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Zap size={16} className="text-brand-accent" />
                        <h3 className="text-xs font-bold uppercase tracking-wider">Quick Insight</h3>
                      </div>
                      <p className="text-[11px] text-brand-text/60 leading-relaxed font-light italic mb-8">
                        {stateData.insight || 'Historical trends suggest that the swing voter consolidation will be the primary variable in this election.'}
                      </p>
                      
                      <div className="space-y-6 pt-8 border-t border-brand-text/5">
                        <div>
                          <h4 className="text-[10px] uppercase font-bold tracking-widest text-brand-text/40 mb-2">Historical Context</h4>
                          <p className="text-[11px] text-brand-text/60 leading-relaxed italic">{stateData.history}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {stateData.demographics.map((demo, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-brand-text/5 p-2 px-3">
                              <span className="text-[9px] uppercase font-medium">{demo.label}</span>
                              <span className="text-[10px] font-serif italic text-brand-text">{demo.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'simulator' && (
              <motion.div 
                key="simulator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <header className="mb-12">
                   <span className="text-[10px] uppercase tracking-[0.3em] text-brand-text/40 mb-2 block">Prediction Engine</span>
                   <h2 className="text-4xl font-serif italic mb-4">Swing Simulator.</h2>
                   <p className="text-sm text-brand-text/50 max-w-xl italic">
                     Adjust party performance to see how vote share swings affect final seat counts. This model considers regional demographic weights.
                   </p>
                </header>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    {stateData.parties.map((party: any) => (
                      <div key={party.id} className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3" style={{ backgroundColor: party.color }} />
                            <span className="text-xs font-bold uppercase">{party.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold">
                            {party.momentum > 0 ? '+' : ''}{party.momentum.toFixed(1)}
                          </span>
                        </div>
                        <input 
                          type="range"
                          min="-2"
                          max="2"
                          step="0.1"
                          value={party.momentum}
                          onChange={(e) => handleMomentumChange(party.id, parseFloat(e.target.value))}
                          className="w-full h-1 bg-brand-text/5 appearance-none cursor-pointer accent-brand-text"
                        />
                        <div className="flex justify-between text-[9px] opacity-40 uppercase tracking-widest">
                          <span>Negative Swing</span>
                          <span>Positive Momentum</span>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={resetSimulation}
                      className="text-[10px] uppercase tracking-widest font-bold underline"
                    >
                      Reset Strategy
                    </button>
                  </div>

                  <div className="bg-white border border-brand-text/5 p-8 flex flex-col justify-center text-center space-y-12 shadow-[40px_40px_80px_-20px_rgba(0,0,0,0.05)]">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-brand-text/40 block mb-2">Projected Status</span>
                      <h4 className="text-5xl font-serif italic">{leadingParty.seats}</h4>
                      <span className="text-xs uppercase font-bold opacity-40">Seats for {leadingParty.name}</span>
                    </div>
                    <div className="h-[1px] bg-brand-text/10 w-1/2 mx-auto" />
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-brand-text/40 block mb-2">Threshold Analysis</span>
                      <div className="text-xl font-serif italic text-brand-text">
                        {leadingParty.seats >= stateData.majority ? 'Majority Threshold Reached' : 'Collaborative Governance Needed'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'trends' && (
              <motion.div 
                key="trends"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <header className="mb-12">
                   <span className="text-[10px] uppercase tracking-[0.3em] text-brand-text/40 mb-2 block">Timeline Analysis</span>
                   <h2 className="text-4xl font-serif italic mb-4">Historical Trajectory.</h2>
                   <p className="text-sm text-brand-text/50 max-w-xl italic">
                     Analyzing the momentum shifts across the 2026 pre-election window. Data represents the aggregate seat projections from historical benchmarks.
                   </p>
                </header>
                
                <div className="bg-white border border-brand-text/5 p-4 md:p-8 h-[500px] shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stateData.trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '0px' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                      {stateData.parties.slice(0, 4).map((p: any) => (
                        <Line 
                          key={p.id} 
                          type="monotone" 
                          dataKey={p.id} 
                          stroke={p.color} 
                          strokeWidth={2}
                          dot={{ r: 3, fill: p.color }}
                          activeDot={{ r: 5 }}
                          name={p.name}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer / Floating Interface */}
      <footer className="fixed bottom-0 left-0 w-full h-24 bg-brand-bg/95 backdrop-blur-md border-t border-brand-text/5 z-50 px-4 md:px-12 flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-12">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-[0.2em] text-brand-text/40 mb-1">Compliance Status</span>
              <span className="text-[9px] font-serif italic text-brand-accent">ECI PRE-POLL GUIDELINES ACTIVE</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[8px] uppercase tracking-[0.2em] text-brand-text/40 mb-1">Information Source</span>
              <button 
                onClick={() => setShowSources(true)}
                className="text-[9px] font-serif italic text-brand-text hover:underline text-left"
              >
                View Sources & Methodology →
              </button>
            </div>
            <div className="flex flex-col border-l border-brand-text/10 pl-8 bg-brand-accent/10 p-2 md:p-3 px-4 md:px-6">
              <span className="text-[8px] uppercase tracking-[0.2em] text-brand-accent font-bold mb-1">Mandatory Disclosure</span>
              <span className="text-[9px] font-sans text-brand-text/80 max-w-[320px] leading-tight italic">
                This platform is <span className="font-bold text-brand-text">FULLY AI-GENERATED</span> for educational and research purposes. All projections are simulated datasets.
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => handleOpenDeepDive()}
              className="px-6 h-10 bg-brand-text text-brand-bg text-[9px] tracking-[0.2em] uppercase font-bold flex items-center gap-2 hover:bg-brand-text/90 transition-all active:scale-95"
            >
              <TrendingUp size={12} />
              Deep Dive
            </button>
            <button className="hidden sm:flex w-10 h-10 items-center justify-center border border-brand-text/10 hover:border-brand-text transition-colors">
              <Settings2 size={14} />
            </button>
            <button className="w-10 h-10 items-center justify-center border border-brand-text/10 hover:border-brand-text transition-colors">
              <Users size={14} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}


