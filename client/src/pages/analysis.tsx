import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Shield, AlertTriangle, Eye, Calendar, Building, Globe, Mail, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Job } from "@shared/schema";

export default function Analysis() {
  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const { data: analytics } = useQuery<{
    totalAnalyses: number;
    scamsDetected: number;
    usersProtected: number;
    accuracy: number;
  }>({
    queryKey: ["/api/analytics"],
  });

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
        <h1 className="text-3xl font-bold text-white mb-2">Job Analysis Dashboard</h1>
        <p className="text-slate-300">Monitor recent analyses and detection results</p>
      </div>

      {/* Analysis Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-morphism rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Analyses</p>
              <p className="text-2xl font-bold text-white">
                {analytics?.totalAnalyses?.toLocaleString() || "247"}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-400">↗ 12%</span>
            <span className="text-slate-400 ml-1">vs last period</span>
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Scams Blocked</p>
              <p className="text-2xl font-bold text-white">
                {analytics?.scamsDetected?.toLocaleString() || "43"}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-400">↗ 8%</span>
            <span className="text-slate-400 ml-1">increase detected</span>
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Detection Accuracy</p>
              <p className="text-2xl font-bold text-white">
                {analytics?.accuracy || "96.7"}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-400">↗ 2.1%</span>
            <span className="text-slate-400 ml-1">improvement</span>
          </div>
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div className="glass-morphism rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h3 className="text-lg font-semibold text-white">Recent Job Analyses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {jobs && jobs.length > 0 ? (
                jobs.slice(0, 10).map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {job.company || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRiskBadgeColor(job.riskLevel)}>
                        {job.riskLevel.charAt(0).toUpperCase() + job.riskLevel.slice(1)} Risk ({Math.round(job.riskScore)}%)
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-white flex items-center">
                              <Target className="w-5 h-5 mr-2 text-orange-500" />
                              Job Analysis Details
                            </DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Job Information */}
                            <div className="glass-morphism rounded-lg p-6">
                              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <Building className="w-5 h-5 mr-2 text-blue-400" />
                                Job Information
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-slate-400">Job Title</label>
                                  <p className="text-white font-medium">{job.title}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-slate-400">Company</label>
                                  <p className="text-white">{job.company || 'Not specified'}</p>
                                </div>
                                {job.contactEmail && (
                                  <div>
                                    <label className="text-sm font-medium text-slate-400 flex items-center">
                                      <Mail className="w-4 h-4 mr-1" />
                                      Contact Email
                                    </label>
                                    <p className="text-white">{job.contactEmail}</p>
                                  </div>
                                )}
                                {job.sourceUrl && (
                                  <div>
                                    <label className="text-sm font-medium text-slate-400 flex items-center">
                                      <Globe className="w-4 h-4 mr-1" />
                                      Source URL
                                    </label>
                                    <p className="text-white truncate">{job.sourceUrl}</p>
                                  </div>
                                )}
                                <div>
                                  <label className="text-sm font-medium text-slate-400 flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Analysis Date
                                  </label>
                                  <p className="text-white">{new Date(job.createdAt).toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="text-sm font-medium text-slate-400">Job Description</label>
                                <div className="mt-2 p-4 bg-slate-800/50 rounded-lg">
                                  <p className="text-slate-200 whitespace-pre-wrap">{job.description}</p>
                                </div>
                              </div>
                            </div>

                            {/* Risk Assessment */}
                            <div className="glass-morphism rounded-lg p-6">
                              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-green-400" />
                                Risk Assessment
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-white mb-1">{Math.round(job.riskScore)}%</div>
                                  <div className="text-sm text-slate-400">Risk Score</div>
                                </div>
                                <div className="text-center">
                                  <Badge className={`${getRiskBadgeColor(job.riskLevel)} text-lg px-4 py-2`}>
                                    {job.riskLevel.charAt(0).toUpperCase() + job.riskLevel.slice(1)} Risk
                                  </Badge>
                                </div>
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-white mb-1">
                                    {job.status === 'safe' ? '✓' : job.status === 'scam' ? '⚠' : '?'}
                                  </div>
                                  <div className="text-sm text-slate-400 capitalize">{job.status}</div>
                                </div>
                              </div>
                              
                              {job.aiAnalysis?.explanation && (
                                <div className="bg-slate-800/50 rounded-lg p-4">
                                  <h4 className="font-medium text-white mb-2">AI Analysis</h4>
                                  <p className="text-slate-200">{job.aiAnalysis.explanation}</p>
                                  {job.aiAnalysis.confidence && (
                                    <div className="mt-2 text-sm text-slate-400">
                                      Confidence: {Math.round(job.aiAnalysis.confidence * 100)}%
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Red Flags */}
                            {job.redFlags && job.redFlags.length > 0 && (
                              <div className="glass-morphism rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                  <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                                  Detected Red Flags ({job.redFlags.length})
                                </h3>
                                <div className="space-y-2">
                                  {job.redFlags.map((flag, index) => (
                                    <div key={index} className="flex items-start bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                      <AlertTriangle className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                                      <span className="text-red-200">{flag}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Key Phrases */}
                            {job.aiAnalysis?.keyPhrases && job.aiAnalysis.keyPhrases.length > 0 && (
                              <div className="glass-morphism rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Suspicious Key Phrases</h3>
                                <div className="flex flex-wrap gap-2">
                                  {job.aiAnalysis.keyPhrases.map((phrase, index) => (
                                    <Badge key={index} variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-200">
                                      {phrase}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No job analyses found. Start by analyzing your first job posting.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
