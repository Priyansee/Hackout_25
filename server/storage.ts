import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  UserDocument,
  CreditDocument,
  TransactionDocument,
  ProjectDocument
} from '../shared/schema';

let mongoServer: MongoMemoryServer;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hydrogen-credits';

// User Schema (unchanged)
const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  did: { type: String, required: true, unique: true },
  role: { type: String, enum: ['producer', 'trader', 'regulator', 'investor'], required: true },
  verificationStatus: { type: Boolean, default: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  organization: { type: String },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Credit Schema (unchanged)
const CreditSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, unique: true },
  producer: { type: String, required: true },
  projectName: { type: String, required: true },
  projectLocation: {
    name: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    country: { type: String, required: true },
    region: { type: String, required: true }
  },
  technology: { 
    type: String, 
    enum: ['PEM Electrolysis', 'Alkaline Electrolysis', 'SOEC', 'Biomass Gasification'],
    required: true 
  },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'traded', 'retired', 'verified'],
    default: 'active'
  },
  certificationLevel: { type: String, required: true },
  pricePerKg: { type: String },
  currentOwner: { type: String, required: true },
  mintingDate: { type: Date, required: true },
  verificationDate: { type: Date },
  retirementDate: { type: Date },
  metadata: {
    carbonIntensity: { type: Number, required: true },
    energySource: { 
      type: String, 
      enum: ['Wind', 'Solar', 'Hydro', 'Geothermal', 'Nuclear'],
      required: true 
    },
    additionality: { type: Boolean, required: true },
    emissionsReduction: { type: Number, required: true }
  }
}, {
  timestamps: true
});

// Transaction Schema (unchanged)
const TransactionSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  tokenId: { type: String, required: true },
  transactionHash: { type: String, required: true, unique: true },
  transactionType: { 
    type: String, 
    enum: ['mint', 'trade', 'verify', 'retire'],
    required: true 
  },
  amount: { type: Number },
  price: { type: String },
  timestamp: { type: Date, default: Date.now }
});

// Project Schema (unchanged)
const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    name: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    country: { type: String, required: true },
    region: { type: String, required: true }
  },
  technology: { type: String, required: true },
  capacity: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'pending', 'inactive'],
    default: 'pending'
  },
  owner: { type: String, required: true },
  certification: {
    standard: { type: String, required: true },
    level: { type: String, required: true },
    issuer: { type: String, required: true },
    validUntil: { type: Date, required: true }
  }
}, {
  timestamps: true
});

// Create models
export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
export const CreditModel = mongoose.model<CreditDocument>('Credit', CreditSchema);
export const TransactionModel = mongoose.model<TransactionDocument>('Transaction', TransactionSchema);
export const ProjectModel = mongoose.model<ProjectDocument>('Project', ProjectSchema);

// Database connection
export const connectToDatabase = async (): Promise<void> => {
  try {
    const isTest = process.env.NODE_ENV === 'test';
    
    if (isTest) {
      // Use in-memory database for tests
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      
      await mongoose.connect(uri);
      console.log('Connected to in-memory MongoDB for testing');
    } else {
      // Use production database
      const options: ConnectOptions = {
        // Remove deprecated options
      } as ConnectOptions;
      
      await mongoose.connect(MONGODB_URI, options);
      console.log('Connected to MongoDB successfully');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Fallback to in-memory database if production connection fails
    if (process.env.NODE_ENV !== 'production') {
      console.log('Falling back to in-memory database...');
      try {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        
        await mongoose.connect(uri);
        console.log('Connected to in-memory MongoDB as fallback');
      } catch (fallbackError) {
        console.error('Failed to connect to in-memory MongoDB:', fallbackError);
        throw error; // Throw the original error
      }
    } else {
      throw error;
    }
  }
};

// Close database connection (useful for tests)
export const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

// Clear database data (useful for tests)
export const clearDatabase = async (): Promise<void> => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};