"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"vulnerable" | "hardened" | "ctf">("vulnerable");
  const [vulnerableId, setVulnerableId] = useState("1");
  const [hardenedId, setHardenedId] = useState("1");
  const [response, setResponse] = useState<any>(null);
  const [ctfInput, setCtfInput] = useState('{"id": "1"}');

  const testVulnerable = async () => {
    try {
      const res = await fetch(`/api/vulnerable?id=${vulnerableId}`);
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ error: err.message });
    }
  };

  const testHardened = async () => {
    try {
      const res = await fetch(`/api/hardened?id=${hardenedId}`);
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ error: err.message });
    }
  };

  const testCtf = async () => {
    try {
      const parsedBody = JSON.parse(ctfInput);
      const res = await fetch(`/api/challenge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedBody),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ error: "Invalid JSON input" });
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200 p-8 sm:p-16 font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur-md mb-4 animate-fade-in-up shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-300">OWASP A10:2025 Demo</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500 text-transparent bg-clip-text drop-shadow-sm">
            Mishandling of Exceptional Conditions
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore how unhandled errors and crashes can expose sensitive infrastructure details or lead to full system compromise.
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center border-b border-slate-800">
          <div className="flex space-x-8">
            <button
              onClick={() => { setActiveTab("vulnerable"); setResponse(null); }}
              className={`pb-4 text-sm font-semibold transition-colors duration-300 ${activeTab === "vulnerable" ? "text-red-400 border-b-2 border-red-400 glow-text" : "text-slate-500 hover:text-slate-300"}`}
            >
              Vulnerable App
            </button>
            <button
              onClick={() => { setActiveTab("hardened"); setResponse(null); }}
              className={`pb-4 text-sm font-semibold transition-colors duration-300 ${activeTab === "hardened" ? "text-emerald-400 border-b-2 border-emerald-400 glow-text-green" : "text-slate-500 hover:text-slate-300"}`}
            >
              Hardened Defenses
            </button>
            <button
              onClick={() => { setActiveTab("ctf"); setResponse(null); }}
              className={`pb-4 text-sm font-semibold transition-colors duration-300 ${activeTab === "ctf" ? "text-purple-400 border-b-2 border-purple-400 glow-text-purple" : "text-slate-500 hover:text-slate-300"}`}
            >
              CTF Challenge
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          
          {/* Interaction Panel */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-purple-500/10 hover:border-slate-600/50">
            <h2 className="text-2xl font-bold mb-6 text-slate-100">
              {activeTab === "vulnerable" && "Vulnerable Endpoint"}
              {activeTab === "hardened" && "Hardened Endpoint"}
              {activeTab === "ctf" && "The Bad Patch"}
            </h2>
            
            {activeTab === "vulnerable" && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Try injecting an invalid token or SQL character like <code className="bg-slate-900 px-1 py-0.5 rounded text-red-300">'</code>. 
                  Observe what the server returns.
                </p>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">User ID Parameter</label>
                  <input
                    type="text"
                    value={vulnerableId}
                    onChange={(e) => setVulnerableId(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-slate-600"
                    placeholder="Enter ID..."
                  />
                </div>
                <button
                  onClick={testVulnerable}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-600/20"
                >
                  Fetch User Profile
                </button>
              </div>
            )}

            {activeTab === "hardened" && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  The same attack hits a fortified "fail-secure" wrapper. Errors are caught, sanitized, and logged internally.
                </p>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">User ID Parameter</label>
                  <input
                    type="text"
                    value={hardenedId}
                    onChange={(e) => setHardenedId(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                    placeholder="Enter ID..."
                  />
                </div>
                <button
                  onClick={testHardened}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-600/20"
                >
                  Fetch User Profile
                </button>
              </div>
            )}

            {activeTab === "ctf" && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  <strong className="text-purple-400">Challenge:</strong> Retrieve the secret FLAG. The developer added a regex to filter out bad keywords like <code className="text-rose-400">UNION</code>, but they didn't properly validate the input type!
                </p>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">JSON Request Body (POST)</label>
                  <textarea
                    rows={4}
                    value={ctfInput}
                    onChange={(e) => setCtfInput(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 resize-none font-mono"
                    spellCheck="false"
                  />
                </div>
                <button
                  onClick={testCtf}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-600/20"
                >
                  Send Payload
                </button>
              </div>
            )}
          </div>

          {/* Response Panel */}
          <div className="bg-slate-950/80 backdrop-blur-2xl border border-slate-800 p-6 rounded-3xl shadow-inner overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-50">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Server Response</span>
            </div>
            <div className="h-full overflow-y-auto custom-scrollbar pt-6">
              {response ? (
                <div className="animate-fade-in">
                  <pre className="text-xs sm:text-sm font-mono text-emerald-400 whitespace-pre-wrap break-words">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 italic">
                  Waiting for request...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
