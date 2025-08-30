import { z } from 'zod';

// User Schema
export const UserSchema = z.object({
  _id: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  walletAddress: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

// Credit Schema
export const CreditSchema = z.object({
  _id: z.string().optional(),
  ownerId: z.string(),
  projectId: z.string(),
  projectName: z.string(),
  creditType: z.enum(['green', 'blue', 'turquoise']),
  quantity: z.number().positive(),
  pricePerCredit: z.number().positive(),
  certification: z.string(),
  vintage: z.number().min(2000).max(new Date().getFullYear()),
  location: z.string(),
  isListed: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Credit = z.infer<typeof CreditSchema>;

// Transaction Schema
export const TransactionSchema = z.object({
  _id: z.string().optional(),
  creditId: z.string(),
  sellerId: z.string(),
  buyerId: z.string(),
  quantity: z.number().positive(),
  pricePerCredit: z.number().positive(),
  totalAmount: z.number().positive(),
  status: z.enum(['pending', 'completed', 'failed']),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// Marketplace Listing Schema
export const ListingSchema = z.object({
  _id: z.string().optional(),
  creditId: z.string(),
  sellerId: z.string(),
  quantity: z.number().positive(),
  pricePerCredit: z.number().positive(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Listing = z.infer<typeof ListingSchema>;