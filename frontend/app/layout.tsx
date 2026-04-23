"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { ToastProvider } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EventsProvider } from "@/context/EventsContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <html lang="en" data-theme={theme}>
      <body className={`${inter.className} transition-colors duration-300`}>
        <ToastProvider>
          <EventsProvider>
            <nav className="fixed top-0 w-full z-50 border-b dark:border-white/10 border-black/5 bg-white/80 dark:bg-black/40 backdrop-blur-xl">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
                <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tighter">
                  ANTIGRAVITY
                </h1>
                
                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                  <div className="flex gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <a href="#" className="hover:text-blue-500 transition-colors">Swap</a>
                    <a href="#" className="hover:text-blue-500 transition-colors">Pools</a>
                    <a href="#" className="hover:text-blue-500 transition-colors">Governance</a>
                  </div>
                  <button 
                    onClick={toggleTheme} 
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                    aria-label="Toggle Theme"
                  >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                  </button>
                  <div id="wallet-anchor-desktop"></div>
                </div>

                {/* Mobile Controls */}
                <div className="md:hidden flex items-center gap-2">
                  <button 
                    onClick={toggleTheme} 
                    className="w-12 h-12 flex items-center justify-center rounded-xl"
                  >
                    {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
                  </button>
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="w-12 h-12 flex items-center justify-center rounded-xl"
                  >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                  </button>
                </div>
              </div>

              {/* Mobile Sidebar */}
              {isMenuOpen && (
                <div className="md:hidden absolute top-full w-full bg-white dark:bg-slate-900 border-b border-black/5 dark:border-white/10 p-6 space-y-6 animate-in slide-in-from-top duration-300 shadow-2xl">
                  <div className="flex flex-col gap-4">
                    <a href="#" className="text-lg font-bold p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg">Swap</a>
                    <a href="#" className="text-lg font-bold p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg">Pools</a>
                    <a href="#" className="text-lg font-bold p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg">Governance</a>
                  </div>
                  <div id="wallet-anchor-mobile"></div>
                </div>
              )}
            </nav>
            
            <main className="pt-24 md:pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
          </EventsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
