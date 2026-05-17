import type { Request, Response } from 'express';

// Placeholder in-memory store — replace with DB later
let trades: Trade[] = [];
let nextId = 1;

interface Trade {
  id: number;
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  size: number;
  pnl?: number;
  notes?: string;
  date: string;
}

export const getAllTrades = (_req: Request, res: Response): void => {
  res.json({ success: true, data: trades });
};

export const getTradeById = (req: Request, res: Response): void => {
  const trade = trades.find((t) => t.id === Number(req.params.id));
  if (!trade) {
    res.status(404).json({ success: false, message: 'Trade not found' });
    return;
  }
  res.json({ success: true, data: trade });
};

export const createTrade = (req: Request, res: Response): void => {
  const { symbol, direction, entryPrice, exitPrice, size, pnl, notes, date } = req.body;

  if (!symbol || !direction || !entryPrice || !size || !date) {
    res.status(400).json({ success: false, message: 'Missing required fields' });
    return;
  }

  const newTrade: Trade = {
    id: nextId++,
    symbol,
    direction,
    entryPrice,
    exitPrice,
    size,
    pnl,
    notes,
    date,
  };

  trades.push(newTrade);
  res.status(201).json({ success: true, data: newTrade });
};

export const updateTrade = (req: Request, res: Response): void => {
  const index = trades.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Trade not found' });
    return;
  }

  trades[index] = { ...trades[index], ...req.body };
  res.json({ success: true, data: trades[index] });
};

export const deleteTrade = (req: Request, res: Response): void => {
  const index = trades.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Trade not found' });
    return;
  }

  trades.splice(index, 1);
  res.json({ success: true, message: 'Trade deleted' });
};
