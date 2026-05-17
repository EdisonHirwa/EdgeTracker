import { Router } from 'express';
import {
  getAllTrades,
  getTradeById,
  createTrade,
  updateTrade,
  deleteTrade,
} from '../controllers/trade.controller.js';

const router = Router();

router.get('/', getAllTrades);
router.get('/:id', getTradeById);
router.post('/', createTrade);
router.put('/:id', updateTrade);
router.delete('/:id', deleteTrade);

export { router as tradeRoutes };
