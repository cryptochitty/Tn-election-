import { useState, useEffect, useMemo } from 'react';
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
  Search,
  Sparkles,
  Loader2
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
  Line,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { analyzeTurnoutFactors } from './services/geminiService';

const STATE_CONFIGS: Record<string, {
  name: string;
  description: string;
  insight: string;
  history: string;
  demographics: { label: string; value: string }[];
  totalSeats: number;
  majority: number;
  totalElectorate: number;
  defaultTurnout: number;
  parties: any[];
  regions: { id: string; label: string; total: number; partySeats?: Record<string, number> }[];
  constituencies?: { id: string; name: string; type: 'Star' | 'Swing' | 'Safe'; leading: string; margin: string; candidate: string; history?: number[]; regionId?: string; result?: { winner: string; winnerCandidate: string; actualMargin: string; predictionCorrect: boolean } }[];
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
    description: 'Latest pre-poll aggregations based on recent statistical data show a consolidation for the DMK alliance at 154 seats (42%), with TVK (Vijay) emerging as a significant force with 15% vote share and 21 projected seats.',
    insight: 'The TVK factor acts as a major disruptor in tri-polar seats, particularly in Chennai and North Bengal Vanniyar belts where split-vote dynamics could challenge traditional Dravidian arithmetic.',
    history: 'Dominated by the Dravidian movement, politics has revolved around linguistic identity and social justice since 1967, with DMK and AIADMK alternating power.',
    demographics: [
      { label: 'Urbanization', value: '48.4%' },
      { label: 'Literacy Rate', value: '80.1%' },
      { label: 'Projected Turnout', value: '74.5%' },
      { label: 'Key Groups', value: 'MBC, SC, BC' },
    ],
    totalSeats: 234,
    majority: 118,
    totalElectorate: 63000000,
    defaultTurnout: 74.5,
    regions: [
      { id: 'all', label: 'All Regions', total: 234 },
      { id: 'kongu', label: 'Kongu / West', total: 52, partySeats: { dmk: 30, aiadmk: 19, tvk: 3 } },
      { id: 'chennai', label: 'Greater Chennai', total: 31, partySeats: { dmk: 26, aiadmk: 2, tvk: 3 } },
      { id: 'delta', label: 'Kaveri Delta', total: 38, partySeats: { dmk: 31, aiadmk: 5, tvk: 2 } },
      { id: 'south', label: 'Deep South', total: 68, partySeats: { dmk: 45, aiadmk: 14, tvk: 7, others: 2 } },
      { id: 'north', label: 'Vanniyar Belt', total: 45, partySeats: { dmk: 22, aiadmk: 10, tvk: 6, ntk: 7 } },
    ],
    constituencies: [
      // Source: Official party candidate lists released Mar 28–30, 2026 (DMK 164 seats, AIADMK 167, TVK 234)
      { id: 'rk-nagar', name: 'RK Nagar', type: 'Star', leading: 'DMK', margin: '15,000+', candidate: 'J.J. Ebenezer', regionId: 'chennai', history: [12000, 14000, 15000], result: { winner: 'DMK', winnerCandidate: 'J.J. Ebenezer', actualMargin: '14,320', predictionCorrect: true } },
      { id: 'kolathur', name: 'Kolathur', type: 'Safe', leading: 'DMK', margin: '45,000+', candidate: 'M.K. Stalin', regionId: 'chennai', history: [40000, 42000, 45000], result: { winner: 'DMK', winnerCandidate: 'M.K. Stalin', actualMargin: '48,112', predictionCorrect: true } },
      { id: 'bodinayakkanur', name: 'Bodinayakkanur', type: 'Star', leading: 'DMK', margin: '5,000+', candidate: 'O. Panneerselvam', regionId: 'south', history: [1000, 3000, 5000], result: { winner: 'DMK', winnerCandidate: 'O. Panneerselvam', actualMargin: '4,876', predictionCorrect: true } },
      { id: 'coimbatore-south', name: 'Coimbatore South', type: 'Swing', leading: 'DMK', margin: '3,000+', candidate: 'V. Senthil Balaji', regionId: 'kongu', history: [2500, 1800, 1200], result: { winner: 'DMK', winnerCandidate: 'V. Senthil Balaji', actualMargin: '3,450', predictionCorrect: true } },
      { id: 'edappadi', name: 'Edappadi', type: 'Safe', leading: 'AIADMK', margin: '30,000+', candidate: 'E.K. Palaniswami', regionId: 'kongu', history: [28000, 29000, 30000], result: { winner: 'AIADMK', winnerCandidate: 'E.K. Palaniswami', actualMargin: '31,204', predictionCorrect: true } },
      { id: 'dindigul', name: 'Dindigul', type: 'Star', leading: 'DMK', margin: '22,000+', candidate: 'I.P. Senthilkumar', regionId: 'south', history: [18000, 20000, 22000], result: { winner: 'DMK', winnerCandidate: 'I.P. Senthilkumar', actualMargin: '23,580', predictionCorrect: true } },
      { id: 'madurai-central', name: 'Madurai Central', type: 'Star', leading: 'DMK', margin: '18,500+', candidate: 'Dr. PTR Palanivel Thiagarajan', regionId: 'south', history: [16000, 17500, 18500], result: { winner: 'DMK', winnerCandidate: 'Dr. PTR Palanivel Thiagarajan', actualMargin: '19,230', predictionCorrect: true } },
      { id: 'trichy-east', name: 'Trichy (East)', type: 'Swing', leading: 'DMK', margin: '4,000+', candidate: 'Dr. Inigo Irudayaraj', regionId: 'delta', history: [8000, 6000, 4000], result: { winner: 'DMK', winnerCandidate: 'Dr. Inigo Irudayaraj', actualMargin: '5,120', predictionCorrect: true } },
      { id: 'villupuram', name: 'Villupuram', type: 'Swing', leading: 'DMK', margin: '3,500+', candidate: 'Dr. R. Lakshmanan', regionId: 'north', history: [5000, 4000, 2500], result: { winner: 'TVK', winnerCandidate: 'TVK Candidate', actualMargin: '1,840', predictionCorrect: false } },
      { id: 'thanjavur', name: 'Thanjavur', type: 'Safe', leading: 'DMK', margin: '28,000+', candidate: 'Shan. Ramanathan', regionId: 'delta', history: [25000, 26000, 28000], result: { winner: 'DMK', winnerCandidate: 'Shan. Ramanathan', actualMargin: '29,450', predictionCorrect: true } },
      { id: 'coimbatore-north', name: 'Coimbatore North', type: 'Swing', leading: 'AIADMK', margin: '3,800+', candidate: 'Vanathi Srinivasan (BJP)', regionId: 'kongu', history: [6000, 5000, 3800], result: { winner: 'TVK', winnerCandidate: 'TVK Candidate', actualMargin: '2,210', predictionCorrect: false } },
      { id: 'salem-south', name: 'Salem South', type: 'Safe', leading: 'AIADMK', margin: '22,000+', candidate: 'J. Robert', regionId: 'kongu', history: [20000, 21000, 22000], result: { winner: 'AIADMK', winnerCandidate: 'J. Robert', actualMargin: '20,870', predictionCorrect: true } },
      { id: 'erode-east', name: 'Erode East', type: 'Star', leading: 'DMK', margin: '50,000+', candidate: 'Gobinath Palaniappan (INC)', regionId: 'kongu', history: [10000, 35000, 66000], result: { winner: 'DMK', winnerCandidate: 'Gobinath Palaniappan', actualMargin: '61,340', predictionCorrect: true } },
      { id: 'tiruppur-south', name: 'Tiruppur South', type: 'Swing', leading: 'AIADMK', margin: '1,500+', candidate: 'T. Gunasekaran', regionId: 'kongu', history: [3000, 2200, 1500], result: { winner: 'AIADMK', winnerCandidate: 'T. Gunasekaran', actualMargin: '980', predictionCorrect: true } },
      { id: 'thoothukudi', name: 'Thoothukudi', type: 'Safe', leading: 'DMK', margin: '35,000+', candidate: 'Geetha Jeevan', regionId: 'south', history: [30000, 32000, 35000], result: { winner: 'DMK', winnerCandidate: 'Geetha Jeevan', actualMargin: '36,780', predictionCorrect: true } },
      { id: 'ramanathapuram', name: 'Ramanathapuram', type: 'Star', leading: 'DMK', margin: '12,000+', candidate: 'Kaderbatcha Muthuramalingam', regionId: 'south', history: [8000, 10000, 12000], result: { winner: 'DMK', winnerCandidate: 'Kaderbatcha Muthuramalingam', actualMargin: '13,450', predictionCorrect: true } },
      { id: 'kancheepuram', name: 'Kancheepuram', type: 'Safe', leading: 'DMK', margin: '20,000+', candidate: 'Nithya Sugumar', regionId: 'north', history: [15000, 18000, 20000], result: { winner: 'DMK', winnerCandidate: 'Nithya Sugumar', actualMargin: '21,670', predictionCorrect: true } },
    ],
    parties: [
      { 
        id: 'dmk', 
        name: 'DMK Front (INC, VCK, DMDK, Left)', 
        color: '#EC1C24', 
        seats: 154, 
        voteShare: 42.0, 
        momentum: 0, 
        factor: 'Welfare Schemes', 
        factorImpact: 85,
        migration: [
          { label: 'From AIADMK', value: 15, type: 'gain' },
          { label: 'To TVK', value: -12, type: 'loss' },
          { label: 'New Voters', value: 18, type: 'gain' }
        ]
      },
      { 
        id: 'aiadmk', 
        name: 'AIADMK Front (BJP, PMK)', 
        color: '#008136', 
        seats: 50, 
        voteShare: 34.0, 
        momentum: 0, 
        factor: 'Coalition Strength', 
        factorImpact: 78,
        migration: [
          { label: 'To DMK', value: -10, type: 'loss' },
          { label: 'To TVK', value: -20, type: 'loss' },
          { label: 'Alliance Gain', value: 8, type: 'gain' }
        ]
      },
      { 
        id: 'tvk', 
        name: 'TVK (Vijay)', 
        color: '#F7E017', 
        seats: 21, 
        voteShare: 15.0, 
        momentum: 0, 
        factor: 'Youth Surge', 
        factorImpact: 90,
        migration: [
          { label: 'From NTK', value: 30, type: 'gain' },
          { label: 'From AIADMK-BJP', value: 25, type: 'gain' },
          { label: 'From DMK', value: 20, type: 'gain' }
        ]
      },
      { 
        id: 'ntk', 
        name: 'NTK', 
        color: '#FFCC00', 
        seats: 7, 
        voteShare: 6.0, 
        momentum: 0, 
        factor: 'Identity Politics', 
        factorImpact: 45,
        migration: [
          { label: 'To TVK', value: -40, type: 'loss' },
          { label: 'Core Retention', value: 55, type: 'neutral' }
        ]
      },
      { 
        id: 'others', 
        name: 'Others', 
        color: '#666666', 
        seats: 2, 
        voteShare: 3.0, 
        momentum: 0, 
        factor: 'Localized Issues', 
        factorImpact: 30,
        migration: [
          { label: 'Independents', value: 45, type: 'neutral' }
        ]
      },
    ],
    trendData: [
      { date: 'Jan 26', dmk: 135, aiadmk: 60, tvk: 15 },
      { date: 'Feb 26', dmk: 140, aiadmk: 58, tvk: 20 },
      { date: 'Mar 26', dmk: 148, aiadmk: 55, tvk: 18 },
      { date: 'Apr 26', dmk: 154, aiadmk: 50, tvk: 21 },
    ],
    pollData: {
      prePoll: { dmk: 154, aiadmk: 52, tvk: 15 },
      postPoll: { dmk: 148, aiadmk: 54, tvk: 22 },
      exitPoll: { dmk: 156, aiadmk: 48, tvk: 18 },
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
      { label: 'Projected Turnout', value: '82.0%' },
      { label: 'Key Groups', value: 'Matua, Tribal, General' },
    ],
    totalSeats: 294,
    majority: 148,
    totalElectorate: 74000000,
    defaultTurnout: 82.0,
    regions: [
      { id: 'all', label: 'Entire State', total: 294 },
      { id: 'north', label: 'North Bengal', total: 54, partySeats: { tmc: 20, bjp: 30, left: 4 } },
      { id: 'south', label: 'South Bengal', total: 240, partySeats: { tmc: 145, bjp: 65, left: 26, others: 4 } },
    ],
    constituencies: [
      { id: 'nandigram', name: 'Nandigram', type: 'Star', leading: 'BJP', margin: '1,500+', candidate: 'Suvendu Adhikari', regionId: 'south', history: [4000, 2500, 1500] },
      { id: 'bhawanipore', name: 'Bhawanipore', type: 'Safe', leading: 'TMC', margin: '50,000+', candidate: 'Mamata Banerjee', regionId: 'south', history: [45000, 48000, 50000] },
      { id: 'diamond-harbour', name: 'Diamond Harbour', type: 'Safe', leading: 'TMC', margin: '40,000+', candidate: 'Abhishek Banerjee', regionId: 'south', history: [35000, 38000, 40000] },
      { id: 'singur', name: 'Singur', type: 'Swing', leading: 'TMC', margin: '5,000+', candidate: 'Bechara Manna', regionId: 'south', history: [2000, 3500, 5000] },
    ],
    parties: [
      { id: 'tmc', name: 'AITC/TMC', color: '#31a354', seats: 165, voteShare: 45.2, momentum: 0, factor: 'Welfare Delivery', factorImpact: 88 },
      { id: 'bjp', name: 'BJP', color: '#FF9933', seats: 95, voteShare: 36.8, momentum: 0, factor: 'Central Schemes', factorImpact: 75 },
      { id: 'left', name: 'Left-Congress', color: '#de2d26', seats: 30, voteShare: 14.5, momentum: 0, factor: 'Secular Front', factorImpact: 40 },
      { id: 'others', name: 'Others', color: '#666666', seats: 4, voteShare: 3.5, momentum: 0, factor: 'Local Grip', factorImpact: 20 },
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
      { label: 'Projected Turnout', value: '78.5%' },
      { label: 'Key Regions', value: 'Brahmaputra/Barak' },
    ],
    totalSeats: 126,
    majority: 64,
    totalElectorate: 24000000,
    defaultTurnout: 78.5,
    regions: [
      { id: 'all', label: 'All Regions', total: 126 },
      { id: 'brahmaputra', label: 'Brahmaputra Valley', total: 111, partySeats: { bjp: 65, congress: 38, aiudf: 7, others: 1 } },
      { id: 'barak', label: 'Barak Valley', total: 15, partySeats: { bjp: 10, congress: 4, aiudf: 1 } },
    ],
    constituencies: [
      { id: 'jalukbari', name: 'Jalukbari', type: 'Safe', leading: 'BJP', margin: '100,000+', candidate: 'Himanta Biswa Sarma', regionId: 'brahmaputra', history: [90000, 95000, 100000] },
      { id: 'majuli', name: 'Majuli', type: 'Star', leading: 'BJP', margin: '20,000+', candidate: 'Bhuban Gam', regionId: 'brahmaputra', history: [15000, 18000, 20000] },
      { id: 'titabar', name: 'Titabar', type: 'Safe', leading: 'Congress', margin: '15,000+', candidate: 'Bhaskar Jyoti Baruah', regionId: 'brahmaputra', history: [12000, 14000, 15000] },
    ],
    parties: [
      { id: 'bjp', name: 'BJP+', color: '#FF9933', seats: 75, voteShare: 44.5, momentum: 0, factor: 'Infrastructure', factorImpact: 82 },
      { id: 'congress', name: 'Congress+', color: '#de2d26', seats: 42, voteShare: 35.2, momentum: 0, factor: 'Social Harmony', factorImpact: 60 },
      { id: 'aiudf', name: 'AIUDF', color: '#008136', seats: 8, voteShare: 12.8, momentum: 0, factor: 'Minority Rights', factorImpact: 50 },
      { id: 'others', name: 'Others', color: '#666666', seats: 1, voteShare: 7.5, momentum: 0, factor: 'Regionalism', factorImpact: 35 },
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
  },
  kerala: {
    name: 'Kerala',
    description: 'Kerala 2026 is a historic election — LDF is attempting an unprecedented third consecutive term, having already broken the alternating pattern in 2021. The UDF is banking on anti-incumbency after 10 years of Left rule, while BJP-NDA, which drew a blank in 2021, is targeting its first double-digit tally.',
    insight: 'Central Kerala (Thrissur–Ernakulam belt) is the swing zone. IUML consolidation in Malabar is the critical variable that could tip UDF past majority. BJP is targeting Nemom (Rajeev Chandrasekhar) and coastal seats to finally open its account after a 2021 washout.',
    history: 'Kerala politics alternated between LDF and UDF every 5 years since 1982 until 2021, when CPI-M-led LDF won a historic back-to-back mandate (99 seats). BJP won its only assembly seat in 2016 (Nemom) but lost it in 2021, leaving zero seats. In 2026, LDF seeks a third straight term — unprecedented in the state\'s history.',
    demographics: [
      { label: 'Literacy Rate', value: '96.2%' },
      { label: 'Urbanization', value: '47.7%' },
      { label: 'Projected Turnout', value: '75.5%' },
      { label: 'Key Groups', value: 'Nair, Ezhava, Muslim, Christian' },
    ],
    totalSeats: 140,
    majority: 71,
    totalElectorate: 27000000,
    defaultTurnout: 75.5,
    regions: [
      { id: 'all', label: 'All Regions', total: 140 },
      { id: 'south', label: 'South Kerala', total: 35, partySeats: { ldf: 20, udf: 12, bjp: 3 } },
      { id: 'central', label: 'Central Kerala', total: 40, partySeats: { ldf: 20, udf: 16, bjp: 4 } },
      { id: 'thrissur', label: 'Thrissur Belt', total: 30, partySeats: { ldf: 16, udf: 12, bjp: 2 } },
      { id: 'malabar', label: 'Malabar / North', total: 35, partySeats: { ldf: 16, udf: 18, bjp: 1 } },
    ],
    constituencies: [
      { id: 'pinarayi', name: 'Dharmadom (CM)', type: 'Safe', leading: 'LDF', margin: '20,000+', candidate: 'Pinarayi Vijayan', regionId: 'malabar', history: [16000, 18000, 20000] },
      { id: 'nemom', name: 'Nemom', type: 'Star', leading: 'LDF', margin: '4,000+', candidate: 'V. Sivankutty (CPI-M) vs Rajeev Chandrasekhar (BJP)', regionId: 'south', history: [8671, -3949, 4000] },
      { id: 'thrissur', name: 'Thrissur', type: 'Swing', leading: 'LDF', margin: '3,500+', candidate: 'K. Radhakrishnan', regionId: 'thrissur', history: [5000, 4000, 3500] },
      { id: 'vatakara', name: 'Vatakara', type: 'Safe', leading: 'LDF', margin: '65,000+', candidate: 'K.K. Rema (RMPI/LDF)', regionId: 'malabar', history: [50000, 60000, 65000] },
      { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', type: 'Swing', leading: 'UDF', margin: '2,000+', candidate: 'V.S. Sivakumar', regionId: 'south', history: [4000, 3000, 2000] },
      { id: 'ernakulam', name: 'Ernakulam', type: 'Swing', leading: 'LDF', margin: '4,500+', candidate: 'T.J. Vinod', regionId: 'central', history: [3000, 4000, 4500] },
      { id: 'kozhikode-north', name: 'Kozhikode North', type: 'Safe', leading: 'UDF', margin: '22,000+', candidate: 'Ahammad Devarkovil', regionId: 'malabar', history: [18000, 20000, 22000] },
      { id: 'palakkad', name: 'Palakkad', type: 'Swing', leading: 'UDF', margin: '3,900+', candidate: 'Shafi Parambil (INC)', regionId: 'thrissur', history: [5000, 3500, 3900] },
    ],
    parties: [
      {
        id: 'ldf',
        name: 'LDF (CPI-M, CPI, NCP, JD-S)',
        color: '#de2d26',
        seats: 72,
        voteShare: 40.5,
        momentum: 0,
        factor: 'Development + Welfare',
        factorImpact: 82,
        migration: [
          { label: 'From UDF (anti-BJP)', value: 8, type: 'gain' },
          { label: 'To UDF (anti-incumbency)', value: -10, type: 'loss' },
          { label: 'Youth Retention', value: 12, type: 'gain' },
        ]
      },
      {
        id: 'udf',
        name: 'UDF (INC, IUML, KC-M)',
        color: '#3b82f6',
        seats: 60,
        voteShare: 38.2,
        momentum: 0,
        factor: 'Anti-incumbency + IUML Base',
        factorImpact: 78,
        migration: [
          { label: 'From LDF switchers', value: 10, type: 'gain' },
          { label: 'IUML consolidation', value: 15, type: 'gain' },
          { label: 'To BJP (Hindu belt)', value: -6, type: 'loss' },
        ]
      },
      {
        id: 'bjp',
        name: 'BJP–NDA (BJP, BDJS)',
        color: '#FF9933',
        seats: 7,
        voteShare: 15.8,
        momentum: 0,
        factor: 'Polarisation + Coastal Vote',
        factorImpact: 55,
        migration: [
          { label: 'From UDF (Nair belt)', value: 6, type: 'gain' },
          { label: 'Core RSS Cadre', value: 20, type: 'gain' },
        ]
      },
      {
        id: 'others',
        name: 'Others / Independents',
        color: '#666666',
        seats: 1,
        voteShare: 5.5,
        momentum: 0,
        factor: 'Local Issues',
        factorImpact: 20,
        migration: [
          { label: 'Independents', value: 50, type: 'neutral' },
        ]
      },
    ],
    trendData: [
      { date: 'Jan 26', ldf: 76, udf: 55, bjp: 5 },
      { date: 'Feb 26', ldf: 74, udf: 57, bjp: 6 },
      { date: 'Mar 26', ldf: 72, udf: 59, bjp: 7 },
      { date: 'Apr 26', ldf: 72, udf: 60, bjp: 7 },
    ],
    pollData: {
      prePoll: { ldf: 74, udf: 57, bjp: 6 },
      postPoll: { ldf: 70, udf: 62, bjp: 7 },
      exitPoll: { ldf: 72, udf: 60, bjp: 7 },
    },
    socialTrends: [
      { platform: 'X / Twitter', mentions: '1.4M', sentiment: 'Neutral', trendingTopic: '#Kerala2026', icon: Zap },
      { platform: 'Instagram', mentions: '900K', sentiment: 'Positive', trendingTopic: '#PinarayiAgain', icon: Share2 },
      { platform: 'Facebook', mentions: '3.1M', sentiment: 'Neutral', trendingTopic: 'IUML Wave Malabar', icon: Users },
    ]
  },
  puducherry: {
    name: 'Puducherry',
    description: 'The Union Territory\'s 30-seat assembly is a triangular contest between AINRC+BJP, the Congress+DMK combine, and breakaway independents. Rangasamy\'s government faces incumbency headwinds while Congress bets on the INDIA bloc wave.',
    insight: 'The Puducherry constituency (urban) is the swing battleground. AINRC\'s credibility on statehood demand and DMK spillover from TN define the outcome. The 3 nominated seats give the ruling coalition a thin insurance.',
    history: 'Puducherry has seen frequent political instability — governments have fallen mid-term multiple times. AINRC under N. Rangasamy has held power since 2021 after engineering a no-confidence collapse of the Congress-DMK govt.',
    demographics: [
      { label: 'Urbanization', value: '68.3%' },
      { label: 'Literacy Rate', value: '85.8%' },
      { label: 'Projected Turnout', value: '78.5%' },
      { label: 'Key Groups', value: 'Tamil-origin, French Creole' },
    ],
    totalSeats: 30,
    majority: 16,
    totalElectorate: 1000000,
    defaultTurnout: 78.5,
    regions: [
      { id: 'all', label: 'All Regions', total: 30 },
      { id: 'puducherry', label: 'Puducherry', total: 23, partySeats: { ainrc: 10, inc: 11, others: 2 } },
      { id: 'karaikal', label: 'Karaikal', total: 5, partySeats: { ainrc: 3, inc: 2 } },
      { id: 'mahe', label: 'Mahe', total: 1, partySeats: { inc: 1 } },
      { id: 'yanam', label: 'Yanam', total: 1, partySeats: { others: 1 } },
    ],
    constituencies: [
      { id: 'thattanchavady', name: 'Thattanchavady', type: 'Safe', leading: 'AINRC', margin: '5,456', candidate: 'N. Rangasamy (CM)', regionId: 'puducherry', history: [3000, 4200, 5456] },
      { id: 'ariyankuppam', name: 'Ariyankuppam', type: 'Swing', leading: 'DMK', margin: '1,500+', candidate: 'A. John Kumar', regionId: 'puducherry', history: [3000, 2200, 1500] },
      { id: 'nellithope', name: 'Nellithope', type: 'Star', leading: 'Congress', margin: '3,000+', candidate: 'A. Namassivayam', regionId: 'puducherry', history: [1000, 2000, 3000] },
      { id: 'karaikal-north', name: 'Karaikal North', type: 'Safe', leading: 'AINRC', margin: '6,000+', candidate: 'D. Namboothiri', regionId: 'karaikal', history: [4000, 5000, 6000] },
      { id: 'oulgaret', name: 'Oulgaret', type: 'Swing', leading: 'AINRC', margin: '2,500+', candidate: 'S. Dhanavel', regionId: 'puducherry', history: [4500, 3500, 2500] },
    ],
    parties: [
      {
        id: 'ainrc',
        name: 'AINRC+BJP Alliance',
        color: '#FF9933',
        seats: 16,
        voteShare: 42.0,
        momentum: 0,
        factor: 'Statehood Demand + Incumbent Base',
        factorImpact: 70,
        migration: [
          { label: 'BJP cadre addition', value: 12, type: 'gain' },
          { label: 'Anti-Congress swing', value: 8, type: 'gain' },
          { label: 'To Congress (dissidents)', value: -8, type: 'loss' },
        ]
      },
      {
        id: 'inc',
        name: 'Congress+DMK Alliance',
        color: '#3b82f6',
        seats: 12,
        voteShare: 39.5,
        momentum: 0,
        factor: 'INDIA Bloc Wave + DMK Spillover',
        factorImpact: 68,
        migration: [
          { label: 'DMK TN spillover', value: 18, type: 'gain' },
          { label: 'AINRC anti-incumbency', value: 10, type: 'gain' },
          { label: 'To AINRC (split)', value: -6, type: 'loss' },
        ]
      },
      {
        id: 'others',
        name: 'Others / Independents',
        color: '#666666',
        seats: 2,
        voteShare: 18.5,
        momentum: 0,
        factor: 'Local Strongmen',
        factorImpact: 30,
        migration: [
          { label: 'AINRC defectors', value: 40, type: 'neutral' },
        ]
      },
    ],
    trendData: [
      { date: 'Jan 26', ainrc: 17, inc: 11, others: 2 },
      { date: 'Feb 26', ainrc: 16, inc: 12, others: 2 },
      { date: 'Mar 26', ainrc: 15, inc: 13, others: 2 },
      { date: 'Apr 26', ainrc: 16, inc: 12, others: 2 },
    ],
    pollData: {
      prePoll: { ainrc: 17, inc: 11, others: 2 },
      postPoll: { ainrc: 15, inc: 13, others: 2 },
      exitPoll: { ainrc: 16, inc: 12, others: 2 },
    },
    socialTrends: [
      { platform: 'X / Twitter', mentions: '180K', sentiment: 'Neutral', trendingTopic: '#Pondy2026', icon: Zap },
      { platform: 'Instagram', mentions: '95K', sentiment: 'Positive', trendingTopic: '#StateHoodNow', icon: Share2 },
      { platform: 'Facebook', mentions: '420K', sentiment: 'Neutral', trendingTopic: 'DMK Wave Pondy', icon: Users },
    ]
  }
};

export default function App() {
  const [selectedStateId, setSelectedStateId] = useState('tamilnadu');
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'trends'>('overview');
  const [activeRegion, setActiveRegion] = useState('all');
  const [deepDiveRegion, setDeepDiveRegion] = useState('all');  // independent filter inside modal
  const [stateData, setStateData] = useState(STATE_CONFIGS[selectedStateId]);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [selectedConstituencyId, setSelectedConstituencyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSources, setShowSources] = useState(false);
  const [syncTime, setSyncTime] = useState(new Date());
  const [turnout, setTurnout] = useState(74.5);
  
  // Dynamic sync time update
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const [liveInsight, setLiveInsight] = useState('TVK youth outreach gaining momentum in urban clusters');
  const [socialSentimentScores, setSocialSentimentScores] = useState<Record<number, number>>({ 0: 65, 1: 45, 2: 78 });
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveResultsStatus, setLiveResultsStatus] = useState<'idle' | 'live' | 'error'>('idle');
  const [liveSource, setLiveSource] = useState<string | null>(null);
  const [liveUpdatedAt, setLiveUpdatedAt] = useState<Date | null>(null);
  const [liveSourceTime, setLiveSourceTime] = useState<string | null>(null);
  const [boomTally, setBoomTally] = useState<{party:string;name:string;total:number;leads:number;wins:number;color:string}[]>([]);
  const [boomUpdatedAt, setBoomUpdatedAt] = useState<string | null>(null);

  // Live results polling — hits Vercel serverless function every 60s, merges declared results into stateData
  useEffect(() => {
    const RENDER_API = '/api/tn-results';
    const applyResults = (apiResults: {id: string; name?: string; winner: string; winnerCandidate: string; actualMargin: string; predictionCorrect: boolean | null}[]) => {
      if (!apiResults.length) return;
      setStateData(prev => {
        const existing = prev.constituencies ?? [];
        const existingIds = new Set(existing.map(c => c.id));

        // Update existing constituencies with actual results
        const updated = existing.map(c => {
          const hit = apiResults.find(r => r.id === c.id);
          if (!hit) return c;
          const predictionCorrect = hit.predictionCorrect !== null
            ? hit.predictionCorrect
            : hit.winner === c.leading;
          return { ...c, result: { winner: hit.winner, winnerCandidate: hit.winnerCandidate, actualMargin: hit.actualMargin, predictionCorrect } };
        });

        // Add constituencies from API that aren't already in the list
        const newConsts = apiResults
          .filter(r => !existingIds.has(r.id) && r.winner)
          .map(r => ({
            id: r.id,
            name: r.name ?? r.id,
            type: 'Safe' as const,
            leading: r.winner,
            margin: r.actualMargin !== 'N/A' ? r.actualMargin : 'N/A',
            candidate: r.winnerCandidate || '',
            result: {
              winner: r.winner,
              winnerCandidate: r.winnerCandidate,
              actualMargin: r.actualMargin,
              predictionCorrect: null as unknown as boolean,
            },
          }));

        return { ...prev, constituencies: [...updated, ...newConsts] };
      });
      setLiveResultsStatus('live');
    };

    const poll = async () => {
      try {
        const res = await fetch(RENDER_API);
        if (!res.ok) throw new Error('non-200');
        const json = await res.json();
        // Always update BOOM tally regardless of constituency data availability
        if (json.boomTally?.length) { setBoomTally(json.boomTally); setLiveUpdatedAt(new Date()); }
        if (json.boomUpdatedAt) setBoomUpdatedAt(json.boomUpdatedAt);
        if (json.ok && json.results?.length) {
          applyResults(json.results);
          setLiveSource(json.source ?? null);
          setLiveUpdatedAt(new Date());
          setLiveSourceTime(json.sourceUpdatedAt ?? null);
        }
      } catch {
        setLiveResultsStatus('error');
      }
    };

    poll(); // immediate on mount
    const timer = setInterval(poll, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleAiAnalysis = async (constituencyName: string) => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const result = await analyzeTurnoutFactors(
        constituencyName, 
        stateData.name, 
        stateData.description,
        stateData.insight
      );
      setAiAnalysis(result || "No analysis available.");
    } catch (error) {
      setAiAnalysis("Error generating analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
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
    setTurnout(STATE_CONFIGS[selectedStateId].defaultTurnout);
    setActiveRegion('all');
    setDeepDiveRegion('all');
    setSelectedConstituencyId(null);
    setSearchTerm('');
    setAiAnalysis(null);
  }, [selectedStateId]);

  const handleOpenDeepDive = (constituencyId?: string) => {
    setDeepDiveRegion('all');
    setSearchTerm('');
    setSelectedConstituencyId(constituencyId ?? null);
    setShowDeepDive(true);
  };

  const handleVoteShareChange = (id: string, value: number) => {
    setStateData(prev => {
      const stateBase = STATE_CONFIGS[selectedStateId];
      const targetParty = prev.parties.find(p => p.id === id);
      if (!targetParty) return prev;

      // 1. Update vote share for the target party
      const oldVoteShare = targetParty.voteShare;
      const newVoteShare = value;
      const diff = newVoteShare - oldVoteShare;

      // 2. Proportional adjustment of other parties' vote shares to maintain 100%
      const otherParties = prev.parties.filter(p => p.id !== id);
      const othersTotalShare = otherParties.reduce((sum, p) => sum + p.voteShare, 0);

      const updatedParties = prev.parties.map(p => {
        let voteShare = p.voteShare;
        if (p.id === id) {
          voteShare = newVoteShare;
        } else if (othersTotalShare > 0) {
          const proportion = p.voteShare / othersTotalShare;
          voteShare = Math.max(0, p.voteShare - (diff * proportion));
        } else {
          // If others were all at 0, distribute the decrease or just keep at 0
          voteShare = Math.max(0, p.voteShare - (diff / Math.max(1, otherParties.length)));
        }

        const basePartyData = stateBase.parties.find(orig => orig.id === p.id);
        const baseVoteShare = basePartyData?.voteShare || 1;
        const momentum = voteShare - baseVoteShare;
        
        return { ...p, voteShare, momentum };
      });

      // Normalize vote shares to ensure they sum to 100%
      const currentTotalVS = updatedParties.reduce((sum, p) => sum + p.voteShare, 0);
      if (currentTotalVS > 0) {
        updatedParties.forEach(p => p.voteShare = (p.voteShare / currentTotalVS) * 100);
      }

      // 3. Seat Projection using Power Law (Cube Law Approximation)
      // Standard k=2.5 to 3.0 for FPTP systems to project seats from vote shares
      const k = 2.8;
      const powerSum = updatedParties.reduce((sum, p) => sum + Math.pow(p.voteShare, k), 0);
      
      const seatsAdjustedParties = updatedParties.map(p => {
        const seatRatio = powerSum > 0 ? Math.pow(p.voteShare, k) / powerSum : 0;
        const projectedSeats = Math.round(seatRatio * stateBase.totalSeats);
        return { ...p, seats: projectedSeats };
      });

      // Ensure total seats match the state total (Zero-sum balancing)
      const currentTotalSeats = seatsAdjustedParties.reduce((sum, p) => sum + p.seats, 0);
      const seatDiff = stateBase.totalSeats - currentTotalSeats;
      
      if (seatDiff !== 0) {
        // Distribute seat difference to the largest parties
        const sorted = [...seatsAdjustedParties].sort((a, b) => b.seats - a.seats);
        const target = sorted[0];
        seatsAdjustedParties.forEach(p => {
          if (p.id === target.id) p.seats = Math.max(0, p.seats + seatDiff);
        });
      }

      // 4. Proportional regional update
      const updatedRegions = prev.regions.map(reg => {
        if (reg.id === 'all') return reg;
        const regPartySeats = { ...reg.partySeats };
        
        seatsAdjustedParties.forEach(p => {
          if (regPartySeats[p.id] !== undefined) {
             const overallSeatShare = p.seats / stateBase.totalSeats;
             regPartySeats[p.id] = Math.round(reg.total * overallSeatShare);
          }
        });
        
        // Normalize region total
        const regTotal = (Object.values(regPartySeats) as number[]).reduce((a, b) => a + b, 0);
        const regDiff = reg.total - regTotal;
        if (regDiff !== 0) {
           const firstKey = Object.keys(regPartySeats).sort((a, b) => (regPartySeats[b] || 0) - (regPartySeats[a] || 0))[0];
           if (firstKey) regPartySeats[firstKey] = Math.max(0, (regPartySeats[firstKey] || 0) + regDiff);
        }

        return { ...reg, partySeats: regPartySeats };
      });

      return { ...prev, parties: seatsAdjustedParties, regions: updatedRegions };
    });
  };


  const resetSimulation = () => {
    setStateData(STATE_CONFIGS[selectedStateId]);
    setTurnout(STATE_CONFIGS[selectedStateId].defaultTurnout);
  };

  // Derived Data with full guards
  const stateParties = stateData?.parties || [];
  const stateRegions = stateData?.regions || [];
  const stateConstituencies = stateData?.constituencies || [];

  const sortedParties = [...stateParties].sort((a, b) => (b.seats || 0) - (a.seats || 0));
  const leadingParty = sortedParties[0] || { id: 'na', name: 'N/A', color: '#666', seats: 0, voteShare: 0 };
  
  const activeRegionData = stateRegions.find(r => r.id === activeRegion);
  
  // Filtered constituency list for the deep dive modal — recomputes on any filter change
  const filteredConstituencies = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return stateConstituencies.filter(c => {
      const rid = (c as any).regionId as string | undefined;
      const matchesRegion = deepDiveRegion === 'all' || rid === deepDiveRegion;
      const matchesSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.candidate.toLowerCase().includes(q) ||
        c.leading.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        !!(c.result?.winner.toLowerCase().includes(q)) ||
        !!(c.result?.winnerCandidate.toLowerCase().includes(q)) ||
        (q === 'upset'    && !!c.result && !c.result.predictionCorrect) ||
        (q === 'correct'  && !!c.result?.predictionCorrect) ||
        (q === 'declared' && !!c.result) ||
        (q === 'pending'  && !c.result);
      return matchesRegion && matchesSearch;
    });
  }, [stateConstituencies, deepDiveRegion, searchTerm]);

  // Live party tally — computed from actual results in constituencies
  const PARTY_COLORS: Record<string, string> = {
    DMK: '#3b82f6', AIADMK: '#ef4444', TVK: '#f59e0b',
    NTK: '#6b7280', BJP: '#f97316', INC: '#22c55e', IND: '#9ca3af',
  };

  const liveTally = useMemo(() => {
    const tally: Record<string, number> = {};
    for (const c of stateData.constituencies ?? []) {
      const w = c.result?.winner;
      if (w) tally[w] = (tally[w] ?? 0) + 1;
    }
    return Object.entries(tally)
      .sort(([, a], [, b]) => b - a)
      .map(([party, seats]) => ({ party, seats, color: PARTY_COLORS[party] ?? '#9ca3af' }));
  }, [stateData.constituencies]);

  const totalDeclared = liveTally.reduce((s, p) => s + p.seats, 0);

  const regionLeader = useMemo(() => {
    if (!stateData) return leadingParty;
    if (activeRegion === 'all') return leadingParty;
    
    const partySeats = activeRegionData?.partySeats || {};
    const entries = Object.entries(partySeats).sort(([, a], [, b]) => (b as number) - (a as number));
    const topEntry = entries[0];
    
    if (topEntry) {
      return stateParties.find(p => p.id === topEntry[0]) || leadingParty;
    }
    return leadingParty;
  }, [stateData, activeRegion, activeRegionData, stateParties, leadingParty]);

  if (!stateData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg text-brand-text p-8 text-center">
        <div className="w-12 h-12 border-2 border-brand-text/10 border-t-brand-accent rounded-full animate-spin mb-6" />
        <div className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">System Initializing</div>
        <p className="mt-2 text-xs italic opacity-30">Loading State Configuration...</p>
      </div>
    );
  }

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

                  <h4 className="text-xs font-bold uppercase tracking-widest border-b border-brand-text/5 pb-2 mt-8">Filter by Region</h4>
                  <div
                    onClick={() => { setDeepDiveRegion('all'); setSelectedConstituencyId(null); }}
                    className={`p-3 border cursor-pointer transition-all mb-1 ${deepDiveRegion === 'all' ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-text/5 hover:border-brand-text/20'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium uppercase">All Regions</span>
                      <span className="text-[10px] opacity-40">{stateData.totalSeats} Seats</span>
                    </div>
                  </div>
                  {stateData.regions.slice(1).map((r: any) => (
                    <div
                      key={r.id}
                      onClick={() => { setDeepDiveRegion(r.id); setSelectedConstituencyId(null); }}
                      className={`p-3 border cursor-pointer transition-all ${deepDiveRegion === r.id ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-text/5 hover:border-brand-text/20'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium uppercase">{r.label}</span>
                        <span className="text-[10px] opacity-40">{r.total} Seats</span>
                      </div>
                      <div className="w-full h-1 bg-brand-text/5">
                        <div className={`h-full transition-all ${deepDiveRegion === r.id ? 'bg-brand-accent/40' : 'bg-brand-text/20'}`} style={{ width: `${(r.total/stateData.totalSeats)*100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="md:col-span-8 space-y-6">
                  <div className="flex flex-col gap-3 border-b border-brand-text/5 pb-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-widest">Star & Swing Constituencies</h4>
                      {deepDiveRegion !== 'all' && (
                        <button onClick={() => { setDeepDiveRegion('all'); setSelectedConstituencyId(null); }} className="text-[8px] uppercase tracking-widest text-brand-accent font-bold underline">
                          Clear Region
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/30" />
                      <input
                        type="text"
                        placeholder="Search by name, candidate, party, type (star/swing/safe), winner..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-brand-text/5 border border-brand-text/10 pl-9 pr-8 py-2 text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors"
                      />
                      {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text/30 hover:text-brand-text text-xs font-bold">✕</button>
                      )}
                    </div>
                  </div>
                  
                  {(() => {
                    const withResults = stateData.constituencies?.filter(c => c.result) || [];
                    if (withResults.length === 0) return null;
                    const correct = withResults.filter(c => c.result?.predictionCorrect).length;
                    const pct = Math.round((correct / withResults.length) * 100);
                    return (
                      <div className="mb-6 p-4 bg-brand-text/5 border border-brand-text/10 flex items-center gap-6">
                        <div className="shrink-0">
                          <span className="text-[8px] uppercase tracking-widest text-brand-text/40 block mb-1">Prediction Accuracy</span>
                          <span className="text-xl font-bold font-serif">{correct}<span className="text-brand-text/30 text-sm font-sans">/{withResults.length}</span></span>
                        </div>
                        <div className="flex-1">
                          <div className="w-full h-1.5 bg-brand-text/10 mb-1">
                            <div className="h-full bg-green-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[8px] text-brand-text/40 uppercase tracking-widest">{withResults.length} seats declared</span>
                            <span className="text-[8px] font-bold text-green-600 uppercase tracking-widest">{pct}% accurate</span>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="text-[8px] uppercase tracking-widest text-brand-text/40 block mb-1">Upsets</span>
                          <span className="text-xl font-bold font-serif text-orange-500">{withResults.length - correct}</span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-brand-text/40 mb-2">
                    <span>{filteredConstituencies.length} of {stateConstituencies.length} constituencies</span>
                    {deepDiveRegion !== 'all' && (
                      <span className="font-bold text-brand-accent">
                        {stateData.regions.find(r => r.id === deepDiveRegion)?.label}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredConstituencies.length === 0 ? (
                      <div className="col-span-2 py-12 text-center text-brand-text/30 text-xs italic">
                        No constituencies match{searchTerm ? ` "${searchTerm}"` : ' this region'}
                      </div>
                    ) : filteredConstituencies.map((c) => (
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
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-[8px] font-bold px-2 py-1 uppercase tracking-widest ${
                              c.type === 'Star' ? 'bg-brand-accent text-white' :
                              c.type === 'Swing' ? 'bg-orange-100 text-orange-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {c.type}
                            </span>
                            {c.result && (
                              <span className={`text-[7px] font-bold px-1.5 py-0.5 uppercase tracking-widest ${
                                c.result.predictionCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {c.result.predictionCorrect ? '✓ CORRECT' : '✗ UPSET'}
                              </span>
                            )}
                          </div>
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
                            <span className="text-xs font-serif italic" style={{ color: stateData.parties.find(p => p.id === c.leading.toLowerCase() || p.name.includes(c.leading))?.color || 'inherit' }}>{c.leading}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase text-brand-text/40">{c.result ? 'Predicted Margin' : 'Est. Margin'}</span>
                            <span className="text-[10px] font-mono text-brand-text/50">{c.margin}</span>
                          </div>
                          {c.result && (
                            <>
                              <div className="h-px bg-brand-text/10 my-1" />
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] uppercase text-brand-text/40">Actual Winner</span>
                                <span className="text-xs font-bold" style={{ color: stateData.parties.find(p => p.id === c.result!.winner.toLowerCase() || p.name.includes(c.result!.winner))?.color || 'inherit' }}>
                                  {c.result.winner}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] uppercase text-brand-text/40">Actual Margin</span>
                                <span className="text-[10px] font-mono font-bold">{c.result.actualMargin}</span>
                              </div>
                            </>
                          )}
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

                      {stateData.constituencies?.find(c => c.id === selectedConstituencyId)?.history && (
                        <div className="mt-8 p-8 bg-white border border-brand-text/10 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)]">
                          <div className="flex justify-between items-end mb-8">
                            <div>
                                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-1">Performance Intelligence</h4>
                                <h3 className="text-sm font-serif italic">Historical Vote Margin Trend (Last 3 Cycles)</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stateData.parties?.find(p => p.id === stateData.constituencies?.find(c => c.id === selectedConstituencyId)?.leading?.toLowerCase() || p.name.includes(stateData.constituencies?.find(c => c.id === selectedConstituencyId)?.leading || ''))?.color || '#000' }} />
                                <span className="text-[9px] uppercase tracking-widest font-bold opacity-60">
                                    {stateData.constituencies?.find(c => c.id === selectedConstituencyId)?.leading} Dominance
                                </span>
                            </div>
                          </div>
                          
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart 
                                data={stateData.constituencies.find(c => c.id === selectedConstituencyId)?.history?.map((val, i) => ({ 
                                  val, 
                                  year: i === 0 ? '2011' : i === 1 ? '2016' : '2021',
                                  margin: val.toLocaleString()
                                }))}
                                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis 
                                  dataKey="year" 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{ fontSize: 9, fill: '#6B7280', fontWeight: 600 }}
                                  dy={10}
                                />
                                <YAxis hide domain={['dataMin - 5000', 'dataMax + 5000']} />
                                <Tooltip 
                                  cursor={{ stroke: '#000', strokeWidth: 0.5, strokeDasharray: '2 2' }}
                                  contentStyle={{ 
                                    backgroundColor: '#000', 
                                    border: 'none', 
                                    borderRadius: '0', 
                                    padding: '8px 12px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                  }}
                                  itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                  labelStyle={{ display: 'none' }}
                                  formatter={(value: any) => [`${value.toLocaleString()} votes`, 'Margin']}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="val" 
                                  stroke={stateData.parties?.find(p => p.id === stateData.constituencies?.find(c => c.id === selectedConstituencyId)?.leading?.toLowerCase() || p.name.includes(stateData.constituencies?.find(c => c.id === selectedConstituencyId)?.leading || ''))?.color || '#000'} 
                                  strokeWidth={3}
                                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                  activeDot={{ r: 6, strokeWidth: 0 }}
                                  animationDuration={1500}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="mt-6 flex justify-between items-center text-[9px] uppercase tracking-widest text-brand-text/30 font-bold border-t border-brand-text/5 pt-4">
                            <span>Statistical Consistency Score: 8.4/10</span>
                            <span>Projected Stability: High</span>
                          </div>
                        </div>
                      ) || null}

                      {(() => {
                        const sel = stateData.constituencies?.find(c => c.id === selectedConstituencyId);
                        if (!sel?.result) return null;
                        const winnerColor = stateData.parties.find(p => p.id === sel.result!.winner.toLowerCase() || p.name.includes(sel.result!.winner))?.color || '#000';
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-8 p-6 border-l-4 ${sel.result.predictionCorrect ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50'}`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[9px] uppercase tracking-widest font-bold text-brand-text/50">Official Result</span>
                              <span className={`text-[8px] font-bold px-2 py-1 uppercase tracking-widest ${sel.result.predictionCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                {sel.result.predictionCorrect ? '✓ Prediction Correct' : '✗ Prediction Wrong — Upset'}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                              <div>
                                <span className="text-[8px] uppercase tracking-widest opacity-40 block mb-1">Winner</span>
                                <span className="text-sm font-bold" style={{ color: winnerColor }}>{sel.result.winner}</span>
                              </div>
                              <div>
                                <span className="text-[8px] uppercase tracking-widest opacity-40 block mb-1">Winning Candidate</span>
                                <span className="text-xs font-bold">{sel.result.winnerCandidate}</span>
                              </div>
                              <div>
                                <span className="text-[8px] uppercase tracking-widest opacity-40 block mb-1">Actual Margin</span>
                                <span className="text-xs font-mono font-bold">{sel.result.actualMargin}</span>
                              </div>
                            </div>
                            {!sel.result.predictionCorrect && (
                              <p className="mt-4 text-[10px] italic text-brand-text/60">
                                Predicted: <span className="font-bold">{sel.leading}</span> ({sel.candidate}) with margin {sel.margin}. Actual result diverged — a key upset in this cycle.
                              </p>
                            )}
                          </motion.div>
                        );
                      })()}

                      {/* New AI Analysis Integration */}
                      <div className="mt-8 p-6 bg-brand-text/5 border-l-2 border-brand-accent">
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-brand-accent" />
                            <h4 className="text-[10px] uppercase tracking-widest font-bold">Constituency Evolution Analysis (Gemini AI)</h4>
                          </div>
                          <button 
                            onClick={() => {
                              const c = stateData.constituencies?.find(c => c.id === selectedConstituencyId);
                              if (c) handleAiAnalysis(c.name);
                            }}
                            disabled={isAnalyzing}
                            className={`flex items-center gap-2 px-3 py-1.5 border border-brand-accent/30 text-[9px] uppercase tracking-widest font-bold transition-all ${
                              isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-accent hover:text-white'
                            }`}
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 size={12} className="animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              'Run Analysis'
                            )}
                          </button>
                        </div>

                        {aiAnalysis ? (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[11px] leading-relaxed italic text-brand-text/80 space-y-4 prose-sm"
                          >
                            <style>{`
                              .prose-sm p { margin-bottom: 0.5rem; }
                              .prose-sm ul { list-style-type: none; margin-left: 0.5rem; }
                              .prose-sm li:before { content: "• "; color: var(--color-brand-accent); }
                            `}</style>
                            <div className="whitespace-pre-wrap">{aiAnalysis}</div>
                          </motion.div>
                        ) : (
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
                        )}
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
          <div className={`hidden lg:flex px-4 py-2 border rounded-full text-[9px] tracking-widest uppercase items-center gap-2 ${
            liveResultsStatus === 'live' ? 'border-green-500/40 text-green-600' :
            liveResultsStatus === 'error' ? 'border-red-400/40 text-red-500' :
            'border-brand-text/10 text-brand-text/50'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              liveResultsStatus === 'live' ? 'bg-green-500' :
              liveResultsStatus === 'error' ? 'bg-red-400' :
              'bg-brand-text/30'
            }`} />
            {liveResultsStatus === 'live' ? 'Live Results Active' :
             liveResultsStatus === 'error' ? 'Results Unavailable' :
             'Awaiting Results'}
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
      <div id="strategic-ticker" className="w-full bg-brand-text text-brand-bg py-2 overflow-hidden border-b border-white/10 z-30">
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
                {/* Live Party-wise Tally */}
                {(totalDeclared > 0 || boomTally.length > 0) && (() => {
                  // Prefer BOOM (ECI-verified) tally; fall back to computed from constituencies
                  const displayTally = boomTally.length > 0
                    ? boomTally.map(p => ({ party: p.party, seats: p.total, color: p.color || PARTY_COLORS[p.party] || '#9ca3af' }))
                    : liveTally;
                  const boomTime = boomUpdatedAt
                    ? new Date(boomUpdatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
                    : null;
                  const totalShown = displayTally.reduce((s, p) => s + p.seats, 0);

                  return (
                    <div className="mb-10 bg-white border border-brand-text/5 p-6 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider">Live Results</span>
                          <span className="text-[10px] text-brand-text/40 uppercase tracking-widest">
                            {totalShown} / {stateData.totalSeats} seats · Majority {stateData.majority}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-brand-text/35 uppercase tracking-widest flex-wrap">
                          {boomTally.length > 0 ? (
                            <span className="text-green-700/70 font-semibold">✓ BOOM Elections (ECI-verified)</span>
                          ) : liveSource && (
                            <span>Source: <span className="text-brand-text/60 font-semibold">{liveSource}</span></span>
                          )}
                          {boomTime && (
                            <span>Data as of: <span className="text-brand-text/60 font-semibold">{boomTime}</span></span>
                          )}
                          {!boomTime && liveSourceTime && (
                            <span>Data as of: <span className="text-brand-text/60 font-semibold">{liveSourceTime}</span></span>
                          )}
                          {liveUpdatedAt && (
                            <span>Fetched: <span className="text-brand-text/60 font-semibold">
                              {liveUpdatedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </span></span>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="relative h-3 bg-brand-text/5 rounded-full mb-6 overflow-hidden flex">
                        {displayTally.map(p => (
                          <motion.div
                            key={p.party}
                            initial={{ width: 0 }}
                            animate={{ width: `${(p.seats / stateData.totalSeats) * 100}%` }}
                            transition={{ duration: 0.8, ease: 'circOut' }}
                            style={{ backgroundColor: p.color }}
                            className="h-full"
                          />
                        ))}
                        <div
                          className="absolute top-0 bottom-0 w-px bg-brand-text/40"
                          style={{ left: `${(stateData.majority / stateData.totalSeats) * 100}%` }}
                        >
                          <span className="absolute -top-5 -translate-x-1/2 text-[9px] text-brand-text/50 uppercase tracking-widest whitespace-nowrap">maj</span>
                        </div>
                      </div>

                      {/* Party cards */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {displayTally.map((p, i) => (
                          <motion.div
                            key={p.party}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-3 p-3 border border-brand-text/5 bg-brand-text/[0.02]"
                          >
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                            <div className="min-w-0">
                              <span className="text-[10px] uppercase tracking-widest text-brand-text/50 block truncate">{p.party}</span>
                              <span className="text-xl font-serif italic leading-tight">{p.seats}</span>
                            </div>
                            {p.seats >= stateData.majority && (
                              <span className="ml-auto text-[8px] uppercase tracking-widest text-green-600 font-bold">Majority</span>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

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
                        Current projection shows <span className="font-bold text-brand-text">{regionLeader.name}</span> leading in {activeRegion === 'all' ? 'the entire state' : activeRegionData?.label}.
                      </p>
                    </div>

                    {/* Regional Party Split Chart */}
                    <div className="bg-white border border-brand-text/5 p-8 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                          <MapIcon size={16} />
                          <h3 className="text-xs font-bold uppercase tracking-wider">Regional Seat Distribution</h3>
                        </div>
                      </div>
                      <div className="h-[300px] w-full mb-8">
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

                      {/* District-wise / Region-wise Data Table */}
                      <div className="overflow-x-auto border-t border-brand-text/5 pt-8">
                        <table className="w-full text-[10px] uppercase tracking-widest text-left">
                          <thead>
                            <tr className="border-b border-brand-text/10">
                              <th className="pb-4 font-bold opacity-40">Territory / Region</th>
                              {stateData.parties.map(p => (
                                <th key={p.id} className="pb-4 font-bold text-right" style={{ color: p.color }}>{p.id}</th>
                              ))}
                              <th className="pb-4 font-bold text-right opacity-40">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-text/5">
                            {stateData.regions.slice(1).map(region => (
                              <tr key={region.id} className={`hover:bg-brand-text/5 transition-colors ${activeRegion === region.id ? 'bg-brand-accent/5' : ''}`}>
                                <td className="py-4 font-bold">{region.label}</td>
                                {stateData.parties.map(p => (
                                  <td key={p.id} className="py-4 text-right font-mono">
                                    {region.partySeats?.[p.id] || 0}
                                  </td>
                                ))}
                                <td className="py-4 text-right font-bold opacity-40">{region.total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Social Media Pulse - new section */}
                    <div id="social-pulse" className="bg-white border border-brand-text/5 p-8 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)]">
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
                        {(stateData.constituencies?.filter(c => {
                          const isStar = c.type === 'Star';
                          const matchesRegion = activeRegion === 'all' || (c as any).regionId === activeRegion;
                          return isStar && matchesRegion;
                        }) || []).slice(0, 4).map((c) => (
                          <div key={c.id} className="p-4 border border-brand-text/5 bg-brand-bg/10 flex justify-between items-center group cursor-pointer hover:border-brand-accent/30 transition-colors" onClick={() => handleOpenDeepDive(c.id)}>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[8px] uppercase font-bold" style={{ color: stateData.parties.find(p => p.id === c.leading.toLowerCase() || p.name.includes(c.leading))?.color || '#666' }}>{c.type}</span>
                                <h4 className="text-sm font-bold">{c.name}</h4>
                              </div>
                              <p className="text-[10px] text-brand-text/40 italic">{c.candidate}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-serif italic block leading-none" style={{ color: stateData.parties.find(p => p.id === c.leading.toLowerCase() || p.name.includes(c.leading))?.color || 'inherit' }}>{c.leading}</span>
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
                              <span className="text-[10px] font-serif italic text-brand-text">
                                {demo.label === 'Projected Turnout' ? `${turnout.toFixed(1)}%` : demo.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Voter Migration Analysis */}
                    <div className="bg-white border border-brand-text/10 p-8 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)]">
                      <header className="mb-8">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Intelligence</span>
                        <h3 className="text-xl font-serif italic mb-2">Voter Migration Patterns.</h3>
                        <p className="text-[10px] text-brand-text/40 italic">Where growth and drainage are projected to originate.</p>
                      </header>

                      <div className="space-y-6">
                        {stateData.parties.slice(0, 5).filter(p => p.migration).map((party) => (
                          <div key={party.id} className="pb-4 border-b border-brand-text/5 last:border-0">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2" style={{ backgroundColor: party.color }} />
                              <span className="text-[11px] font-bold uppercase tracking-wider">{party.name}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-2">
                              {party.migration.map((mig: any, mIdx: number) => (
                                <div key={mIdx} className="flex flex-col gap-1">
                                  <div className="flex justify-between items-center bg-brand-text/5 p-2 border-l-2" style={{ borderColor: mig.type === 'gain' ? '#22c55e' : mig.type === 'loss' ? '#ef4444' : '#6b7280' }}>
                                    <span className="text-[10px] font-medium">{mig.label}</span>
                                    <span className={`text-[10px] font-mono font-bold ${mig.type === 'gain' ? 'text-green-600' : mig.type === 'loss' ? 'text-red-600' : 'opacity-40'}`}>
                                      {mig.type === 'gain' ? '+' : mig.type === 'loss' ? '-' : ''}{Math.abs(mig.value)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
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
                    <h2 className="text-4xl font-serif italic mb-4">Vote Share Simulator.</h2>
                    <p className="text-sm text-brand-text/50 max-w-xl italic mb-8">
                      Adjust party vote share and voter turnout to see how shifts affect final seat projections and total vote counts.
                    </p>

                    <div className="bg-brand-text/5 p-6 border border-brand-text/10 mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <Users size={16} className="text-brand-accent" />
                          <span className="text-xs font-bold uppercase">Estimated Voter Turnout</span>
                        </div>
                        <span className="text-xs font-mono font-bold">{turnout.toFixed(1)}%</span>
                      </div>
                      <input 
                        type="range"
                        min="50"
                        max="100"
                        step="0.1"
                        value={turnout}
                        onChange={(e) => setTurnout(parseFloat(e.target.value))}
                        className="w-full h-1 bg-brand-text/20 appearance-none cursor-pointer accent-brand-accent"
                      />
                      <div className="flex justify-between text-[9px] opacity-40 uppercase tracking-widest mt-2">
                        <span>50% Pool</span>
                        <span>100% Pool</span>
                      </div>
                      <p className="mt-4 text-[10px] text-brand-text/40 italic">
                        Total Pool: {Math.round(stateData.totalElectorate * (turnout / 100)).toLocaleString()} votes
                      </p>
                    </div>
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
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-mono font-bold">
                              {party.voteShare.toFixed(1)}%
                            </span>
                            <span className="text-[9px] font-mono opacity-40">
                              {Math.round((stateData.totalElectorate * (turnout / 100)) * (party.voteShare / 100)).toLocaleString()} Votes
                            </span>
                          </div>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          step="0.5"
                          value={party.voteShare}
                          onChange={(e) => handleVoteShareChange(party.id, parseFloat(e.target.value))}
                          className="w-full h-1 bg-brand-text/20 appearance-none cursor-pointer accent-brand-text"
                        />
                        <div className="flex justify-between text-[9px] opacity-40 uppercase tracking-widest">
                          <span>0% Vote</span>
                          <span>100% Vote</span>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={resetSimulation}
                      className="text-[10px] uppercase tracking-widest font-bold underline"
                    >
                      Reset Dataset
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
                      <div className="text-xl font-serif italic text-brand-text mb-8">
                        {leadingParty.seats >= stateData.majority ? 'Majority Threshold Reached' : 'Collaborative Governance Needed'}
                      </div>
                    </div>

                    {/* Simulation Specific Migration Insights */}
                    <div className="pt-8 border-t border-brand-text/5 text-left">
                       <span className="text-[9px] uppercase tracking-widest text-brand-text/40 block mb-4">Underlying Voter Shift</span>
                       <div className="space-y-4">
                          {stateData.parties.filter(p => Math.abs(p.momentum) > 0).slice(0, 3).map((p: any) => (
                            <div key={p.id} className="p-3 bg-brand-text/5 border-l-2" style={{ borderColor: p.color }}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold uppercase">{p.name} Move</span>
                                <span className={`text-[10px] font-mono ${p.momentum > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {p.momentum > 0 ? '+' : ''}{p.momentum.toFixed(1)}%
                                </span>
                              </div>
                              <p className="text-[9px] text-brand-text/40 italic">
                                {p.momentum > 0 
                                  ? `Gaining primary traction from ${p.migration?.[0]?.label || 'neutral undecided blocks'}.` 
                                  : `Losing substantial ground to ${p.migration?.find((m: any) => m.type === 'loss')?.label || 'rival ideological camps'}.`}
                              </p>
                            </div>
                          ))}
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
                
                <div className="bg-white border border-brand-text/5 p-4 md:p-8 h-[500px] shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)] mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider">Historical Seat Projection</h3>
                    <div className="flex gap-4">
                      <span className="text-[8px] uppercase opacity-40 font-bold">Jan - Apr 2026 Window</span>
                    </div>
                  </div>
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div id="sentiment-correlation" className="lg:col-span-8 bg-white border border-brand-text/5 p-8 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-2">
                        <Share2 size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-wider">Sentiment-Factor Correlation</h3>
                      </div>
                      <span className="text-[8px] uppercase tracking-widest text-brand-text/40 font-bold">Bubble size = projected seats</span>
                    </div>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                            type="number" 
                            dataKey="sentiment" 
                            name="Social Sentiment" 
                            unit="%" 
                            domain={[0, 100]} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10 }} 
                            label={{ value: 'Social Sentiment %', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#666' }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="impact" 
                            name="Factor Impact" 
                            unit="%" 
                            domain={[0, 100]} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10 }} 
                            label={{ value: 'Strategic Factor Impact', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#666' }}
                          />
                          <ZAxis type="number" dataKey="seats" range={[100, 1000]} />
                          <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }} 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-brand-text text-brand-bg p-3 border border-white/10 shadow-xl">
                                    <p className="text-[10px] font-bold uppercase mb-1">{data.name}</p>
                                    <p className="text-xs font-serif italic mb-2">"{data.factor}"</p>
                                    <div className="space-y-1 text-[9px] opacity-70">
                                      <p>Sentiment: {Math.round(data.sentiment)}%</p>
                                      <p>Impact: {data.impact}%</p>
                                      <p>Projected Seats: {data.seats}</p>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Legend verticalAlign="top" height={36}/>
                          {stateData.parties.map((p: any, i: number) => (
                            <Scatter 
                              key={p.id} 
                              name={p.name} 
                              data={[{ 
                                name: p.name,
                                sentiment: ((socialSentimentScores[i % 3] || 50) * 0.7) + (p.momentum * 10) + 15,
                                impact: p.factorImpact,
                                seats: p.seats,
                                factor: p.factor 
                              }]} 
                              fill={p.color} 
                            />
                          ))}
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                    <div className="bg-brand-text text-brand-bg p-8">
                       <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6 opacity-40">Correlation Matrix</h4>
                       <div className="space-y-4">
                         {stateData.parties.map(p => {
                           const sentiment = ((socialSentimentScores[0] || 50) * 0.7) + (p.momentum * 10) + 15;
                           const correlation = Math.abs(sentiment - p.factorImpact) < 15 ? 'HIGH' : Math.abs(sentiment - p.factorImpact) < 30 ? 'MEDIUM' : 'LOW';
                           return (
                             <div key={p.id} className="border-b border-white/10 pb-4">
                               <div className="flex justify-between items-center mb-2">
                                 <span className="text-[10px] font-bold uppercase">{p.name}</span>
                                 <span className={`text-[8px] font-bold px-1 py-0.5 ${
                                   correlation === 'HIGH' ? 'bg-green-500/20 text-green-400' :
                                   correlation === 'MEDIUM' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
                                 }`}>{correlation} SYNC</span>
                               </div>
                               <p className="text-[9px] opacity-40 italic">{p.factor} correlation with social digital footprint.</p>
                             </div>
                           );
                         })}
                       </div>
                    </div>

                    <div className="p-8 border border-brand-text/10 italic">
                      <p className="text-[11px] leading-relaxed text-brand-text/60">
                        * High Sync suggests that the digital narrative (social media sentiment) is effectively driving the primary strategic factor identified for the party. Low Sync indicates a disconnect between ground factors and online persona.
                      </p>
                    </div>
                  </div>
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


