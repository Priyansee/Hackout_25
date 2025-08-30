import express from 'express';
import {
  getCredits,
  getCreditById,
  mintCredit,
  transferCredit,
  verifyCredit,
  retireCredit
} from './controllers/creditController';
import {
  getMarketplaceListings,
  tradeCredit
} from './controllers/marketplaceController';
import {
  getStats,
  getRecentTransactions,
  getComplianceStats
} from './controllers/statsController';
import {
  getUserPortfolio,
  getUserTransactions,
  updateUserProfile,
  registerUser,
  loginUser
} from './controllers/userController';
import { authenticateToken, authorizeRole } from './middleware/authMiddleware';

const router = express.Router();

// Auth routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

// Credit routes
router.get('/credits', getCredits);
router.get('/credits/:tokenId', getCreditById);
router.post('/credits/mint', authenticateToken, authorizeRole(['producer']), mintCredit);
router.post('/credits/transfer', authenticateToken, authorizeRole(['trader']), transferCredit);
router.post('/credits/verify', authenticateToken, authorizeRole(['regulator']), verifyCredit);
router.post('/credits/retire', authenticateToken, authorizeRole(['investor']), retireCredit);

// Marketplace routes
router.get('/marketplace/listings', getMarketplaceListings);
router.post('/marketplace/trade', authenticateToken, tradeCredit);

// Stats routes
router.get('/stats', getStats);
router.get('/transactions/recent', getRecentTransactions);
router.get('/regulator/compliance', authenticateToken, authorizeRole(['regulator']), getComplianceStats);

// User routes
router.get('/users/:walletAddress/portfolio', authenticateToken, getUserPortfolio);
router.get('/users/:walletAddress/transactions', authenticateToken, getUserTransactions);
router.put('/users/:id', authenticateToken, updateUserProfile);

// Project routes (for regulator)
router.get('/projects', authenticateToken, authorizeRole(['regulator']), async (req, res) => {
  // Implementation to get projects
  res.json([]);
});

export default router;