import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, DollarSign, Shield, Users } from "lucide-react";
import DetectionChart from "@/components/charts/detection-chart";
import RiskChart from "@/components/charts/risk-chart";

export default function Trends() {
  const { data: analytics } = useQuery<{
    totalAnalyses: number;
    scamsDetected: number;
    usersProtected: number;
    accuracy: number;
  }>({
    queryKey: ["/api/analytics"],
  });

  const { data: trends } = useQuery({
    queryKey: ["/api/trends"],
  });

  // Mock data for demonstration - replace with real data
  const weeklyScams = 342;
  const topRiskCategory = "Payment Scams";
  const accuracy = analytics?.accuracy || 96.7;
  const activeReports = 127;

  const topKeywords = [
    { phrase: "No experience required", detections: 2847 },
    { phrase: "Earn $5000/week", detections: 2341 },
    { phrase: "Pay for training", detections: 1956 },
    { phrase: "WhatsApp interview", detections: 1742 },
  ];

  const emergingThreats = [
    { threat: "Crypto investment opportunity", change: 45 },
    { threat: "Remote data mining", change: 38 },
    { threat: "AI training tasks", change: 32 },
    { threat: "NFT marketing roles", change: 28 },
  ];

  const geographicRisks = [
    { region: "Southeast Asia", level: "High Risk", percentage: 34, color: "text-red-400" },
    { region: "Eastern Europe", level: "Medium Risk", percentage: 28, color: "text-orange-400" },
    { region: "North America", level: "Low Risk", percentage: 12, color: "text-amber-400" },
    { region: "Western Europe", level: "Very Low", percentage: 8, color: "text-green-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Fraud Trends & Analytics</h1>
        <p className="text-slate-300">Real-time insights into job fraud patterns and detection statistics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-morphism rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">This Week</p>
              <p className="text-2xl font-bold text-white">{weeklyScams}</p>
              <p className="text-xs text-slate-500">Scams Detected</p>
            </div>
            <div className="text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Top Risk Category</p>
              <p className="text-lg font-bold text-white">{topRiskCategory}</p>
              <p className="text-xs text-slate-500">67% of detections</p>
            </div>
            <div className="text-orange-400">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Detection Accuracy</p>
              <p className="text-2xl font-bold text-white">{accuracy}%</p>
              <p className="text-xs text-slate-500">↑ 2.1% this month</p>
            </div>
            <div className="text-green-400">
              <Shield className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Reports</p>
              <p className="text-2xl font-bold text-white">{activeReports}</p>
              <p className="text-xs text-slate-500">Under investigation</p>
            </div>
            <div className="text-amber-400">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Scam Detection Trends</h3>
          <DetectionChart />
        </div>

        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Categories Distribution</h3>
          <RiskChart />
        </div>
      </div>

      {/* Geographic Heat Map */}
      <div className="glass-morphism rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Geographic Risk Distribution</h3>
        <div className="bg-slate-800/50 rounded-lg p-8 text-center relative overflow-hidden">
          {/* World map background effect */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1589519160142-9d76f51b48d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600')" 
            }}
          ></div>
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {geographicRisks.map((risk, index) => (
              <div key={index} className="bg-slate-900/80 rounded-lg p-3">
                <div className={`${risk.color} font-semibold`}>{risk.level}</div>
                <div className="text-slate-300">{risk.region}</div>
                <div className="text-xs text-slate-400">{risk.percentage}% of global scams</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Keywords Table */}
      <div className="glass-morphism rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Trending Scam Keywords</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-slate-300 font-medium mb-3">Most Detected Phrases</h4>
            <div className="space-y-2">
              {topKeywords.map((keyword, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">"{keyword.phrase}"</span>
                  <span className="text-xs text-red-400">{keyword.detections.toLocaleString()} detections</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-slate-300 font-medium mb-3">Emerging Threats</h4>
            <div className="space-y-2">
              {emergingThreats.map((threat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">"{threat.threat}"</span>
                  <span className="text-xs text-orange-400">↑ {threat.change}% this week</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
