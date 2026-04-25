import { useState } from 'react';
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

const PARTIES = [
  { id: 'dmk', name: 'DMK Alliance', color: '#EC1C24', seats: 112, voteShare: 38.5, momentum: 0 },
  { id: 'aiadmk', name: 'AIADMK Alliance', color: '#008136', seats: 64, voteShare: 29.2, momentum: 0 },
  { id: 'tvk', name: 'TVK (Vijay)', color: '#F7E017', seats: 32, voteShare: 15.8, momentum: 0 },
  { id: 'bjp', name: 'BJP', color: '#FF9933', seats: 12, voteShare: 8.5, momentum: 0 },
  { id: 'ntk', name: 'NTK', color: '#FFCC00', seats: 4, voteShare: 6.2, momentum: 0 },
  { id: 'others', name: 'Others', color: '#666666', seats: 10, voteShare: 1.8, momentum: 0 },
];

const REGIONS = [
  { id: 'all', label: 'All Regions', total: 234 },
  { id: 'kongu', label: 'Kongu / West', total: 54 },
  { id: 'chennai', label: 'Greater Chennai', total: 28 },
  { id: 'delta', label: 'Kaveri Delta', total: 32 },
  { id: 'south', label: 'Deep South', total: 60 },
  { id: 'north', label: 'Vanniyar Belt', total: 60 },
];

const TREND_DATA = [
  { date: 'Jan 26', dmk: 110, aiadmk: 60, tvk: 20 },
  { date: 'Feb 26', dmk: 115, aiadmk: 58, tvk: 25 },
  { date: 'Mar 26', dmk: 108, aiadmk: 65, tvk: 28 },
  { date: 'Apr 26', dmk: 112, aiadmk: 64, tvk: 32 },
];

const TOTAL_SEATS = 234;
const MAJORITY = 118;

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'trends'>('overview');
  const [activeRegion, setActiveRegion] = useState('all');
  const [projections, setProjections] = useState(PARTIES);
  const [showDeepDive, setShowDeepDive] = useState(false);

  const handleMomentumChange = (id: string, value: number) => {
    setProjections(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          // Simplified seat logic for simulation: momentum +/- 1.0 translates to +/- 10 seats
          const swing = Math.round(value * 10);
          const baseSeats = PARTIES.find(orig => orig.id === id)?.seats || 0;
          return { ...p, momentum: value, seats: Math.max(0, Math.min(TOTAL_SEATS, baseSeats + swing)) };
        }
        return p;
      });
      return updated;
    });
  };

  const resetSimulation = () => setProjections(PARTIES);

  const leadingParty = [...projections].sort((a, b) => b.seats - a.seats)[0];
  const activeRegionData = REGIONS.find(r => r.id === activeRegion);

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
                    For the first time since 1967, the Tamil Nadu electoral landscape is transitioning from Bipolar to Quad-polar. The emergence of TVK and the consolidation of the Third Front is squeezing the traditional vote banks of the Dravidian majors.
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
                  {REGIONS.slice(1).map(r => (
                    <div key={r.id} className="p-4 border border-brand-text/5 hover:border-brand-text/20 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium uppercase">{r.label}</span>
                        <span className="text-[10px] opacity-40">{r.total} Seats</span>
                      </div>
                      <div className="w-full h-1 bg-brand-text/5">
                        <div className="h-full bg-brand-text/20 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
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
            <span className="font-serif italic text-xl md:text-2xl tracking-tighter">TN2026.</span>
          </motion.div>
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
            {REGIONS.map((region, i) => (
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
                  <div className={`absolute left-0 top-0 h-full w-[${(region.total/234)*100}%] bg-brand-text/40`} />
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
                        Political Analysis / {REGIONS.find(r => r.id === activeRegion)?.label}
                      </span>
                      <h1 className="text-4xl md:text-6xl font-serif italic tracking-tighter leading-none">
                        Tamil Nadu <span className="opacity-40">Projections.</span>
                      </h1>
                    </div>
                    
                    <div className="flex items-center gap-8 border-l border-brand-text/10 pl-8">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-brand-text/40 block mb-1">Seats Focus</span>
                        <span className="text-2xl font-serif italic">{REGIONS.find(r => r.id === activeRegion)?.total}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-brand-text/40 block mb-1">Majority Mark</span>
                        <span className="text-2xl font-serif italic">118</span>
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
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 ${leadingParty.seats >= MAJORITY ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {leadingParty.seats >= MAJORITY ? 'Majority Confirmed' : 'Hung Assembly Possible'}
                        </span>
                      </div>
                      
                      <div className="relative h-4 bg-brand-text/5 rounded-full mb-4 overflow-hidden flex">
                        {projections.map((party) => (
                          <motion.div
                            key={party.id}
                            initial={{ width: 0 }}
                            animate={{ width: `${(party.seats / 234) * 100}%` }}
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
                          <h3 className="text-xs font-bold uppercase tracking-wider">Live Seat Projection</h3>
                        </div>
                      </div>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={projections} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #1a1a1a10', fontSize: '11px', borderRadius: '0px' }} />
                            <Bar dataKey="seats" radius={[2, 2, 0, 0]}>
                              {projections.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                    <div className="bg-brand-text text-brand-bg p-8 flex flex-col items-center">
                      <div className="w-full flex justify-between items-start mb-6">
                        <PieChart size={16} className="opacity-40" />
                        <span className="text-[9px] tracking-widest opacity-40 uppercase">Vote Share %</span>
                      </div>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie data={projections} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="voteShare">
                              {projections.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="border border-brand-text/10 p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Zap size={16} className="text-brand-accent" />
                        <h3 className="text-xs font-bold uppercase tracking-wider">Quick Insight</h3>
                      </div>
                      <p className="text-[11px] text-brand-text/60 leading-relaxed font-light italic">
                        The Western belt remains the primary battlefield where AIADMK's legacy advantage is being tested by the DMK's decentralized welfare strategy.
                      </p>
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
                    {projections.map(party => (
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
                      <span className="text-[9px] uppercase tracking-widest text-brand-text/40 block mb-2">Projected Majority</span>
                      <h4 className="text-5xl font-serif italic">{leadingParty.seats}</h4>
                      <span className="text-xs uppercase font-bold opacity-40">Seats for {leadingParty.name}</span>
                    </div>
                    <div className="h-[1px] bg-brand-text/10 w-1/2 mx-auto" />
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-brand-text/40 block mb-2">Status</span>
                      <div className="text-xl font-serif italic text-brand-text">
                        {leadingParty.seats >= MAJORITY ? 'Stable Government' : 'Coalition Required'}
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
                    <BarChart data={TREND_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="dmk" fill="#EC1C24" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="aiadmk" fill="#008136" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="tvk" fill="#F7E017" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer / Floating Interface */}
      <footer className="fixed bottom-0 left-0 w-full h-16 md:h-20 bg-brand-bg/80 backdrop-blur-md border-t border-brand-text/5 z-50 px-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-12">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-[0.2em] text-brand-text/40 mb-1">Update Pulse</span>
            <span className="text-[10px] font-serif italic">Live Feed Connected</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[8px] uppercase tracking-[0.2em] text-brand-text/40 mb-1">Methodology</span>
            <span className="text-[10px] font-serif italic">Bayesian Consensus V3</span>
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
      </footer>
    </div>
  );
}


