import mongoose, { Schema, Document } from 'mongoose';
import { User, Credit, Transaction, Listing } from '../server/schema';

// User Interface extending Mongoose Document
export interface IUser extends User, Document {}

// User Schema
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  walletAddress: { type: String },
}, {
  timestamps: true
});

// Credit Interface extending Mongoose Document
export interface ICredit extends Credit, Document {}

// Credit Schema
const CreditSchema: Schema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: String, required: true },
  projectName: { type: String, required: true },
  creditType: { type: String, enum: ['green', 'blue', 'turquoise'], required: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerCredit: { type: Number, required: true, min: 0 },
  certification: { type: String, required: true },
  vintage: { type: Number, required: true },
  location: { type: String, required: true },
  isListed: { type: Boolean, default: false },
}, {
  timestamps: true
});

// Transaction Interface extending Mongoose Document
export interface ITransaction extends Transaction, Document {}

// Transaction Schema
const TransactionSchema: Schema = new Schema({
  creditId: { type: Schema.Types.ObjectId, ref: 'Credit', required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerCredit: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, {
  timestamps: true
});

// Listing Interface extending Mongoose Document
export interface IListing extends Listing, Document {}

// Listing Schema
const ListingSchema: Schema = new Schema({
  creditId: { type: Schema.Types.ObjectId, ref: 'Credit', required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerCredit: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

// Create and export models
export const UserModel = mongoose.model<IUser>('User', UserSchema);
export const CreditModel = mongoose.model<ICredit>('Credit', CreditSchema);
export const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export const ListingModel = mongoose.model<IListing>('Listing', ListingSchema);