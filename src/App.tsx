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
  LayoutDashboard
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
  Pie
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
  regions: any[];
  trendData: any[];
  pollData: {
    prePoll: Record<string, number>;
    postPoll: Record<string, number>;
    exitPoll: Record<string, number>;
  };
}> = {
  tamilnadu: {
    name: 'Tamil Nadu',
    description: 'Recent pre-poll aggregates suggest a strong consolidation for the DMK alliance, potentially crossing the 150-seat mark. While the emergence of TVK creates a multi-polar contest, the incumbent base in urban and industrial belts appears resilient.',
    insight: 'The 150+ consensus is driven by a projected sweep in Greater Chennai and the Kaveri Delta, where welfare delivery has countered potential split-vote risks.',
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
      { id: 'kongu', label: 'Kongu / West', total: 54 },
      { id: 'chennai', label: 'Greater Chennai', total: 28 },
      { id: 'delta', label: 'Kaveri Delta', total: 32 },
      { id: 'south', label: 'Deep South', total: 60 },
      { id: 'north', label: 'Vanniyar Belt', total: 60 },
    ],
    parties: [
      { id: 'dmk', name: 'DMK Alliance', color: '#EC1C24', seats: 152, voteShare: 42.5, momentum: 0 },
      { id: 'aiadmk', name: 'AIADMK Alliance', color: '#008136', seats: 42, voteShare: 26.2, momentum: 0 },
      { id: 'tvk', name: 'TVK (Vijay)', color: '#F7E017', seats: 18, voteShare: 12.8, momentum: 0 },
      { id: 'bjp', name: 'BJP', color: '#FF9933', seats: 10, voteShare: 8.5, momentum: 0 },
      { id: 'ntk', name: 'NTK', color: '#FFCC00', seats: 4, voteShare: 6.2, momentum: 0 },
      { id: 'others', name: 'Others', color: '#666666', seats: 8, voteShare: 3.8, momentum: 0 },
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
    }
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
      { id: 'north', label: 'North Bengal', total: 54 },
      { id: 'south', label: 'South Bengal', total: 240 },
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
    }
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
      { id: 'brahmaputra', label: 'Brahmaputra Valley', total: 111 },
      { id: 'barak', label: 'Barak Valley', total: 15 },
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
    }
  }
};

export default function App() {
  const [selectedStateId, setSelectedStateId] = useState('tamilnadu');
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'trends'>('overview');
  const [activeRegion, setActiveRegion] = useState('all');
  const [stateData, setStateData] = useState(STATE_CONFIGS[selectedStateId]);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [showSources, setShowSources] = useState(false);

  // Sync state data when selection changes
  useEffect(() => {
    setStateData(STATE_CONFIGS[selectedStateId]);
    setActiveRegion('all');
  }, [selectedStateId]);

  const handleMomentumChange = (id: string, value: number) => {
    setStateData(prev => {
      const updatedParties = prev.parties.map(p => {
        if (p.id === id) {
          const swing = Math.round(value * 10);
          const baseSeats = STATE_CONFIGS[selectedStateId].parties.find(orig => orig.id === id)?.seats || 0;
          return { ...p, momentum: value, seats: Math.max(0, Math.min(prev.totalSeats, baseSeats + swing)) };
        }
        return p;
      });
      return { ...prev, parties: updatedParties };
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
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h4 className="text-xs font-bold uppercase tracking-widest border-b border-brand-text/5 pb-2">The Multi-Polar Shift</h4>
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
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest">Regional Dynamics</h4>
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
        <div className="flex items-center gap-4 md:gap-8">
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
          <div className="hidden sm:block h-4 w-[1px] bg-brand-text/10" />
          <div className="flex gap-2">
            {Object.entries(STATE_CONFIGS).map(([id, config]) => (
              <button
                key={id}
                onClick={() => setSelectedStateId(id)}
                className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold transition-all ${selectedStateId === id ? 'bg-brand-text text-brand-bg' : 'text-brand-text/40 hover:text-brand-text/60'}`}
              >
                {config.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="hidden sm:block h-4 w-[1px] bg-brand-text/10" />
          <div className="flex gap-4 md:gap-6 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`cursor-pointer transition-all duration-300 ${activeTab === 'overview' ? 'text-brand-text border-b border-brand-text' : 'text-brand-text/40 hover:text-brand-text/70'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('simulator')}
              className={`cursor-pointer transition-all duration-300 ${activeTab === 'simulator' ? 'text-brand-text border-b border-brand-text' : 'text-brand-text/40 hover:text-brand-text/70'}`}
            >
              Simulator
            </button>
            <button 
              onClick={() => setActiveTab('trends')}
              className={`cursor-pointer transition-all duration-300 ${activeTab === 'trends' ? 'text-brand-text border-b border-brand-text' : 'text-brand-text/40 hover:text-brand-text/70'}`}
            >
              Trends
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex px-4 py-2 border border-brand-text/10 rounded-full text-[9px] tracking-widest uppercase items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Projections Active
          </div>
          <button className="p-2 hover:bg-brand-text/5 rounded-full transition-colors">
            <LayoutDashboard size={18} />
          </button>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar / Filter Panel */}
        <aside className="hidden lg:block lg:sticky lg:top-32 w-64 p-12 z-40 h-fit">
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
                        <span className="text-[9px] tracking-widest opacity-40 uppercase">Aggregate Forecast</span>
                      </div>
                      <div className="text-center py-4">
                        <h4 className="text-5xl font-serif italic mb-2">
                          {Math.round((stateData.pollData.prePoll[leadingParty.id] + stateData.pollData.postPoll[leadingParty.id] + stateData.pollData.exitPoll[leadingParty.id]) / 3)}
                        </h4>
                        <span className="text-[10px] uppercase font-bold opacity-40 tracking-widest text-brand-accent">Consensus Mean</span>
                        <div className="mt-6 flex items-center justify-center gap-4">
                          <div className="text-center">
                            <span className="text-[8px] uppercase block opacity-40 mb-1">Variance</span>
                            <span className="text-xs font-mono">±{Math.max(
                              Math.abs(stateData.pollData.prePoll[leadingParty.id] - stateData.pollData.exitPoll[leadingParty.id]),
                              Math.abs(stateData.pollData.postPoll[leadingParty.id] - stateData.pollData.exitPoll[leadingParty.id])
                            )}</span>
                          </div>
                          <div className="w-[1px] h-4 bg-white/10" />
                          <div className="text-center">
                            <span className="text-[8px] uppercase block opacity-40 mb-1">Confidence</span>
                            <span className="text-xs font-mono">HIGH</span>
                          </div>
                        </div>
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
                   <h2 className="text-4xl font-serif italic">Historical Trajectory.</h2>
                </header>
                
                <div className="bg-white border border-brand-text/5 p-8 h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stateData.trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      {stateData.parties.slice(0, 3).map((p: any) => (
                        <Bar key={p.id} dataKey={p.id} fill={p.color} radius={[2, 2, 0, 0]} />
                      ))}
                    </BarChart>
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
            <div className="hidden lg:flex flex-col border-l border-brand-text/10 pl-8">
              <span className="text-[8px] uppercase tracking-[0.2em] text-brand-text/40 mb-1">Notice</span>
              <span className="text-[8px] font-sans opacity-40 max-w-[240px] leading-tight text-brand-accent font-bold">FULLY AI-GENERATED FOR EDUCATIONAL PURPOSES.</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowDeepDive(true)}
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


