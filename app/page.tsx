"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, Shield, BarChart3, Globe, Cpu } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-60 animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-50 rounded-full blur-[120px] opacity-60 animate-pulse-slow"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Soroban v4 Engine Live</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            SOROBAN<span className="text-blue-600">FLOW</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-12 animate-fade-in-up font-medium leading-relaxed" style={{ animationDelay: "200ms" }}>
            The definitive ecosystem for building, swapping, and governing on Stellar Soroban. 
            Experience mathematical precision and institutional-grade security in every transaction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Link 
              href="/dashboard"
              className="group relative px-8 py-4 bg-black text-white rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 overflow-hidden shadow-2xl shadow-black/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/10 to-blue-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              Launch Dashboard
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="https://github.com/DISHAA11-beep/soroblanflow"
              target="_blank"
              className="px-8 py-4 bg-white border border-gray-200 text-black rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
            >
              View Source
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50/50 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="text-blue-600" />}
              title="Lightning Swaps"
              desc="Instant cross-asset execution powered by our optimized Constant Product AMM engine."
            />
            <FeatureCard 
              icon={<Shield className="text-purple-600" />}
              title="Secure Logic"
              desc="Advanced dual-contract architecture with role-based permissions and supply guardrails."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-green-600" />}
              title="Real-time Analytics"
              desc="Deep integration with Soroban events for sub-second balance updates and activity feeds."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-black mb-6 tracking-tight">
                Built for the next generation of Finance.
              </h2>
              <p className="text-lg text-gray-500 mb-8 font-medium leading-relaxed">
                SorobanFlow isn't just a dashboard—it's a complete foundation for decentralized applications. 
                From our custom token contracts to our modular liquidity pools, every component is 
                rigorously tested and optimized for the Stellar network.
              </p>
              
              <div className="space-y-6">
                <StatItem icon={<Globe size={18} />} text="Native Stellar Asset Support" />
                <StatItem icon={<Cpu size={18} />} text="Highly Scalable Contract Architecture" />
                <StatItem icon={<Zap size={18} />} text="Sub-second Network Resilience" />
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-600 rounded-[40px] blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white border border-gray-200 rounded-[40px] p-8 shadow-xl overflow-hidden">
                 <img 
                   src="./desktop.png" 
                   alt="Dashboard Preview" 
                   className="rounded-2xl border border-gray-100 shadow-sm transition-transform duration-700 group-hover:scale-105"
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px]"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl font-black text-white mb-8 tracking-tight">Ready to flow?</h2>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
          >
            Enter App
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="container mx-auto px-6 flex flex-col md:row justify-between items-center gap-6">
          <div className="text-sm font-bold text-black uppercase tracking-widest">SorobanFlow</div>
          <div className="text-sm text-gray-400 font-medium">© 2026 Antigravity. Built for Stellar Testnet.</div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 bg-white border border-gray-200 rounded-[32px] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-black mb-3">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function StatItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-4 text-black font-bold">
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
        {icon}
      </div>
      {text}
    </div>
  );
}
