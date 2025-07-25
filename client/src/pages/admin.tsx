import { useQuery } from "@tanstack/react-query";
import { Users, AlertTriangle, Settings, BarChart3, Activity, Shield, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import type { User as UserType, ScamReport } from "@shared/schema";

export default function Admin() {
  const { data: analytics } = useQuery<{
    totalAnalyses: number;
    scamsDetected: number;
    usersProtected: number;
    accuracy: number;
  }>({
    queryKey: ["/api/analytics"],
  });

  const { data: scamReports } = useQuery<ScamReport[]>({
    queryKey: ["/api/scam-reports"],
  });

  // Mock admin stats
  const adminStats = {
    activeUsers: 1247,
    pendingReports: scamReports?.filter(r => r.status === 'pending').length || 23,
    todayAnalyses: 342,
  };

  const systemHealth = {
    apiResponseTime: 127,
    databaseStatus: 'Healthy',
    aiModelAccuracy: analytics?.accuracy || 96.7,
    serverUptime: 99.98,
  };

  const recentActivity = [
    { type: 'user_registered', message: 'New user registered', time: '2m ago', color: 'green' },
    { type: 'scam_detected', message: 'Scam detected', time: '5m ago', color: 'red' },
    { type: 'report_submitted', message: 'Report submitted', time: '8m ago', color: 'orange' },
    { type: 'model_updated', message: 'Model updated', time: '1h ago', color: 'amber' },
  ];

  const mockUsers = [
    {
      id: '1',
      username: 'john_doe',
      email: 'john@example.com',
      role: 'admin',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      username: 'alice_smith',
      email: 'alice@example.com',
      role: 'user',
      createdAt: new Date('2024-01-10'),
    },
  ];

  const getActivityColor = (color: string) => {
    const colors = {
      green: 'bg-green-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      amber: 'bg-amber-500',
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Control Center</h1>
        <p className="text-slate-300">Comprehensive system management and monitoring dashboard</p>
      </div>

      {/* Admin Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Button variant="outline" className="glass-morphism border-orange-500/20 hover:bg-orange-500/10 h-auto p-6 flex flex-col items-center space-y-3">
          <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-center">
            <h3 className="text-white font-medium">User Management</h3>
            <p className="text-slate-400 text-xs mt-1">Manage user accounts</p>
          </div>
        </Button>

        <Button variant="outline" className="glass-morphism border-red-500/20 hover:bg-red-500/10 h-auto p-6 flex flex-col items-center space-y-3">
          <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-center">
            <h3 className="text-white font-medium">Moderate Reports</h3>
            <p className="text-slate-400 text-xs mt-1">Review flagged content</p>
          </div>
        </Button>

        <Button variant="outline" className="glass-morphism border-green-500/20 hover:bg-green-500/10 h-auto p-6 flex flex-col items-center space-y-3">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-center">
            <h3 className="text-white font-medium">System Settings</h3>
            <p className="text-slate-400 text-xs mt-1">Configure parameters</p>
          </div>
        </Button>

        <Button variant="outline" className="glass-morphism border-purple-500/20 hover:bg-purple-500/10 h-auto p-6 flex flex-col items-center space-y-3">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-center">
            <h3 className="text-white font-medium">Analytics</h3>
            <p className="text-slate-400 text-xs mt-1">View system metrics</p>
          </div>
        </Button>
      </div>

      {/* System Status Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* System Health */}
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">API Response Time</span>
              <span className="text-green-400">{systemHealth.apiResponseTime}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Database Status</span>
              <span className="text-green-400">{systemHealth.databaseStatus}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">AI Model Accuracy</span>
              <span className="text-green-400">{systemHealth.aiModelAccuracy}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Server Uptime</span>
              <span className="text-green-400">{systemHealth.serverUptime}%</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 ${getActivityColor(activity.color)} rounded-full`}></div>
                <span className="text-slate-300 text-sm flex-1">{activity.message}</span>
                <span className="text-slate-500 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{adminStats.activeUsers}</div>
              <div className="text-slate-400 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{adminStats.pendingReports}</div>
              <div className="text-slate-400 text-sm">Pending Reports</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{adminStats.todayAnalyses}</div>
              <div className="text-slate-400 text-sm">Today's Analyses</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="glass-morphism rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">User Management</h3>
          <Button className="bg-orange-500 text-white hover:bg-orange-600">
            Add New User
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-white">{user.username}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant="outline"
                      className={user.role === 'admin' ? 'border-purple-500 text-purple-400' : 'border-slate-500 text-slate-400'}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      Active
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {user.role === 'admin' ? '2 hours ago' : '1 day ago'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400">
                      Suspend
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Model Configuration */}
      <div className="glass-morphism rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">AI Model Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Detection Sensitivity</label>
            <Slider
              defaultValue={[75]}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Auto-Block Threshold</label>
            <Slider
              defaultValue={[85]}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>60%</span>
              <span>80%</span>
              <span>95%</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex space-x-4">
          <Button className="bg-orange-500 text-white hover:bg-orange-600">
            Update Configuration
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  );
}
