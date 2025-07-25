import { X, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job } from "@shared/schema";

interface AnalysisResultsProps {
  result: Job;
  onClose: () => void;
}

export default function AnalysisResults({ result, onClose }: AnalysisResultsProps) {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      case 'medium': return <Shield className="w-5 h-5" />;
      case 'low': return <CheckCircle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getRiskText = (riskLevel: string, riskScore: number) => {
    switch (riskLevel) {
      case 'high': return `High Risk - Likely Scam (${riskScore}%)`;
      case 'medium': return `Medium Risk - Suspicious (${riskScore}%)`;
      case 'low': return `Low Risk - Appears Safe (${riskScore}%)`;
      default: return `Unknown Risk (${riskScore}%)`;
    }
  };

  const getRecommendation = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': 
        return {
          action: "DO NOT APPLY",
          description: "This job posting shows multiple indicators of being a scam. Report this listing and avoid sharing personal information.",
          bgColor: "from-red-500/20 to-transparent border-red-500/30"
        };
      case 'medium':
        return {
          action: "PROCEED WITH CAUTION",
          description: "This job posting has some suspicious elements. Research the company thoroughly and be cautious about sharing personal information.",
          bgColor: "from-amber-500/20 to-transparent border-amber-500/30"
        };
      case 'low':
        return {
          action: "SAFE TO APPLY",
          description: "This job posting appears legitimate with minimal risk indicators. Standard job application precautions still apply.",
          bgColor: "from-green-500/20 to-transparent border-green-500/30"
        };
      default:
        return {
          action: "REVIEW CAREFULLY",
          description: "Unable to determine risk level. Please review manually and proceed with caution.",
          bgColor: "from-slate-500/20 to-transparent border-slate-500/30"
        };
    }
  };

  const recommendation = getRecommendation(result.riskLevel);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-morphism rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">Analysis Results</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Risk Level Indicator */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-lg font-medium text-white">Risk Level:</div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 ${getRiskColor(result.riskLevel)}`}>
              {getRiskIcon(result.riskLevel)}
              <span>{getRiskText(result.riskLevel, Math.round(result.riskScore))}</span>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-1">
            <div 
              className="h-3 gradient-accent rounded-md transition-all duration-1000" 
              style={{ width: `${Math.min(100, result.riskScore)}%` }}
            ></div>
          </div>
          <div className="text-slate-400 text-sm mt-1">
            Confidence: {Math.round((result.aiAnalysis?.confidence || 0.5) * 100)}%
          </div>
        </div>

        {/* Red Flags */}
        {result.redFlags && result.redFlags.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">🚩 Issues Detected</h4>
            <div className="space-y-2">
              {result.redFlags.map((flag, index) => (
                <div key={index} className="flex items-center text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Explanation */}
        {result.aiAnalysis?.explanation && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">🤖 AI Analysis</h4>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                {result.aiAnalysis.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Key Phrases */}
        {result.aiAnalysis?.keyPhrases && result.aiAnalysis.keyPhrases.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">🔍 Suspicious Phrases</h4>
            <div className="flex flex-wrap gap-2">
              {result.aiAnalysis.keyPhrases.map((phrase, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs"
                >
                  "{phrase}"
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div className={`bg-gradient-to-r ${recommendation.bgColor} rounded-lg p-4 border`}>
          <h4 className="font-semibold text-white mb-2 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Recommended Action
          </h4>
          <p className="text-slate-300 text-sm">
            <strong>{recommendation.action}</strong> - {recommendation.description}
          </p>
        </div>
      </div>
    </div>
  );
}
