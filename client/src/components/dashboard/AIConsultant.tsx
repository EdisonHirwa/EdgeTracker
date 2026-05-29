import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { Trade } from '../../types'

interface Statistics {
  totalPnl: number;
  winRate: number;
  profitFactor: number;
  avgPnl: number;
}

interface AIConsultantProps {
  trades: Trade[];
  statistics: Statistics;
  isCentered?: boolean;
}

export const AIConsultant: React.FC<AIConsultantProps> = ({
  trades,
  statistics,
  isCentered = false
}) => {
  const [aiQuestion, setAiQuestion] = useState<string>('')
  const [aiAnswer, setAiAnswer] = useState<string>('')
  const [aiLoading, setAiLoading] = useState<boolean>(false)

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

  return (
    <section className={`bg-gradient-to-br from-brand-primary/10 via-brand-secondary/5 to-transparent border border-brand-primary/20 rounded-xl p-6 ${isCentered ? 'max-w-2xl mx-auto w-full' : ''}`}>
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
  )
}
