import React from 'react'
import {
  TrendingUp,
  Layers,
  ChevronDown,
  LayoutDashboard,
  BarChart3,
  Calendar,
  Plus
} from 'lucide-react'

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSelectedCalendarDate: (date: string | null) => void;
  onAddTradeClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  setSelectedCalendarDate,
  onAddTradeClick
}) => {
  return (
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

      {/* Navigation Tabs */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'trades', label: 'Trades Ledger', icon: BarChart3 },
          { id: 'calendar', label: 'Performance Calendar', icon: Calendar },
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
            onClick={onAddTradeClick}
            className="w-full flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 rounded-lg text-xs font-semibold transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Log New Trade
          </button>
        </div>
      </nav>
    </aside>
  )
}
