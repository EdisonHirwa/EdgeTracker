import React, { useMemo } from 'react'
import type { Trade } from '../../types'

interface PerformanceChartsProps {
  trades: Trade[];
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ trades }) => {
  // Cumulative PnL data mapping for line/area chart
  const cumulativePnlData = useMemo(() => {
    const sorted = [...trades].sort((a, b) => new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime())
    let sum = 0
    const dataPoints: { date: string; value: number }[] = []
    for (const t of sorted) {
      sum += t.pnl
      dataPoints.push({ date: t.closeDate, value: sum })
    }
    return dataPoints;
  }, [trades])

  // Get SVG points path for cumulative area chart
  const cumulativeChartPath = useMemo(() => {
    if (cumulativePnlData.length === 0) return { line: '', area: '', points: [] as Array<{ x: number; y: number }> }
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
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cumulative Profit/Loss Trend Chart */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-5 lg:col-span-2">
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

      {/* Daily Wins/Losses Double Bar Chart */}
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
    </section>
  )
}
