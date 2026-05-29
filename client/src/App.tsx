import { useState, useMemo } from 'react'
import { Calendar, X } from 'lucide-react'
import type { Trade } from './types'
import { Sidebar } from './components/dashboard/Sidebar'
import { Header } from './components/dashboard/Header'
import { MetricCards } from './components/dashboard/MetricCards'
import { PerformanceCharts } from './components/dashboard/PerformanceCharts'
import { TradingLedger } from './components/dashboard/TradingLedger'
import { PerformanceCalendar } from './components/dashboard/PerformanceCalendar'
import { AddTradeModal } from './components/dashboard/AddTradeModal'

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
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null)
  const [tradeFilterTab, setTradeFilterTab] = useState<'all' | 'long' | 'short'>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)

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

  // Handle delete trade
  const handleDeleteTrade = (id: string) => {
    setTrades(prev => prev.filter(t => t.id !== id))
  }

  // Add new trade
  const handleAddTrade = (newTradeData: Omit<Trade, 'id'>) => {
    const added: Trade = {
      ...newTradeData,
      id: Date.now().toString()
    }
    setTrades(prev => [added, ...prev])
    setIsAddModalOpen(false)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-bg text-slate-100 selection:bg-brand-primary/30">

      {/* ================= SIDEBAR ================= */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedCalendarDate={setSelectedCalendarDate}
        onAddTradeClick={() => setIsAddModalOpen(true)}
      />

      {/* ================= MAIN PANEL ================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-dark-bg">

        {/* --- Top Navbar --- */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterAccount={filterAccount}
          setFilterAccount={setFilterAccount}
        />

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
                className="hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Key Performance Metric Cards */}
          <MetricCards statistics={statistics} />

          {/* Tab Renderings */}
          {activeTab === 'overview' && (
            <>
              {/* Performance Charts */}
              <PerformanceCharts trades={trades} />

              {/* Ledger and Performance Calendar Section */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TradingLedger
                  filteredTrades={filteredTrades}
                  tradeFilterTab={tradeFilterTab}
                  setTradeFilterTab={setTradeFilterTab}
                  selectedCalendarDate={selectedCalendarDate}
                  setSelectedCalendarDate={setSelectedCalendarDate}
                  onDeleteTrade={handleDeleteTrade}
                  onAddTradeClick={() => setIsAddModalOpen(true)}
                />

                <PerformanceCalendar
                  trades={trades}
                  selectedCalendarDate={selectedCalendarDate}
                  setSelectedCalendarDate={setSelectedCalendarDate}
                />
              </section>
            </>
          )}

          {activeTab === 'trades' && (
            <div className="animate-fadeIn">
              <TradingLedger
                filteredTrades={filteredTrades}
                tradeFilterTab={tradeFilterTab}
                setTradeFilterTab={setTradeFilterTab}
                selectedCalendarDate={selectedCalendarDate}
                setSelectedCalendarDate={setSelectedCalendarDate}
                onDeleteTrade={handleDeleteTrade}
                onAddTradeClick={() => setIsAddModalOpen(true)}
                isFullWidth={true}
              />
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="animate-fadeIn">
              <PerformanceCalendar
                trades={trades}
                selectedCalendarDate={selectedCalendarDate}
                setSelectedCalendarDate={setSelectedCalendarDate}
                isCentered={true}
              />
            </div>
          )}

        </div>

      </main>

      {/* ================= ADD TRADE DIALOG (MODAL OVERLAY) ================= */}
      <AddTradeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTrade={handleAddTrade}
      />

    </div>
  )
}

export default App
