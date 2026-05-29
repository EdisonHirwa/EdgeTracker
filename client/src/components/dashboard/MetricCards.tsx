import React from 'react'

interface Statistics {
  totalPnl: number;
  winRate: number;
  profitFactor: number;
  avgPnl: number;
}

interface MetricCardsProps {
  statistics: Statistics;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ statistics }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
  )
}
