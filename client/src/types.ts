export interface Trade {
  id: string;
  symbol: string;
  openDate: string;
  closeDate: string;
  pnl: number;
  side: 'long' | 'short';
  percentReturn: number;
  volume: number;
}
