import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Trade } from '../../types'

interface PerformanceCalendarProps {
  trades: Trade[];
  selectedCalendarDate: string | null;
  setSelectedCalendarDate: (date: string | null) => void;
  isCentered?: boolean;
}

export const PerformanceCalendar: React.FC<PerformanceCalendarProps> = ({
  trades,
  selectedCalendarDate,
  setSelectedCalendarDate,
  isCentered = false
}) => {
  // Quick Calendar Net PnL Calculator
  const getCalendarDateStats = (dayString: string) => {
    const dayTrades = trades.filter(t => t.closeDate === dayString)
    if (dayTrades.length === 0) return null
    const netPnl = dayTrades.reduce((acc, t) => acc + t.pnl, 0)
    return { netPnl, count: dayTrades.length }
  }

  return (
    <div className={`bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col ${isCentered ? 'max-w-xl mx-auto w-full' : ''}`}>
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
              className={`relative flex flex-col justify-between p-1.5 rounded-lg border text-left min-h-[50px] transition-all cursor-pointer select-none group ${stats
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
                <span className={`text-[8.5px] font-mono font-bold leading-none ${stats.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
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
  )
}
