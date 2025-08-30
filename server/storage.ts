// import { type User, type InsertUser, type HydrogenCredit, type InsertHydrogenCredit, type Transaction, type InsertTransaction, type Project, type InsertProject } from "@shared/schema";
import { randomUUID } from "crypto";

// export interface IStorage {
//   // Users
//   getUser(id: string): Promise<User | undefined>;
//   getUserByEmail(email: string): Promise<User | undefined>;
//   getUserByWallet(walletAddress: string): Promise<User | undefined>;
//   createUser(user: InsertUser): Promise<User>;
//   updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
//   // Credits
//   getCredits(): Promise<HydrogenCredit[]>;
//   getCredit(id: string): Promise<HydrogenCredit | undefined>;
//   getCreditByTokenId(tokenId: string): Promise<HydrogenCredit | undefined>;
//   getCreditsByOwner(owner: string): Promise<HydrogenCredit[]>;
//   getCreditsByProducer(producer: string): Promise<HydrogenCredit[]>;
//   createCredit(credit: InsertHydrogenCredit): Promise<HydrogenCredit>;
//   updateCredit(id: string, updates: Partial<HydrogenCredit>): Promise<HydrogenCredit | undefined>;
  
//   // Transactions
//   getTransactions(): Promise<Transaction[]>;
//   getTransactionsByTokenId(tokenId: string): Promise<Transaction[]>;
//   getTransactionsByUser(userWallet: string): Promise<Transaction[]>;
//   createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
//   // Projects
//   getProjects(): Promise<Project[]>;
//   getProject(id: string): Promise<Project | undefined>;
//   getProjectsByProducer(producer: string): Promise<Project[]>;
//   createProject(project: InsertProject): Promise<Project>;
//   updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined>;
// }

// export class MemStorage implements IStorage {
//   private users: Map<string, User>;
//   private credits: Map<string, HydrogenCredit>;
//   private transactions: Map<string, Transaction>;
//   private projects: Map<string, Project>;

//   constructor() {
//     this.users = new Map();
//     this.credits = new Map();
//     this.transactions = new Map();
//     this.projects = new Map();
//     this.initializeSampleData();
//   }

//   private initializeSampleData() {
//     // Sample Users
//     const users = [
//       {
//         id: "user-1",
//         email: "sarah.chen@greenh2.com",
//         password: "$2a$10$rXwHHZrSzF0Q4P8XWlJf7.V6Y9KlA8QdJ2qD5eM9Ks7f8z1Y2tW3P", // password: demo123
//         walletAddress: "0x742d35Cc6554C19c3a5Cc2A1d4e9e7b8f1a2e8f9",
//         did: "did:ethr:0x742d35Cc6554C19c3a5Cc2A1d4e9e7b8f1a2e8f9",
//         role: "producer" as const,
//         verificationStatus: true,
//         name: "Sarah Chen",
//         organization: "GreenH2 Industries",
//         location: "California, USA",
//         createdAt: new Date("2024-01-01"),
//       },
//       {
//         id: "user-2",
//         email: "erik.andersen@nordich2.no",
//         password: "$2a$10$rXwHHZrSzF0Q4P8XWlJf7.V6Y9KlA8QdJ2qD5eM9Ks7f8z1Y2tW3P", // password: demo123
//         walletAddress: "0x8f1a2e9c742d35Cc6554C19c3a5Cc2A1d4e9e7b8",
//         did: "did:ethr:0x8f1a2e9c742d35Cc6554C19c3a5Cc2A1d4e9e7b8",
//         role: "producer" as const,
//         verificationStatus: true,
//         name: "Erik Andersen",
//         organization: "Nordic Hydrogen",
//         location: "Oslo, Norway",
//         createdAt: new Date("2024-01-02"),
//       },
//       {
//         id: "user-3",
//         email: "maria.rodriguez@hydrogencouncil.org",
//         password: "$2a$10$rXwHHZrSzF0Q4P8XWlJf7.V6Y9KlA8QdJ2qD5eM9Ks7f8z1Y2tW3P", // password: demo123
//         walletAddress: "0x456def789abc123456789def0123456789abcdef",
//         did: "did:ethr:0x456def789abc123456789def0123456789abcdef",
//         role: "regulator" as const,
//         verificationStatus: true,
//         name: "Dr. Maria Rodriguez",
//         organization: "International Hydrogen Council",
//         location: "Brussels, Belgium",
//         createdAt: new Date("2024-01-03"),
//       },
//     ];

//     users.forEach(user => this.users.set(user.id, user));

//     // Sample Projects
//     const projects = [
//       {
//         id: "project-1",
//         name: "Mojave Solar H2 Plant",
//         producer: "GreenH2 Industries",
//         location: { lat: 35.0528, lng: -115.4681, name: "Mojave Desert, CA" },
//         capacity: "50 MW",
//         technology: "PEM Electrolysis",
//         energySource: "Solar PV",
//         certification: "CertifHy Green Premium",
//         status: "active" as const,
//         totalCreditsIssued: 12500,
//         createdAt: new Date("2023-12-01"),
//       },
//       {
//         id: "project-2",
//         name: "North Sea Wind H2 Facility",
//         producer: "Nordic Hydrogen",
//         location: { lat: 59.3293, lng: 18.0686, name: "Stockholm, Sweden" },
//         capacity: "75 MW",
//         technology: "Alkaline Electrolysis",
//         energySource: "Offshore Wind",
//         certification: "EU RES Directive",
//         status: "active" as const,
//         totalCreditsIssued: 18750,
//         createdAt: new Date("2023-11-15"),
//       },
//     ];

//     projects.forEach(project => this.projects.set(project.id, project));

//     // Sample Credits
//     const credits = [
//       {
//         id: "credit-1",
//         tokenId: "H2-GEN-001",
//         contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
//         producer: "GreenH2 Industries",
//         producerWallet: "0x742d35Cc6554C19c3a5Cc2A1d4e9e7b8f1a2e8f9",
//         currentOwner: "0x742d35Cc6554C19c3a5Cc2A1d4e9e7b8f1a2e8f9",
//         projectLocation: { lat: 35.0528, lng: -115.4681, name: "Mojave Desert, CA" },
//         amount: 1000,
//         certificationHash: "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
//         certificationLevel: "Premium Green",
//         technology: "PEM Electrolysis",
//         energySource: "100% Solar",
//         carbonIntensity: "0.50",
//         issuanceDate: new Date("2024-01-15"),
//         status: "active" as const,
//         pricePerKg: "0.05",
//         metadata: {
//           projectId: "project-1",
//           batchNumber: "B001-2024",
//           qualityGrade: "A+",
//         },
//         createdAt: new Date("2024-01-15"),
//       },
//       {
//         id: "credit-2",
//         tokenId: "H2-WIND-024",
//         contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
//         producer: "Nordic Hydrogen",
//         producerWallet: "0x8f1a2e9c742d35Cc6554C19c3a5Cc2A1d4e9e7b8",
//         currentOwner: "0x8f1a2e9c742d35Cc6554C19c3a5Cc2A1d4e9e7b8",
//         projectLocation: { lat: 59.3293, lng: 18.0686, name: "Stockholm, Sweden" },
//         amount: 750,
//         certificationHash: "0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
//         certificationLevel: "Standard Green",
//         technology: "Alkaline Electrolysis",
//         energySource: "Offshore Wind",
//         carbonIntensity: "0.75",
//         issuanceDate: new Date("2023-12-20"),
//         status: "traded" as const,
//         pricePerKg: "0.04",
//         metadata: {
//           projectId: "project-2",
//           batchNumber: "W024-2023",
//           qualityGrade: "A",
//         },
//         createdAt: new Date("2023-12-20"),
//       },
//       {
//         id: "credit-3",
//         tokenId: "H2-HYDRO-007",
//         contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
//         producer: "AlpenH2 GmbH",
//         producerWallet: "0x123456789abcdef0123456789abcdef012345678",
//         currentOwner: "0x987654321fedcba0987654321fedcba098765432",
//         projectLocation: { lat: 47.5596, lng: 10.7498, name: "Bavaria, Germany" },
//         amount: 1250,
//         certificationHash: "0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730",
//         certificationLevel: "Premium Green",
//         technology: "PEM Electrolysis",
//         energySource: "Hydroelectric",
//         carbonIntensity: "0.25",
//         issuanceDate: new Date("2023-11-10"),
//         status: "retired" as const,
//         pricePerKg: "0.06",
//         metadata: {
//           retiredBy: "BMW Manufacturing",
//           retiredFor: "Carbon Neutrality Program",
//           retirementDate: "2024-01-05",
//         },
//         createdAt: new Date("2023-11-10"),
//       },
//     ];

//     credits.forEach(credit => this.credits.set(credit.id, credit));

//     // Sample Transactions
//     const transactions = [
//       {
//         id: "tx-1",
//         from: "0x0000000000000000000000000000000000000000",
//         to: "0x742d35Cc6554C19c3a5Cc2A1d4e9e7b8f1a2e8f9",
//         tokenId: "H2-GEN-001",
//         transactionHash: "0x742d35cc6554c19c3a5cc2a1d4e9e7b8f1a2e8f9",
//         transactionType: "mint",
//         price: "0.00",
//         timestamp: new Date("2024-01-15T10:30:00Z"),
//       },
//       {
//         id: "tx-2",
//         from: "0x8f1a2e9c742d35Cc6554C19c3a5Cc2A1d4e9e7b8",
//         to: "0x456def789abc123456789def0123456789abcdef",
//         tokenId: "H2-WIND-024",
//         transactionHash: "0x8f1a2e9c742d35cc6554c19c3a5cc2a1d4e9e7b8",
//         transactionType: "trade",
//         amount: 750,
//         price: "30.00",
//         timestamp: new Date("2024-01-18T14:20:00Z"),
//       },
//       {
//         id: "tx-3",
//         from: "0x987654321fedcba0987654321fedcba098765432",
//         to: "0x0000000000000000000000000000000000000000",
//         tokenId: "H2-HYDRO-007",
//         transactionHash: "0x987654321fedcba0987654321fedcba098765432",
//         transactionType: "retire",
//         amount: 1250,
//         timestamp: new Date("2024-01-05T09:15:00Z"),
//       },
//     ];

//     transactions.forEach(tx => this.transactions.set(tx.id, tx));
//   }

//   // User methods
//   async getUser(id: string): Promise<User | undefined> {
//     return this.users.get(id);
//   }

//   async getUserByEmail(email: string): Promise<User | undefined> {
//     return Array.from(this.users.values()).find(user => user.email === email);
//   }

//   async getUserByWallet(walletAddress: string): Promise<User | undefined> {
//     return Array.from(this.users.values()).find(user => user.walletAddress === walletAddress);
//   }

//   async createUser(insertUser: InsertUser): Promise<User> {
//     const id = randomUUID();
//     const user: User = { 
//       ...insertUser, 
//       id, 
//       verificationStatus: false,
//       createdAt: new Date() 
//     };
//     this.users.set(id, user);
//     return user;
//   }

//   async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
//     const user = this.users.get(id);
//     if (!user) return undefined;
    
//     const updatedUser = { ...user, ...updates };
//     this.users.set(id, updatedUser);
//     return updatedUser;
//   }

//   // Credit methods
//   async getCredits(): Promise<HydrogenCredit[]> {
//     return Array.from(this.credits.values());
//   }

//   async getCredit(id: string): Promise<HydrogenCredit | undefined> {
//     return this.credits.get(id);
//   }

//   async getCreditByTokenId(tokenId: string): Promise<HydrogenCredit | undefined> {
//     return Array.from(this.credits.values()).find(credit => credit.tokenId === tokenId);
//   }

//   async getCreditsByOwner(owner: string): Promise<HydrogenCredit[]> {
//     return Array.from(this.credits.values()).filter(credit => credit.currentOwner === owner);
//   }

//   async getCreditsByProducer(producer: string): Promise<HydrogenCredit[]> {
//     return Array.from(this.credits.values()).filter(credit => credit.producer === producer);
//   }

//   async createCredit(insertCredit: InsertHydrogenCredit): Promise<HydrogenCredit> {
//     const id = randomUUID();
//     const credit: HydrogenCredit = { 
//       ...insertCredit, 
//       id,
//       status: "active",
//       createdAt: new Date() 
//     };
//     this.credits.set(id, credit);
//     return credit;
//   }

//   async updateCredit(id: string, updates: Partial<HydrogenCredit>): Promise<HydrogenCredit | undefined> {
//     const credit = this.credits.get(id);
//     if (!credit) return undefined;
    
//     const updatedCredit = { ...credit, ...updates };
//     this.credits.set(id, updatedCredit);
//     return updatedCredit;
//   }

//   // Transaction methods
//   async getTransactions(): Promise<Transaction[]> {
//     return Array.from(this.transactions.values());
//   }

//   async getTransactionsByTokenId(tokenId: string): Promise<Transaction[]> {
//     return Array.from(this.transactions.values()).filter(tx => tx.tokenId === tokenId);
//   }

//   async getTransactionsByUser(userWallet: string): Promise<Transaction[]> {
//     return Array.from(this.transactions.values()).filter(tx => tx.from === userWallet || tx.to === userWallet);
//   }

//   async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
//     const id = randomUUID();
//     const transaction: Transaction = { 
//       ...insertTransaction, 
//       id,
//       timestamp: new Date() 
//     };
//     this.transactions.set(id, transaction);
//     return transaction;
//   }

//   // Project methods
//   async getProjects(): Promise<Project[]> {
//     return Array.from(this.projects.values());
//   }

//   async getProject(id: string): Promise<Project | undefined> {
//     return this.projects.get(id);
//   }

//   async getProjectsByProducer(producer: string): Promise<Project[]> {
//     return Array.from(this.projects.values()).filter(project => project.producer === producer);
//   }

//   async createProject(insertProject: InsertProject): Promise<Project> {
//     const id = randomUUID();
//     const project: Project = { 
//       ...insertProject, 
//       id,
//       status: "active",
//       totalCreditsIssued: 0,
//       createdAt: new Date() 
//     };
//     this.projects.set(id, project);
//     return project;
//   }

//   async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
//     const project = this.projects.get(id);
//     if (!project) return undefined;
    
//     const updatedProject = { ...project, ...updates };
//     this.projects.set(id, updatedProject);
//     return updatedProject;
//   }
// }

// export const storage = new MemStorage();

import {
  UserModel, CreditModel, TransactionModel, ListingModel,
  IUser, ICredit, ITransaction, IListing
} from './models';
// import { User, Credit, Transaction, Listing } from '../shared/schema';
import { User, Credit, Transaction, Listing } from '../server/schema';

// User storage operations
export const userStorage = {
  async create(userData: Omit<User, '_id'>): Promise<IUser> {
    const user = new UserModel(userData);
    return await user.save();
  },

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  },

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  },

  async update(id: string, updates: Partial<User>): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, updates, { new: true });
  },
};

// Credit storage operations
export const creditStorage = {
  async create(creditData: Omit<Credit, '_id'>): Promise<ICredit> {
    const credit = new CreditModel(creditData);
    return await credit.save();
  },

  async findByOwner(ownerId: string): Promise<ICredit[]> {
    return await CreditModel.find({ ownerId });
  },

  async findById(id: string): Promise<ICredit | null> {
    return await CreditModel.findById(id);
  },

  async update(id: string, updates: Partial<Credit>): Promise<ICredit | null> {
    return await CreditModel.findByIdAndUpdate(id, updates, { new: true });
  },

  async delete(id: string): Promise<boolean> {
    const result = await CreditModel.findByIdAndDelete(id);
    return result !== null;
  },

  async listCredits(filters: {
    creditType?: string;
    minPrice?: number;
    maxPrice?: number;
    vintage?: number;
    location?: string;
  }): Promise<ICredit[]> {
    const query: any = { isListed: true };
    
    if (filters.creditType) query.creditType = filters.creditType;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.pricePerCredit = {};
      if (filters.minPrice !== undefined) query.pricePerCredit.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.pricePerCredit.$lte = filters.maxPrice;
    }
    if (filters.vintage) query.vintage = filters.vintage;
    if (filters.location) query.location = new RegExp(filters.location, 'i');
    
    return await CreditModel.find(query).populate('ownerId', 'name email');
  },
};

// Transaction storage operations
export const transactionStorage = {
  async create(transactionData: Omit<Transaction, '_id'>): Promise<ITransaction> {
    const transaction = new TransactionModel(transactionData);
    return await transaction.save();
  },

  async findByUser(userId: string): Promise<ITransaction[]> {
    return await TransactionModel.find({
      $or: [{ sellerId: userId }, { buyerId: userId }]
    }).populate('creditId').populate('sellerId', 'name email').populate('buyerId', 'name email');
  },

  async findById(id: string): Promise<ITransaction | null> {
    return await TransactionModel.findById(id)
      .populate('creditId')
      .populate('sellerId', 'name email')
      .populate('buyerId', 'name email');
  },

  async updateStatus(id: string, status: 'pending' | 'completed' | 'failed'): Promise<ITransaction | null> {
    return await TransactionModel.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
  },
};

// Marketplace listing operations
export const listingStorage = {
  async create(listingData: Omit<Listing, '_id'>): Promise<IListing> {
    const listing = new ListingModel(listingData);
    return await listing.save();
  },

  async findActiveListings(): Promise<IListing[]> {
    return await ListingModel.find({ isActive: true })
      .populate('creditId')
      .populate('sellerId', 'name email');
  },

  async findBySeller(sellerId: string): Promise<IListing[]> {
    return await ListingModel.find({ sellerId, isActive: true })
      .populate('creditId');
  },

  async deactivateListing(id: string): Promise<IListing | null> {
    return await ListingModel.findByIdAndUpdate(
      id, 
      { isActive: false }, 
      { new: true }
    );
  },
};