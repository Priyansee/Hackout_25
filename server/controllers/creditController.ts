import { Request, Response } from 'express';
import { CreditModel, TransactionModel } from '../storage';
import { 
  mintOnBlockchain, 
  transferOnBlockchain, 
  verifyOnBlockchain, 
  retireOnBlockchain 
} from '../blockchain';

export const getCredits = async (req: Request, res: Response): Promise<void> => {
  try {
    const credits = await CreditModel.find().sort({ createdAt: -1 });
    res.json(credits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
};

export const getCreditById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenId } = req.params;
    const credit = await CreditModel.findOne({ tokenId });
    
    if (!credit) {
      res.status(404).json({ error: 'Credit not found' });
      return;
    }

    const transactions = await TransactionModel.find({ tokenId }).sort({ timestamp: -1 });
    
    res.json({ credit, transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credit details' });
  }
};

export const mintCredit = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user exists (should always be true if authenticateToken passed)
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { creditId, user } = req.body;
    
    // In a real implementation, you would create a new credit
    // For now, we'll just simulate the minting process
    
    const transactionHash = await mintOnBlockchain(
      req.user.walletAddress,
      1000, // amount
      { 
        carbonIntensity: 50, 
        energySource: 'Wind', 
        additionality: true, 
        emissionsReduction: 10 
      }
    );

    // Record transaction
    const transaction = new TransactionModel({
      from: '0x0000000000000000000000000000000000000000',
      to: req.user.walletAddress,
      tokenId: creditId,
      transactionHash,
      transactionType: 'mint',
      amount: 1000,
      timestamp: new Date()
    });
    
    await transaction.save();

    res.json({ success: true, transactionHash });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mint credit' });
  }
};

export const transferCredit = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user exists (should always be true if authenticateToken passed)
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { creditId, user } = req.body;
    
    const transactionHash = await transferOnBlockchain(
      req.user.walletAddress,
      '0xRecipientAddress', // In real implementation, get from request
      creditId
    );

    // Record transaction
    const transaction = new TransactionModel({
      from: req.user.walletAddress,
      to: '0xRecipientAddress',
      tokenId: creditId,
      transactionHash,
      transactionType: 'trade',
      amount: 500, // In real implementation, get from request
      price: '0.05', // In real implementation, get from request
      timestamp: new Date()
    });
    
    await transaction.save();

    res.json({ success: true, transactionHash });
  } catch (error) {
    res.status(500).json({ error: 'Failed to transfer credit' });
  }
};

export const verifyCredit = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user exists (should always be true if authenticateToken passed)
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { creditId, user } = req.body;
    
    const transactionHash = await verifyOnBlockchain(creditId);

    // Update credit status
    await CreditModel.findOneAndUpdate(
      { tokenId: creditId },
      { status: 'verified', verificationDate: new Date() }
    );

    // Record transaction
    const transaction = new TransactionModel({
      from: req.user.walletAddress,
      to: '0xVerificationContract',
      tokenId: creditId,
      transactionHash,
      transactionType: 'verify',
      timestamp: new Date()
    });
    
    await transaction.save();

    res.json({ success: true, transactionHash });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify credit' });
  }
};

export const retireCredit = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user exists (should always be true if authenticateToken passed)
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { creditId, user } = req.body;
    
    const transactionHash = await retireOnBlockchain(creditId);

    // Update credit status
    await CreditModel.findOneAndUpdate(
      { tokenId: creditId },
      { status: 'retired', retirementDate: new Date() }
    );

    // Record transaction
    const transaction = new TransactionModel({
      from: req.user.walletAddress,
      to: '0xRetirementContract',
      tokenId: creditId,
      transactionHash,
      transactionType: 'retire',
      timestamp: new Date()
    });
    
    await transaction.save();

    res.json({ success: true, transactionHash });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retire credit' });
  }
};