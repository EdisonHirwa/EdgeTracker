/**
 * Trade model types.
 * Swap this out for a Mongoose schema / Prisma model when you add a database.
 */

export type TradeDirection = 'long' | 'short';

export interface Trade {
  id: number;
  symbol: string;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice?: number;
  size: number;          // lot size / quantity
  pnl?: number;          // profit & loss in USD
  notes?: string;
  date: string;          // ISO date string e.g. "2026-05-17"
  createdAt: string;
  updatedAt: string;
}

export type CreateTradeDTO = Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTradeDTO = Partial<CreateTradeDTO>;
