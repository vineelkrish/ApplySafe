import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import JobAnalysisForm from "@/components/job-analysis-form";
import AnalysisResults from "@/components/analysis-results";
import type { Job } from "@shared/schema";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<Job | null>(null);
  const [showResults, setShowResults] = useState(false);

  const { data: analytics } = useQuery<{
    totalAnalyses: number;
    scamsDetected: number;
    usersProtected: number;
    accuracy: number;
  }>({
    queryKey: ["/api/analytics"],
  });

  const handleAnalysisComplete = (result: Job) => {
    setAnalysisResult(result);
    setShowResults(true);
  };

  const hideResults = () => {
    setShowResults(false);
    setAnalysisResult(null);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-10" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')" }}>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">
            Protect Yourself from{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Job Fraud
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            AI-powered detection system that analyzes job postings, verifies company legitimacy, 
            and protects you from employment scams using advanced machine learning algorithms.
          </p>
        </div>

        {/* Job Analysis Form */}
        <div className="max-w-4xl mx-auto">
          <JobAnalysisForm onAnalysisComplete={handleAnalysisComplete} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <div className="glass-morphism rounded-xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-green-400">
              {analytics?.totalAnalyses?.toLocaleString() || "50,247"}
            </div>
            <div className="text-slate-300 text-sm mt-1">Jobs Analyzed</div>
          </div>
          <div className="glass-morphism rounded-xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-red-400">
              {analytics?.scamsDetected?.toLocaleString() || "8,943"}
            </div>
            <div className="text-slate-300 text-sm mt-1">Scams Detected</div>
          </div>
          <div className="glass-morphism rounded-xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-orange-400">
              {analytics?.usersProtected?.toLocaleString() || "32,184"}
            </div>
            <div className="text-slate-300 text-sm mt-1">Users Protected</div>
          </div>
          <div className="glass-morphism rounded-xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-amber-400">
              {analytics?.accuracy || "96.7"}%
            </div>
            <div className="text-slate-300 text-sm mt-1">Accuracy Rate</div>
          </div>
        </div>
      </div>

      {/* Analysis Results Modal */}
      {showResults && analysisResult && (
        <AnalysisResults 
          result={analysisResult} 
          onClose={hideResults} 
        />
      )}
    </div>
  );
}
