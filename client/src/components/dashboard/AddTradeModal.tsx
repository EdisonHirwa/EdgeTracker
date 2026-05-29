import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import type { Trade } from '../../types'

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
}

export const AddTradeModal: React.FC<AddTradeModalProps> = ({
  isOpen,
  onClose,
  onAddTrade
}) => {
  const [newTrade, setNewTrade] = useState<Omit<Trade, 'id'>>({
    symbol: '',
    side: 'long',
    pnl: 0,
    percentReturn: 0,
    openDate: '2026-04-29',
    closeDate: '2026-04-29',
    volume: 100,
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddTrade({
      ...newTrade,
      pnl: Number(newTrade.pnl),
      percentReturn: Number(newTrade.percentReturn),
      volume: Number(newTrade.volume)
    })
    // Reset state
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-md overflow-hidden shadow-2xl shadow-brand-primary/10">

        {/* Modal Title Bar */}
        <div className="px-6 py-4 bg-dark-bg/60 border-b border-dark-border flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Log Completed Transaction
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold">

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
                className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white transition-all font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1">Position Side</label>
              <select
                value={newTrade.side}
                onChange={(e) => setNewTrade(prev => ({ ...prev, side: e.target.value as 'long' | 'short' }))}
                className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white cursor-pointer font-semibold"
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
                className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white transition-all font-mono font-semibold"
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
                className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white transition-all font-mono font-semibold"
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
                className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white transition-all font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1">Close Date</label>
              <input
                type="date"
                required
                value={newTrade.closeDate}
                onChange={(e) => setNewTrade(prev => ({ ...prev, closeDate: e.target.value }))}
                className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white transition-all font-semibold"
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
              className="w-full bg-dark-bg border border-dark-border focus:border-brand-primary/70 focus:outline-none rounded-lg p-2.5 text-white transition-all font-mono font-semibold"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-dark-border/40 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
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
  )
}
