import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Shield, Info, CheckCircle, X, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { connectWebSocket } from "@/lib/websocket";
import type { Alert } from "@shared/schema";

export default function Alerts() {
  const [criticalThreshold, setCriticalThreshold] = useState([90]);
  const [warningThreshold, setWarningThreshold] = useState([70]);
  const [notifications, setNotifications] = useState({
    critical: true,
    weekly: true,
    daily: false,
    threats: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch alerts
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  // Filter alerts by severity
  const criticalAlerts = alerts?.filter(alert => alert.severity === 'critical' && !alert.resolved) || [];
  const warningAlerts = alerts?.filter(alert => alert.severity === 'warning' && !alert.resolved) || [];
  const infoAlerts = alerts?.filter(alert => alert.severity === 'info' && !alert.resolved) || [];
  const resolvedAlerts = alerts?.filter(alert => alert.resolved) || [];

  // WebSocket connection for real-time alerts
  useEffect(() => {
    const ws = connectWebSocket();
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'alert_created') {
        queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
        
        if (data.alert.severity === 'critical') {
          toast({
            title: "Critical Security Alert",
            description: data.alert.title,
            variant: "destructive",
          });
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [queryClient, toast]);

  // Update alert mutation
  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, resolved }: { id: string; resolved: boolean }) => {
      const response = await apiRequest("PATCH", `/api/alerts/${id}`, { resolved });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alert Updated",
        description: "Alert status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDismissAlert = (alertId: string) => {
    updateAlertMutation.mutate({ id: alertId, resolved: true });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning': return <Info className="w-5 h-5 text-orange-400" />;
      case 'info': return <Info className="w-5 h-5 text-amber-400" />;
      default: return <Shield className="w-5 h-5 text-slate-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500/30';
      case 'warning': return 'border-orange-500/30';
      case 'info': return 'border-amber-500/30';
      default: return 'border-slate-500/30';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-500/20 to-transparent';
      case 'warning': return 'from-orange-500/20 to-transparent';
      case 'info': return 'from-amber-500/20 to-transparent';
      default: return 'from-slate-500/20 to-transparent';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Security Alerts & Notifications</h1>
        <p className="text-slate-300">Real-time security notifications and emerging threat warnings</p>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-morphism rounded-xl p-6 hover-lift border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-400">{criticalAlerts.length}</p>
            </div>
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6 hover-lift border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Warning Alerts</p>
              <p className="text-2xl font-bold text-orange-400">{warningAlerts.length}</p>
            </div>
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6 hover-lift border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Info Alerts</p>
              <p className="text-2xl font-bold text-amber-400">{infoAlerts.length}</p>
            </div>
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6 hover-lift border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Resolved</p>
              <p className="text-2xl font-bold text-green-400">{resolvedAlerts.length}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="glass-morphism rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
          Active Security Alerts
        </h3>
        <div className="space-y-4">
          {[...criticalAlerts, ...warningAlerts, ...infoAlerts].length > 0 ? (
            [...criticalAlerts, ...warningAlerts, ...infoAlerts].map((alert) => (
              <div 
                key={alert.id} 
                className={`bg-gradient-to-r ${getSeverityBg(alert.severity)} rounded-lg p-4 border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {getSeverityIcon(alert.severity)}
                      <h4 className="font-semibold text-white ml-2">{alert.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`ml-3 ${alert.severity === 'critical' ? 'border-red-500 text-red-400' : 
                          alert.severity === 'warning' ? 'border-orange-500 text-orange-400' : 
                          'border-amber-500 text-amber-400'}`}
                      >
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>🕒 {new Date(alert.createdAt).toLocaleString()}</span>
                      <span>🏷️ {alert.category.replace('_', ' ').charAt(0).toUpperCase() + alert.category.replace('_', ' ').slice(1)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-orange-400 hover:text-orange-300"
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-400 hover:text-white"
                      onClick={() => handleDismissAlert(alert.id)}
                      disabled={updateAlertMutation.isPending}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h4 className="text-white font-medium mb-2">All Clear</h4>
              <p className="text-slate-400 text-sm">No active security alerts at this time.</p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Security Report & Threat Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Security Report</h3>
          <div className="bg-cover bg-center rounded-lg p-6 mb-4 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300')" }}
            ></div>
            <div className="relative">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Total Scams Blocked</span>
                  <span className="text-white font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Users Protected</span>
                  <span className="text-white font-semibold">3,842</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">New Threat Patterns</span>
                  <span className="text-white font-semibold">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Detection Accuracy</span>
                  <span className="text-green-400 font-semibold">97.3%</span>
                </div>
              </div>
            </div>
          </div>
          <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
            <Download className="w-4 h-4 mr-2" />
            Download Full Report
          </Button>
        </div>

        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Threat Intelligence Feed</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="text-white text-sm font-medium">New MLM network identified</div>
                <div className="text-slate-400 text-xs">Targeting remote workers with "financial freedom" promises</div>
                <div className="text-slate-500 text-xs">15 minutes ago</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="text-white text-sm font-medium">Domain blacklist updated</div>
                <div className="text-slate-400 text-xs">147 new suspicious domains added to blocklist</div>
                <div className="text-slate-500 text-xs">1 hour ago</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="text-white text-sm font-medium">Keyword pattern analysis</div>
                <div className="text-slate-400 text-xs">AI model detected new scam language patterns</div>
                <div className="text-slate-500 text-xs">3 hours ago</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="text-white text-sm font-medium">Security patch deployed</div>
                <div className="text-slate-400 text-xs">Enhanced detection algorithms now active</div>
                <div className="text-slate-500 text-xs">6 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Configuration */}
      <div className="glass-morphism rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Alert Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-slate-300 font-medium mb-3">Notification Preferences</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <Checkbox 
                  checked={notifications.critical}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, critical: !!checked }))
                  }
                />
                <span className="text-slate-300 text-sm">Critical security alerts</span>
              </label>
              <label className="flex items-center space-x-3">
                <Checkbox 
                  checked={notifications.weekly}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, weekly: !!checked }))
                  }
                />
                <span className="text-slate-300 text-sm">Weekly security reports</span>
              </label>
              <label className="flex items-center space-x-3">
                <Checkbox 
                  checked={notifications.daily}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, daily: !!checked }))
                  }
                />
                <span className="text-slate-300 text-sm">Daily digest emails</span>
              </label>
              <label className="flex items-center space-x-3">
                <Checkbox 
                  checked={notifications.threats}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, threats: !!checked }))
                  }
                />
                <span className="text-slate-300 text-sm">New threat intelligence</span>
              </label>
            </div>
          </div>
          <div>
            <h4 className="text-slate-300 font-medium mb-3">Alert Thresholds</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Critical Alert Threshold: {criticalThreshold[0]}%
                </label>
                <Slider
                  value={criticalThreshold}
                  onValueChange={setCriticalThreshold}
                  max={100}
                  min={70}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>70%</span>
                  <span>85%</span>
                  <span>100%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Warning Alert Threshold: {warningThreshold[0]}%
                </label>
                <Slider
                  value={warningThreshold}
                  onValueChange={setWarningThreshold}
                  max={90}
                  min={50}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>50%</span>
                  <span>70%</span>
                  <span>90%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex space-x-4">
          <Button className="bg-orange-500 text-white hover:bg-orange-600">
            Save Configuration
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            Test Alerts
          </Button>
        </div>
      </div>
    </div>
  );
}
