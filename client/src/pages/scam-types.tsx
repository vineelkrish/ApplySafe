import { DollarSign, User, Users, Building, Home, Mail } from "lucide-react";

const scamTypes = [
  {
    icon: DollarSign,
    title: "Payment Required Scams",
    description: "Fraudsters demand upfront payment for training, equipment, or application processing.",
    examples: [
      "Pay $200 for training materials",
      "Equipment deposit required",
      "Processing fee for background check"
    ],
    detectionRate: 94,
    color: "red"
  },
  {
    icon: User,
    title: "Identity Theft Schemes",
    description: "Scammers collect personal information under the guise of employment verification.",
    examples: [
      "Request for SSN before interview",
      "Bank account details \"for direct deposit\"",
      "Photo ID copies via email"
    ],
    detectionRate: 91,
    color: "orange"
  },
  {
    icon: Users,
    title: "MLM & Pyramid Schemes",
    description: "Multi-level marketing disguised as legitimate employment opportunities.",
    examples: [
      "Unlimited earning potential",
      "Recruit friends and family",
      "Be your own boss emphasis"
    ],
    detectionRate: 87,
    color: "amber"
  },
  {
    icon: Building,
    title: "Fake Company Fronts",
    description: "Non-existent companies created solely to collect personal information and money.",
    examples: [
      "No verifiable business address",
      "Generic email domains",
      "No online presence or reviews"
    ],
    detectionRate: 96,
    color: "purple"
  },
  {
    icon: Home,
    title: "Work From Home Frauds",
    description: "Fake remote opportunities targeting people seeking flexible work arrangements.",
    examples: [
      "Earn $5000/week working 2 hours",
      "Data entry with unrealistic pay",
      "No experience required high-pay jobs"
    ],
    detectionRate: 89,
    color: "cyan"
  },
  {
    icon: Mail,
    title: "Phishing & Data Harvesting",
    description: "Attempts to steal credentials or personal information through fake job applications.",
    examples: [
      "Suspicious application links",
      "Request login credentials",
      "Fake company portals"
    ],
    detectionRate: 92,
    color: "pink"
  }
];

const getColorClasses = (color: string) => {
  const colors = {
    red: "bg-red-500/20 text-red-400",
    orange: "bg-orange-500/20 text-orange-400",
    amber: "bg-amber-500/20 text-amber-400",
    purple: "bg-purple-500/20 text-purple-400",
    cyan: "bg-cyan-500/20 text-cyan-400",
    pink: "bg-pink-500/20 text-pink-400"
  };
  return colors[color as keyof typeof colors] || colors.red;
};

const getTextColorClasses = (color: string) => {
  const colors = {
    red: "text-red-400",
    orange: "text-orange-400",
    amber: "text-amber-400",
    purple: "text-purple-400",
    cyan: "text-cyan-400",
    pink: "text-pink-400"
  };
  return colors[color as keyof typeof colors] || colors.red;
};

export default function ScamTypes() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Common Scam Types</h1>
        <p className="text-slate-300">Learn to identify different types of employment fraud</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scamTypes.map((scamType, index) => {
          const IconComponent = scamType.icon;
          return (
            <div key={index} className="glass-morphism rounded-xl p-6 hover-lift">
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 ${getColorClasses(scamType.color)} rounded-lg flex items-center justify-center mr-3`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{scamType.title}</h3>
              </div>
              
              <p className="text-slate-300 text-sm mb-4">{scamType.description}</p>
              
              <div className="space-y-2 mb-4">
                {scamType.examples.map((example, exampleIndex) => (
                  <div key={exampleIndex} className={`text-xs ${getTextColorClasses(scamType.color)}`}>
                    • {example}
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-slate-400">
                Detection Rate: {scamType.detectionRate}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Information Section */}
      <div className="mt-12 glass-morphism rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">How Our Detection Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">AI-Powered Analysis</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our advanced machine learning models analyze job postings using natural language processing 
              to identify patterns, suspicious keywords, and fraudulent indicators. The system continuously 
              learns from new scam patterns and user feedback to improve detection accuracy.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Multi-Layer Verification</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              We combine AI analysis with email domain verification, company background checks, 
              and community feedback to provide comprehensive fraud detection. This multi-layered 
              approach ensures high accuracy and reduces false positives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
