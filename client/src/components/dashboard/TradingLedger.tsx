import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { Trade } from '../../types'

interface TradingLedgerProps {
  filteredTrades: Trade[];
  tradeFilterTab: 'all' | 'long' | 'short';
  setTradeFilterTab: (val: 'all' | 'long' | 'short') => void;
  selectedCalendarDate: string | null;
  setSelectedCalendarDate: (date: string | null) => void;
  onDeleteTrade: (id: string) => void;
  onAddTradeClick: () => void;
  isFullWidth?: boolean;
}

export const TradingLedger: React.FC<TradingLedgerProps> = ({
  filteredTrades,
  tradeFilterTab,
  setTradeFilterTab,
  selectedCalendarDate,
  setSelectedCalendarDate,
  onDeleteTrade,
  onAddTradeClick,
  isFullWidth = false
}) => {
  return (
    <div className={`bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col min-h-[380px] ${isFullWidth ? 'w-full' : 'lg:col-span-2'}`}>
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
            {(['all', 'long', 'short'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setTradeFilterTab(tab)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all capitalize ${tradeFilterTab === tab
                    ? 'bg-brand-primary text-white'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                {tab === 'all' ? 'All' : tab === 'long' ? 'Longs' : 'Shorts'}
              </button>
            ))}
          </div>

          <button
            onClick={onAddTradeClick}
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
                    <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${t.pnl >= 0
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                      {t.pnl >= 0 ? '+' : '-'}${Math.abs(t.pnl).toFixed(2)}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span className={`uppercase text-[9px] font-black px-1.5 py-0.5 rounded ${t.side === 'long'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                      }`}>
                      {t.side}
                    </span>
                  </td>
                  <td className={`py-2 px-2 font-bold font-mono ${t.percentReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                    {t.percentReturn >= 0 ? '+' : ''}{t.percentReturn}%
                  </td>
                  <td className="py-2 px-2 text-slate-400 font-mono">
                    {t.volume.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button
                      onClick={() => onDeleteTrade(t.id)}
                      className="p-1 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded transition-all cursor-pointer"
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
                    <span>
                      No trades closed on {selectedCalendarDate}.{' '}
                      <button onClick={() => setSelectedCalendarDate(null)} className="text-brand-primary underline font-bold cursor-pointer">
                        Clear Filter
                      </button>{' '}
                      to view all.
                    </span>
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
  )
}
