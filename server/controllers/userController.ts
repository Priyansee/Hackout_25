import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, CreditModel, TransactionModel } from '../storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, organization, role } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate wallet address and DID (mock implementation)
    const walletAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    const did = `did:ethr:${walletAddress}`;

    // Create user
    const user = new UserModel({
      walletAddress,
      did,
      role,
      name,
      email,
      organization,
      location: 'Unknown', // Default location
      verificationStatus: role === 'regulator' // Auto-verify regulators
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        did: user.did,
        role: user.role,
        name: user.name,
        email: user.email,
        organization: user.organization,
        location: user.location,
        verificationStatus: user.verificationStatus,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check password (in real implementation, compare hashed password)
    // For demo purposes, we'll use a simple check
    if (password !== 'demo123') {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        did: user.did,
        role: user.role,
        name: user.name,
        email: user.email,
        organization: user.organization,
        location: user.location,
        verificationStatus: user.verificationStatus,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const getUserPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletAddress } = req.params;

    // Get user's credits
    const credits = await CreditModel.find({ currentOwner: walletAddress });

    res.json({ credits });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};

export const getUserTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletAddress } = req.params;

    // Get user's transactions
    const transactions = await TransactionModel.find({
      $or: [{ from: walletAddress }, { to: walletAddress }]
    }).sort({ timestamp: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user exists (should always be true if authenticateToken passed)
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    // Ensure user can only update their own profile
    if (req.user.id !== id) {
      res.status(403).json({ error: 'Cannot update other users profiles' });
      return;
    }

    const user = await UserModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      walletAddress: user.walletAddress,
      did: user.did,
      role: user.role,
      name: user.name,
      email: user.email,
      organization: user.organization,
      location: user.location,
      verificationStatus: user.verificationStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};