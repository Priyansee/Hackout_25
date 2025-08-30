import { Request, Response } from 'express';
import { CreditModel } from '../storage';

export const getMarketplaceListings = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get only active credits that are for sale (have a price)
    const listings = await CreditModel.find({
      status: 'active',
      pricePerKg: { $exists: true, $ne: null }
    }).sort({ createdAt: -1 });
    
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marketplace listings' });
  }
};

export const tradeCredit = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user exists (should always be true if authenticateToken passed)
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { tokenId, buyer, seller, price } = req.body;
    
    // Update credit ownership
    await CreditModel.findOneAndUpdate(
      { tokenId },
      { currentOwner: buyer }
    );
    
    // In a real implementation, you would:
    // 1. Validate the transaction
    // 2. Execute the transfer on blockchain
    // 3. Record the transaction
    // 4. Handle payment processing
    
    res.json({ success: true, message: 'Trade completed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete trade' });
  }
};