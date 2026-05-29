import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  CalendarDays
} from 'lucide-react'

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterAccount: string;
  setFilterAccount: (val: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  filterAccount,
  setFilterAccount
}) => {
  return (
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
  )
}
