import React, { useState, useMemo } from 'react'
import {
  Sparkles,
  LayoutDashboard,
  TrendingUp,
  Calendar,
  BarChart3,
  Search,
  ChevronDown,
  CalendarDays,
  Plus,
  Trash2,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

// Define Trade Interface
interface Trade {
  id: string;
  symbol: string;
  openDate: string;
  closeDate: string;
  pnl: number;
  side: 'long' | 'short';
  percentReturn: number;
  volume: number;
}

// Initial Sample Trades Data
const INITIAL_TRADES: Trade[] = [
  { id: '1', symbol: 'NVDA', openDate: '2026-04-05', closeDate: '2026-04-05', pnl: 1739.02, side: 'long', percentReturn: 3.46, volume: 100 },
  { id: '2', symbol: 'AAPL', openDate: '2026-04-08', closeDate: '2026-04-08', pnl: 652.50, side: 'long', percentReturn: 1.23, volume: 200 },
  { id: '3', symbol: 'MSFT', openDate: '2026-04-10', closeDate: '2026-04-10', pnl: -425.00, side: 'long', percentReturn: -0.94, volume: 150 },
  { id: '4', symbol: 'CGC', openDate: '2026-04-12', closeDate: '2026-04-12', pnl: 102.30, side: 'long', percentReturn: 4.88, volume: 4000 },
  { id: '5', symbol: 'SOFI', openDate: '2026-04-15', closeDate: '2026-04-15', pnl: 380.00, side: 'long', percentReturn: 2.14, volume: 1000 },
  { id: '6', symbol: 'TQQQ', openDate: '2026-04-18', closeDate: '2026-04-18', pnl: -640.00, side: 'long', percentReturn: -2.67, volume: 200 },
  { id: '7', symbol: 'DVN', openDate: '2026-04-20', closeDate: '2026-04-20', pnl: -101.25, side: 'long', percentReturn: -2.46, volume: 150 },
  { id: '8', symbol: 'PACB', openDate: '2026-04-22', closeDate: '2026-04-22', pnl: 811.50, side: 'short', percentReturn: 5.63, volume: 400 },
  { id: '9', symbol: 'TSLA', openDate: '2026-04-25', closeDate: '2026-04-25', pnl: -280.00, side: 'short', percentReturn: -1.82, volume: 80 },
  { id: '10', symbol: 'AMD', openDate: '2026-04-28', closeDate: '2026-04-28', pnl: 480.00, side: 'long', percentReturn: 3.12, volume: 100 },
];

function App() {
  // --- Core States ---
  const [trades, setTrades] = useState<Trade[]>(INITIAL_TRADES)
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filterAccount, setFilterAccount] = useState<string>('all')
  const [simpleMode, setSimpleMode] = useState<boolean>(false)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null)
  const [tradeFilterTab, setTradeFilterTab] = useState<'all' | 'long' | 'short'>('all')

  // --- Add Trade Modal States ---
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [newTrade, setNewTrade] = useState<Omit<Trade, 'id'>>({
    symbol: '',
    side: 'long',
    pnl: 0,
    percentReturn: 0,
    openDate: '2026-04-29',
    closeDate: '2026-04-29',
    volume: 100,
  })

  // --- AI Q&A Assistant States ---
  const [aiQuestion, setAiQuestion] = useState<string>('')
  const [aiAnswer, setAiAnswer] = useState<string>('')
  const [aiLoading, setAiLoading] = useState<boolean>(false)

  // --- Calculations ---
  const statistics = useMemo(() => {
    if (trades.length === 0) {
      return { totalPnl: 0, winRate: 0, profitFactor: 0, avgPnl: 0 }
    }
    const totalPnl = trades.reduce((acc, t) => acc + t.pnl, 0)
    const winningTrades = trades.filter(t => t.pnl > 0)
    const losingTrades = trades.filter(t => t.pnl < 0)
    const winRate = (winningTrades.length / trades.length) * 100

    const totalWinsSum = winningTrades.reduce((acc, t) => acc + t.pnl, 0)
    const totalLossesSum = Math.abs(losingTrades.reduce((acc, t) => acc + t.pnl, 0))
    const profitFactor = totalLossesSum === 0 ? totalWinsSum : totalWinsSum / totalLossesSum
    const avgPnl = totalPnl / trades.length

    return { totalPnl, winRate, profitFactor, avgPnl }
  }, [trades])

  // Filtered trades by search query, account (mock accounts based on ID odds), sidebar filters
  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      // Search matches
      const matchSearch = t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.side.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Account filter (mock)
      const isAccount1 = parseInt(t.id) % 2 === 0
      const matchAccount = filterAccount === 'all' || 
                           (filterAccount === 'account-1' && isAccount1) ||
                           (filterAccount === 'account-2' && !isAccount1)

      // Calendar date filter
      const matchCalendar = !selectedCalendarDate || t.closeDate === selectedCalendarDate

      // Trade list inner filter tab
      const matchTradeTab = tradeFilterTab === 'all' || t.side === tradeFilterTab

      return matchSearch && matchAccount && matchCalendar && matchTradeTab
    })
  }, [trades, searchQuery, filterAccount, selectedCalendarDate, tradeFilterTab])

  // Reset workspace
  const handleResetWorkspace = () => {
    setTrades(INITIAL_TRADES)
    setSelectedCalendarDate(null)
    setSearchQuery('')
    setFilterAccount('all')
  }

  // Handle delete trade
  const handleDeleteTrade = (id: string) => {
    setTrades(prev => prev.filter(t => t.id !== id))
  }

  // Add new trade
  const handleAddTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const added: Trade = {
      ...newTrade,
      id: Date.now().toString(),
      pnl: Number(newTrade.pnl),
      percentReturn: Number(newTrade.percentReturn),
      volume: Number(newTrade.volume)
    }
    setTrades(prev => [added, ...prev])
    setIsAddModalOpen(false)
    setNewTrade({
      symbol: '',
      side: 'long',
      pnl: 0,
      percentReturn: 0,
      openDate: '2026-04-29',
      closeDate: '2026-04-29',
      volume: 100,
    })
  }

  // Quick Calendar Net PnL Calculator
  const getCalendarDateStats = (dayString: string) => {
    const dayTrades = trades.filter(t => t.closeDate === dayString)
    if (dayTrades.length === 0) return null
    const netPnl = dayTrades.reduce((acc, t) => acc + t.pnl, 0)
    return { netPnl, count: dayTrades.length }
  }

  // AI Q&A Processor
  const handleAskAI = (questionText: string) => {
    const query = questionText || aiQuestion
    if (!query.trim()) return
    
    setAiLoading(true)
    setAiAnswer('')
    
    setTimeout(() => {
      const lower = query.toLowerCase()
      let response: string

      if (lower.includes('best') || lower.includes('winner') || lower.includes('highest')) {
        const sorted = [...trades].sort((a, b) => b.pnl - a.pnl)
        if (sorted.length > 0 && sorted[0].pnl > 0) {
          response = `Your best performing trade is **${sorted[0].symbol}** closed on ${sorted[0].closeDate} with a profit of **$${sorted[0].pnl.toFixed(2)}** (${sorted[0].percentReturn}% return) on a ${sorted[0].side} position.`
        } else {
          response = "No profitable trades found in your record."
        }
      } else if (lower.includes('worst') || lower.includes('loser') || lower.includes('lowest')) {
        const sorted = [...trades].sort((a, b) => a.pnl - b.pnl)
        if (sorted.length > 0 && sorted[0].pnl < 0) {
          response = `Your worst performing trade is **${sorted[0].symbol}** closed on ${sorted[0].closeDate} with a loss of **$${Math.abs(sorted[0].pnl).toFixed(2)}** (${sorted[0].percentReturn}% return). Consider reviewing your stop-loss settings.`
        } else {
          response = "No negative trades found. Excellent risk management!"
        }
      } else if (lower.includes('win rate') || lower.includes('winning')) {
        const winPct = statistics.winRate.toFixed(2)
        const wins = trades.filter(t => t.pnl > 0).length
        response = `Your current win rate is **${winPct}%** (${wins} out of ${trades.length} trades are profitable). The target standard for professional day trading is 50-60% with a high risk-to-reward ratio.`
      } else if (lower.includes('profit factor')) {
        response = `Your profit factor is **${statistics.profitFactor.toFixed(3)}**. A profit factor above **1.5** is considered good, and anything above **2.0** is outstanding, meaning your gross profits are double your gross losses.`
      } else if (lower.includes('summary') || lower.includes('performance') || lower.includes('how am i')) {
        const status = statistics.totalPnl >= 0 ? 'profitable' : 'in a drawdown'
        response = `Here is your EdgeTracker performance summary:\n\n• **Net PnL**: $${statistics.totalPnl.toFixed(2)} (${status})\n• **Win Rate**: ${statistics.winRate.toFixed(1)}%\n• **Profit Factor**: ${statistics.profitFactor.toFixed(2)}\n• **Total Trades**: ${trades.length}\n\nYour portfolio is highly active in **${Array.from(new Set(trades.map(t => t.symbol))).join(', ')}**.`
      } else {
        response = `I analyzed your ${trades.length} registered trades. Your overall net P&L stands at **$${statistics.totalPnl.toFixed(2)}** with an average gain of **$${statistics.avgPnl.toFixed(2)}** per trade. Ask me about your 'best trade', 'worst trade', or 'win rate' for specific insights.`
      }

      setAiAnswer(response)
      setAiLoading(false)
    }, 800)
  }

  // --- SVG Chart Calculations ---
  // Cumulative PnL data mapping for line/area chart
  const cumulativePnlData = useMemo(() => {
    const sorted = [...trades].sort((a, b) => new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime())
    let sum = 0
    const dataPoints: { date: string; value: number }[] = []
    for (const t of sorted) {
      sum += t.pnl
      dataPoints.push({ date: t.closeDate, value: sum })
    }
    return dataPoints
  }, [trades])

  // Get SVG points path for cumulative area chart
  const cumulativeChartPath = useMemo(() => {
    if (cumulativePnlData.length === 0) return { line: '', area: '' }
    const width = 360
    const height = 120
    const padding = 10

    const values = cumulativePnlData.map(d => d.value)
    const minVal = Math.min(0, ...values)
    const maxVal = Math.max(100, ...values)
    const valRange = maxVal - minVal

    const points = cumulativePnlData.map((d, index) => {
      const x = padding + (index / (cumulativePnlData.length - 1 || 1)) * (width - 2 * padding)
      const y = height - padding - ((d.value - minVal) / (valRange || 1)) * (height - 2 * padding)
      return { x, y }
    })

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const zeroY = height - padding - ((0 - minVal) / (valRange || 1)) * (height - 2 * padding)
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${zeroY} L ${points[0].x} ${zeroY} Z`

    return { line: linePath, area: areaPath, points }
  }, [cumulativePnlData])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-bg text-slate-100 selection:bg-brand-primary/30">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 bg-dark-card border-r border-dark-border flex-shrink-0">
        
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-dark-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <TrendingUp className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              EdgeTracker
              <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded-full font-semibold">
                PRO
              </span>
            </h1>
          </div>
        </div>

        {/* Dashboard Select */}
        <div className="px-4 py-3">
          <button className="w-full flex items-center justify-between px-3 py-2 bg-dark-bg/60 border border-dark-border hover:border-brand-primary/40 rounded-lg text-sm text-slate-300 transition-all">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-secondary" />
              Custom Dashboard
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Simple Mode Toggle */}
        <div className="px-4 py-2 border-b border-dark-border/40">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-dark-bg/25">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-300">Simple Mode</span>
              <span className="text-[10px] text-slate-500">Condense visualization</span>
            </div>
            <button 
              onClick={() => setSimpleMode(!simpleMode)} 
              className="text-brand-primary hover:text-brand-secondary transition-colors"
            >
              {simpleMode ? (
                <ToggleRight className="w-8 h-8 text-brand-primary" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'trades', label: 'Trades Ledger', icon: BarChart3 },
            { id: 'calendar', label: 'Performance Calendar', icon: Calendar },
            { id: 'ai-qa', label: 'AI Market Assistant', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSelectedCalendarDate(null) // Reset calendar filter
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-primary/20 to-brand-secondary/5 text-white border-l-2 border-brand-primary'
                    : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-primary' : 'text-slate-400'}`} />
                {item.label}
              </button>
            )
          })}

          <div className="pt-4 mt-4 border-t border-dark-border/40">
            <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Actions</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 rounded-lg text-xs font-semibold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Log New Trade
            </button>
          </div>
        </nav>

        {/* Bottom Banner */}
        <div className="p-4 border-t border-dark-border">
          <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/5 border border-brand-primary/20 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-secondary mb-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              Advanced Analytics
            </div>
            <p className="text-[10.5px] text-slate-400 leading-relaxed mb-3">
              Unlock automated strategy backtesting, API broker links, and real-time feeds.
            </p>
            <button className="w-full py-1.5 bg-brand-primary hover:bg-brand-primary/80 text-white font-bold rounded-lg text-xs tracking-wider transition-all duration-150 hover:shadow-lg hover:shadow-brand-primary/20">
              Upgrade System
            </button>
          </div>
        </div>

      </aside>

      {/* ================= MAIN PANEL ================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-dark-bg">
        
        {/* --- Top Navbar --- */}
        <header className="h-16 bg-dark-card border-b border-dark-border flex items-center justify-between px-6 flex-shrink-0">
          
          {/* Left Navigation Details */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-dark-bg/60 p-1 rounded-lg border border-dark-border">
              <button className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Search Input */}
            <div className="relative max-w-xs hidden sm:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symbol, side..."
                className="w-64 pl-9 pr-4 py-1.5 bg-dark-bg/80 border border-dark-border hover:border-slate-700 focus:border-brand-primary/70 focus:outline-none rounded-lg text-xs placeholder-slate-500 text-slate-200 transition-all"
              />
            </div>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-3">
            
            {/* Quick AI Trigger */}
            <button 
              onClick={() => setActiveTab('ai-qa')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary/20 rounded-lg text-xs text-brand-secondary font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
              AI Assistant
            </button>

            {/* Reset Workspace */}
            <button
              onClick={handleResetWorkspace}
              className="flex items-center gap-1 px-3 py-1.5 border border-amber-500/20 text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/40 rounded-lg text-xs font-semibold transition-all"
              title="Reset dashboard to sample data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Sample Data
            </button>

            <span className="h-6 w-px bg-dark-border hidden md:inline"></span>

            {/* Account Selector */}
            <div className="relative">
              <select
                value={filterAccount}
                onChange={(e) => setFilterAccount(e.target.value)}
                className="appearance-none bg-dark-bg/60 border border-dark-border text-xs text-slate-300 pl-3 pr-8 py-1.5 rounded-lg hover:border-brand-secondary/40 focus:outline-none cursor-pointer"
              >
                <option value="all">All Accounts (2)</option>
                <option value="account-1">Margin Account (A1)</option>
                <option value="account-2">Prop Account (A2)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Date Indicator */}
            <div className="hidden lg:flex items-center gap-2 bg-dark-bg/60 border border-dark-border px-3 py-1.5 rounded-lg text-xs text-slate-300">
              <CalendarDays className="w-3.5 h-3.5 text-brand-secondary" />
              <span>2026-04-05 - 2026-04-29</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-brand-primary/40 flex items-center justify-center text-brand-secondary font-bold text-xs">
                EH
              </div>
            </div>
          </div>
        </header>

        {/* --- Main Contents Scroll Area --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Quick Filter Info Tag */}
          {selectedCalendarDate && (
            <div className="flex items-center justify-between bg-brand-primary/10 border border-brand-primary/30 px-4 py-2.5 rounded-lg text-xs text-brand-secondary animate-fadeIn">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Showing trades closed only on <strong>{selectedCalendarDate}</strong></span>
              </div>
              <button 
                onClick={() => setSelectedCalendarDate(null)}
                className="hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= ROW 1: KEY PERFORMANCE METRIC CARDS ================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total PNL Card */}
            <div className={`bg-dark-card border rounded-xl p-5 transition-all hover:shadow-lg ${
              statistics.totalPnl >= 0 ? 'border-emerald-500/20 hover:border-emerald-500/35' : 'border-rose-500/20 hover:border-rose-500/35'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Net PnL (Closed)</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  statistics.totalPnl >= 0 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {statistics.totalPnl >= 0 ? 'PROFITABLE' : 'DRAWDOWN'}
                </span>
              </div>
              <div className={`text-2xl font-black ${
                statistics.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {statistics.totalPnl >= 0 ? '+' : '-'}${Math.abs(statistics.totalPnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[10.5px] text-slate-500 mt-1">Sum of all winning and losing transactions</p>
            </div>

            {/* Win Rate Card */}
            <div className="bg-dark-card border border-dark-border hover:border-brand-primary/30 rounded-xl p-5 transition-all hover:shadow-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Winning Trades Ratio</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-primary/10 text-brand-secondary border border-brand-primary/20 rounded">
                  WIN RATE
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {statistics.winRate.toFixed(2)}%
              </div>
              <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-brand-primary to-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${statistics.winRate}%` }}
                ></div>
              </div>
            </div>

            {/* Profit Factor Card */}
            <div className="bg-dark-card border border-dark-border hover:border-brand-secondary/30 rounded-xl p-5 transition-all hover:shadow-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Profit Factor</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                  RISK METRIC
                </span>
              </div>
              <div className="text-2xl font-black text-slate-100">
                {statistics.profitFactor.toFixed(3)}
              </div>
              <p className="text-[10.5px] text-slate-500 mt-1">
                {statistics.profitFactor >= 2 ? '🔥 Exceptional performance' : statistics.profitFactor >= 1.5 ? '👍 Very healthy score' : '⚠️ Keep managing your losses'}
              </p>
            </div>

            {/* Avg Trade PNL Card */}
            <div className={`bg-dark-card border rounded-xl p-5 transition-all hover:shadow-lg ${
              statistics.avgPnl >= 0 ? 'border-emerald-500/20 hover:border-emerald-500/35' : 'border-rose-500/20 hover:border-rose-500/35'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average PnL per Trade</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  statistics.avgPnl >= 0 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  EXPECTANCY
                </span>
              </div>
              <div className={`text-2xl font-black ${
                statistics.avgPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {statistics.avgPnl >= 0 ? '+' : '-'}${Math.abs(statistics.avgPnl).toFixed(2)}
              </div>
              <p className="text-[10.5px] text-slate-500 mt-1">Net profit expected from each execution</p>
            </div>

          </section>

          {/* ================= ROW 2: INTERACTIVE SVG CHARTS ================= */}
          <section className={`grid grid-cols-1 gap-6 ${simpleMode ? 'lg:grid-cols-1' : 'lg:grid-cols-3'}`}>
            
            {/* Cumulative Profit/Loss Trend Chart */}
            <div className={`bg-dark-card border border-dark-border rounded-xl p-5 ${simpleMode ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cumulative PnL Trend</h3>
                  <p className="text-[10px] text-slate-500">Real-time growth curve across all transactions</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10.5px] font-bold text-slate-400">Total PnL Value</span>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="relative w-full h-[140px] flex items-center justify-center bg-dark-bg/30 rounded-lg p-2 border border-dark-border/40">
                {cumulativePnlData.length > 0 ? (
                  <svg className="w-full h-full" viewBox="0 0 360 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Zero baseline */}
                    <line x1="0" y1="60" x2="360" y2="60" stroke="#334155" strokeWidth="0.75" strokeDasharray="3,3" />

                    {/* Gradient Area Fill */}
                    {cumulativeChartPath.area && (
                      <path d={cumulativeChartPath.area} fill="url(#chartGradient)" />
                    )}

                    {/* Trend Line */}
                    {cumulativeChartPath.line && (
                      <path 
                        d={cumulativeChartPath.line} 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2" 
                        className="transition-all duration-300"
                      />
                    )}

                    {/* Glowing dots at data vertices */}
                    {cumulativeChartPath.points && cumulativeChartPath.points.map((p, idx) => (
                      <g key={idx} className="group cursor-pointer">
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r="3" 
                          fill="#10b981" 
                          stroke="#080b11" 
                          strokeWidth="1" 
                          className="hover:r-5 transition-all"
                        />
                        <title>{`Trade ${idx + 1}: $${cumulativePnlData[idx].value.toFixed(2)} (${cumulativePnlData[idx].date})`}</title>
                      </g>
                    ))}
                  </svg>
                ) : (
                  <p className="text-xs text-slate-500">No active trade records to trace curve.</p>
                )}
              </div>
            </div>

            {/* Daily Wins/Losses Double Bar Chart - Hides in Simple Mode to reduce clutter */}
            {!simpleMode && (
              <div className="bg-dark-card border border-dark-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Wins vs. Losses Distribution</h3>
                    <p className="text-[10px] text-slate-500">Comparing gain volume to loss volume</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-emerald-500"></span>
                      <span className="text-[9.5px] text-slate-400 font-medium">Wins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-rose-500"></span>
                      <span className="text-[9.5px] text-slate-400 font-medium">Losses</span>
                    </div>
                  </div>
                </div>

                <div className="relative w-full h-[140px] flex items-end justify-between bg-dark-bg/30 rounded-lg p-3 border border-dark-border/40 gap-3">
                  {/* Grouped custom CSS bars */}
                  {trades.length > 0 ? (
                    (() => {
                      const winsTotal = trades.filter(t => t.pnl > 0).reduce((acc, t) => acc + t.pnl, 0)
                      const lossesTotal = Math.abs(trades.filter(t => t.pnl < 0).reduce((acc, t) => acc + t.pnl, 0))
                      const maxTotal = Math.max(winsTotal, lossesTotal) || 1
                      
                      const winHeight = `${(winsTotal / maxTotal) * 100}%`
                      const lossHeight = `${(lossesTotal / maxTotal) * 100}%`

                      return (
                        <div className="w-full h-full flex items-end justify-around px-4">
                          <div className="flex flex-col items-center w-12 gap-1.5">
                            <div className="text-[10px] font-bold text-emerald-400">${winsTotal.toFixed(0)}</div>
                            <div className="w-8 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t" style={{ height: winHeight, minHeight: '6px' }}></div>
                            <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Gains</div>
                          </div>
                          
                          <div className="flex flex-col items-center w-12 gap-1.5">
                            <div className="text-[10px] font-bold text-rose-400">${lossesTotal.toFixed(0)}</div>
                            <div className="w-8 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t" style={{ height: lossHeight, minHeight: '6px' }}></div>
                            <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Losses</div>
                          </div>
                        </div>
                      )
                    })()
                  ) : (
                    <p className="text-xs text-slate-500 w-full text-center py-12">No statistics recorded.</p>
                  )}
                </div>
              </div>
            )}

          </section>

          {/* ================= ROW 3: DETAILED TABLES AND CALENDAR SECTION ================= */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* --- Left / Middle Column: Trades Ledger --- */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-5 lg:col-span-2 flex flex-col min-h-[380px]">
              
              {/* Header inside component */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-dark-border/40 pb-4 mb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Trading Ledger</h3>
                    <span className="text-[10.5px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full font-bold">
                      {filteredTrades.length} Trades Shown
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500">Review detailed records, filter by positions, or delete records</p>
                </div>
                
                {/* Ledger actions & filters */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="flex bg-dark-bg p-0.5 rounded-lg border border-dark-border text-xs">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'long', label: 'Longs' },
                      { id: 'short', label: 'Shorts' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setTradeFilterTab(tab.id)}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                          tradeFilterTab === tab.id
                            ? 'bg-brand-primary text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg text-xs font-bold transition-all hover:scale-[1.02] shadow-lg shadow-brand-primary/10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Trade
                  </button>
                </div>
              </div>

              {/* Table ledger */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-dark-border text-slate-400 font-bold uppercase tracking-wider text-[9.5px]">
                      <th className="py-2.5 px-2">Symbol</th>
                      <th className="py-2.5 px-2">Trade Date</th>
                      <th className="py-2.5 px-2">PnL ($)</th>
                      <th className="py-2.5 px-2">Side</th>
                      <th className="py-2.5 px-2">% Return</th>
                      <th className="py-2.5 px-2">Volume</th>
                      <th className="py-2.5 px-2 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border/40 font-medium">
                    {filteredTrades.length > 0 ? (
                      filteredTrades.map((t) => (
                        <tr 
                          key={t.id} 
                          className="hover:bg-slate-800/20 transition-all text-slate-300"
                        >
                          <td className="py-2 px-2">
                            <span className="font-bold text-white bg-slate-800/80 px-2 py-0.5 rounded border border-dark-border">
                              {t.symbol}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-slate-400 text-[10.5px]">
                            {t.closeDate}
                          </td>
                          <td className="py-2 px-2">
                            <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${
                              t.pnl >= 0 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                              {t.pnl >= 0 ? '+' : '-'}${Math.abs(t.pnl).toFixed(2)}
                            </span>
                          </td>
                          <td className="py-2 px-2">
                            <span className={`uppercase text-[9px] font-black px-1.5 py-0.5 rounded ${
                              t.side === 'long' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {t.side}
                            </span>
                          </td>
                          <td className={`py-2 px-2 font-bold font-mono ${
                            t.percentReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {t.percentReturn >= 0 ? '+' : ''}{t.percentReturn}%
                          </td>
                          <td className="py-2 px-2 text-slate-400 font-mono">
                            {t.volume.toLocaleString()}
                          </td>
                          <td className="py-2 px-2 text-right">
                            <button
                              onClick={() => handleDeleteTrade(t.id)}
                              className="p-1 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded transition-all"
                              title="Delete Trade"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          {selectedCalendarDate ? (
                            <span>No trades closed on {selectedCalendarDate}. Click <button onClick={() => setSelectedCalendarDate(null)} className="text-brand-primary underline font-bold">Clear Filter</button> to view all.</span>
                          ) : (
                            <span>No matches found. Check your search terms or log a new trade.</span>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Ledger Footer Info */}
              <div className="border-t border-dark-border/40 pt-3 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>Interactive Color Indicator: Hover items for tooltips.</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-brand-primary"></span>
                  Actionable brand interactive accents
                </span>
              </div>
            </div>

            {/* --- Right Column: Monthly Performance Calendar Grid --- */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col">
              
              <div className="flex items-center justify-between border-b border-dark-border/40 pb-4 mb-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">April 2026 Calendar</h3>
                  <p className="text-[10px] text-slate-500">Visual mapping of daily trading PnL sums</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-500 text-[10px] uppercase mb-1.5">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Calendar Grid (April 2026 starts on a Wednesday) */}
              <div className="grid grid-cols-7 gap-1.5 flex-1 min-h-[220px]">
                {/* Empty cells for padding (April 1st is Wednesday, so 3 empty cells) */}
                <div className="bg-transparent"></div>
                <div className="bg-transparent"></div>
                <div className="bg-transparent"></div>

                {/* Days 1 to 30 */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const dayNum = i + 1
                  const dateString = `2026-04-${dayNum.toString().padStart(2, '0')}`
                  const stats = getCalendarDateStats(dateString)
                  const isSelected = selectedCalendarDate === dateString

                  return (
                    <button
                      key={dayNum}
                      onClick={() => {
                        if (stats) {
                          setSelectedCalendarDate(isSelected ? null : dateString)
                        }
                      }}
                      className={`relative flex flex-col justify-between p-1.5 rounded-lg border text-left min-h-[50px] transition-all cursor-pointer select-none group ${
                        stats 
                          ? stats.netPnl >= 0 
                            ? isSelected
                              ? 'bg-emerald-500/25 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                              : 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/15'
                            : isSelected
                              ? 'bg-rose-500/25 border-rose-500 text-white shadow-lg shadow-rose-500/10'
                              : 'bg-rose-500/10 border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-500/15'
                          : 'bg-dark-bg/30 border-dark-border text-slate-600 hover:border-slate-800'
                      }`}
                      title={stats ? `${stats.count} trades: PnL $${stats.netPnl.toFixed(2)}` : 'No trades logged'}
                    >
                      {/* Day Number */}
                      <span className={`text-[10px] font-bold ${stats ? 'text-slate-200' : 'text-slate-600'}`}>
                        {dayNum}
                      </span>
                      
                      {/* Day Profit Indicator */}
                      {stats && (
                        <span className={`text-[8.5px] font-mono font-bold leading-none ${
                          stats.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {stats.netPnl >= 0 ? '+' : '-'}${Math.abs(stats.netPnl).toFixed(0)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Instructions tag */}
              <p className="text-[9.5px] text-slate-500 mt-4 leading-normal bg-dark-bg/40 p-2 border border-dark-border rounded">
                💡 <strong>Interactive Hint:</strong> Click calendar dates with transaction values to filter the ledger. Click again to clear.
              </p>

            </div>

          </section>

          {/* ================= AI SPARKLES Q&A DRAWER ================= */}
          <section className="bg-gradient-to-br from-brand-primary/10 via-brand-secondary/5 to-transparent border border-brand-primary/20 rounded-xl p-6">
            
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Portfolio Consultant</h3>
                <p className="text-xs text-slate-400">Ask metrics questions or query trading logs instantly</p>
              </div>
            </div>

            {/* Chat output */}
            {aiAnswer && (
              <div className="mb-4 bg-dark-bg/60 border border-brand-primary/30 rounded-lg p-4 text-xs text-slate-200 leading-relaxed font-medium animate-fadeIn">
                <div className="font-bold text-brand-secondary mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                  EdgeTracker AI:
                </div>
                <div className="whitespace-pre-line text-slate-300 font-sans">{aiAnswer}</div>
              </div>
            )}

            {/* Input elements */}
            <div className="flex gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask me e.g., 'What is my best trade?' or 'How is my overall performance?'"
                className="flex-1 bg-dark-bg/80 border border-dark-border hover:border-slate-700 focus:border-brand-primary/70 focus:outline-none rounded-lg text-xs px-3.5 py-2.5 text-slate-200 placeholder-slate-500 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskAI('')
                }}
              />
              <button
                onClick={() => handleAskAI('')}
                disabled={aiLoading}
                className="px-4 bg-brand-primary hover:bg-brand-primary/80 disabled:bg-slate-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-lg shadow-brand-primary/10"
              >
                {aiLoading ? (
                  <span>Analyzing...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    Query AI
                  </>
                )}
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="mt-3 flex flex-wrap gap-2 text-[10.5px]">
              <span className="text-slate-500 self-center">Try Quick Actions:</span>
              {[
                'Show me my performance summary',
                'Which stock is my best winner?',
                'Tell me my worst trade',
                'What is my winning percentage?'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskAI(q)}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-brand-secondary/20 hover:text-white border border-dark-border text-slate-400 rounded-md transition-all text-left font-semibold cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

          </section>

        </div>

      </main>

      {/* ================= ADD TRADE DIALOG (MODAL OVERLAY) ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          
          <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-md overflow-hidden shadow-2xl shadow-brand-primary/10">
            
            {/* Modal Title Bar */}
            <div className="px-6 py-4 bg-dark-bg/60 border-b border-dark-border flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Log Completed Transaction
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddTradeSubmit} className="p-6 space-y-4 text-xs font-semibold">
              
              {/* Row 1: Symbol & Side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Ticker Symbol</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TSLA, NVDA"
                    value={newTrade.symbol}
                    onChange={(e) => setNewTrade(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                    className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Position Side</label>
                  <select
                    value={newTrade.side}
                    onChange={(e) => setNewTrade(prev => ({ ...prev, side: e.target.value as 'long' | 'short' }))}
                    className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white cursor-pointer"
                  >
                    <option value="long">LONG (Buy)</option>
                    <option value="short">SHORT (Sell)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Net PnL & Percentage Return */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Net P&L ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 150.50 or -75.00"
                    value={newTrade.pnl || ''}
                    onChange={(e) => setNewTrade(prev => ({ ...prev, pnl: Number(e.target.value) }))}
                    className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white transition-all font-mono"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Return Percentage (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 2.5 or -1.8"
                    value={newTrade.percentReturn || ''}
                    onChange={(e) => setNewTrade(prev => ({ ...prev, percentReturn: Number(e.target.value) }))}
                    className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white transition-all font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Open Date</label>
                  <input
                    type="date"
                    required
                    value={newTrade.openDate}
                    onChange={(e) => setNewTrade(prev => ({ ...prev, openDate: e.target.value }))}
                    className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Close Date</label>
                  <input
                    type="date"
                    required
                    value={newTrade.closeDate}
                    onChange={(e) => setNewTrade(prev => ({ ...prev, closeDate: e.target.value }))}
                    className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white transition-all"
                  />
                </div>
              </div>

              {/* Row 4: Volume */}
              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Share/Contract Volume</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 100"
                  value={newTrade.volume || ''}
                  onChange={(e) => setNewTrade(prev => ({ ...prev, volume: Number(e.target.value) }))}
                  className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white transition-all font-mono"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-dark-border/40 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-dark-border text-slate-400 hover:text-white rounded-lg transition-colors font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg transition-colors font-bold cursor-pointer shadow-lg shadow-brand-primary/10"
                >
                  Add to Ledger
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}

export default App
