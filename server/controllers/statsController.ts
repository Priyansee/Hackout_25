import { Request, Response } from 'express';
import { CreditModel, TransactionModel } from '../storage';

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalCredits = await CreditModel.countDocuments();
    const verifiedCredits = await CreditModel.countDocuments({ status: 'verified' });
    const retiredCredits = await CreditModel.countDocuments({ status: 'retired' });
    const trades = await TransactionModel.countDocuments({ transactionType: 'trade' });

    res.json({
      totalCredits,
      verifiedCredits,
      retiredCredits,
      trades
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const getRecentTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await TransactionModel.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .select('transactionType creditId user timestamp');
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent transactions' });
  }
};

export const getComplianceStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const activeProjects = 15; // Would come from ProjectModel.countDocuments()
    const activeCredits = await CreditModel.countDocuments({ status: { $in: ['active', 'verified'] } });
    const retiredCredits = await CreditModel.countDocuments({ status: 'retired' });
    
    const totalVolumeResult = await CreditModel.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalVolume = totalVolumeResult[0]?.total || 0;
    
    const recentTransactions = await TransactionModel.find()
      .sort({ timestamp: -1 })
      .limit(20);

    res.json({
      activeProjects,
      activeCredits,
      retiredCredits,
      totalVolume,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch compliance stats' });
  }
};