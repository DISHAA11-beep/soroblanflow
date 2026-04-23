"use client";

import { useState, useCallback } from "react";
import { useStellar } from "@/hooks/useStellar";
import { useSorobanEvents } from "@/hooks/useSorobanEvents";
import { useToast } from "@/components/Toast";
import { validateAmount } from "@/utils/validation";
import { 
  Wallet, 
  ArrowRightLeft, 
  PlusCircle, 
  Activity, 
  ChevronRight,
  Loader2,
  TrendingUp,
  ExternalLink,
  Wifi,
  WifiOff,
  AlertTriangle
} from "lucide-react";

// --- Main Page ---

export default function Home() {
  const { address, isConnecting, connect, disconnect } = useStellar();
  const { events, isSyncing, error: syncError } = useSorobanEvents();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'swap' | 'pool'>('swap');
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Mock balances
  const MOCK_BALANCE = 500;

  const handleTransaction = async () => {
    // 1. Validation
    const error = validateAmount(amount, MOCK_BALANCE);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);

    // 2. Rate Limiting check
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast(`Success: ${activeTab.toUpperCase()} completed.`, "success");
      setAmount("");
    } catch (err: any) {
      showToast(err.message || "Transaction failed.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const onAmountChange = (val: string) => {
    setAmount(val);
    if (validationError) setValidationError(null);
  };

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Interaction Panel */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card !p-0 overflow-hidden shadow-2xl border-none">
            <div className="flex bg-slate-100/50 dark:bg-black/20 p-2">
              <button 
                onClick={() => setActiveTab('swap')}
                className={`flex-1 h-14 md:h-16 rounded-xl text-sm font-black flex items-center justify-center gap-3 transition-all ${activeTab === 'swap' ? 'bg-white dark:bg-slate-800 text-blue-600' : 'text-slate-500'}`}
              >
                <ArrowRightLeft size={20} />
                SWAP
              </button>
              <button 
                onClick={() => setActiveTab('pool')}
                className={`flex-1 h-14 md:h-16 rounded-xl text-sm font-black flex items-center justify-center gap-3 transition-all ${activeTab === 'pool' ? 'bg-white dark:bg-slate-800 text-blue-600' : 'text-slate-500'}`}
              >
                <PlusCircle size={20} />
                POOL
              </button>
            </div>

            <div className="p-6 md:p-12 space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Input Amount</label>
                  {validationError && (
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                      <AlertTriangle size={10} />
                      {validationError}
                    </span>
                  )}
                </div>
                
                <div className={`relative group transition-all ${validationError ? 'ring-2 ring-red-500/50 rounded-2xl' : ''}`}>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => onAmountChange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black/20 border-2 border-transparent rounded-2xl p-6 md:p-10 text-4xl md:text-5xl font-black outline-none transition-all"
                  />
                  <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <span className="text-lg md:text-xl font-black">ANTIG-A</span>
                  </div>
                </div>
              </div>

              {!address ? (
                <button onClick={connect} disabled={isConnecting} className="w-full h-16 md:h-20 bg-blue-600 text-white text-xl font-black rounded-2xl flex items-center justify-center gap-4">
                  {isConnecting ? <Loader2 className="animate-spin" /> : <Wallet size={24} />}
                  Connect Wallet
                </button>
              ) : (
                <button 
                  onClick={handleTransaction}
                  disabled={isProcessing || !amount}
                  className={`w-full h-16 md:h-20 text-xl font-black rounded-2xl flex items-center justify-center gap-4 transition-all shadow-xl ${
                    isProcessing ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : null}
                  {isProcessing ? "Broadcasting..." : `Confirm ${activeTab.toUpperCase()}`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 h-full">
          <div className="glass-card flex flex-col h-[600px] lg:h-full lg:max-h-[850px] shadow-xl border-none">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-lg flex items-center gap-3">
                {isSyncing ? <Loader2 size={20} className="text-blue-500 animate-spin" /> : <Activity size={20} className="text-blue-500" />}
                ACTIVITY
              </h3>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black ${syncError ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                {syncError ? <WifiOff size={12} /> : <Wifi size={12} />}
                {syncError ? "SYNC ERROR" : "LIVE"}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {events.map((event) => (
                <div key={event.id} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-blue-500 uppercase">{event.type}</span>
                    <span className="text-[10px] font-medium text-slate-400">{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <p className="text-[10px] font-bold text-slate-500 truncate flex-1">Contract: {event.contract.slice(0, 8)}...</p>
                    <a href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-blue-500/10 text-slate-400 hover:text-blue-500">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
