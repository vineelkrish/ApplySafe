import { Link, useLocation } from "wouter";
import { Shield } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/analysis", label: "Analysis" },
    { path: "/scam-types", label: "Scam Types" },
    { path: "/trends", label: "Trends & Analytics" },
    { path: "/admin", label: "Admin Center" },
    { path: "/alerts", label: "Security Alerts" },
  ];

  return (
    <nav className="bg-primary-900/90 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ApplySafe</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location === item.path
                        ? "active-nav"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    {item.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="bg-slate-700/50 p-2 rounded-lg hover:bg-slate-600/50 transition-colors">
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5V3h0z"></path>
                </svg>
              </button>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">JD</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
