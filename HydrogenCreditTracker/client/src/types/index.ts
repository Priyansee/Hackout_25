export interface User {
  id: string;
  walletAddress: string;
  did?: string;
  role: 'producer' | 'buyer' | 'regulator' | 'investor';
  verificationStatus: boolean;
  name?: string;
  organization?: string;
  location?: string;
  createdAt: Date;
}

export interface HydrogenCredit {
  id: string;
  tokenId: string;
  contractAddress: string;
  producer: string;
  producerWallet: string;
  currentOwner: string;
  projectLocation: {
    lat: number;
    lng: number;
    name: string;
  };
  amount: number;
  certificationHash: string;
  certificationLevel: string;
  technology: string;
  energySource: string;
  carbonIntensity: string;
  issuanceDate: Date;
  status: 'active' | 'traded' | 'retired';
  pricePerKg?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  tokenId: string;
  transactionHash: string;
  transactionType: 'mint' | 'trade' | 'retire';
  amount?: number;
  price?: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  name: string;
  producer: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  capacity: string;
  technology: string;
  energySource: string;
  certification: string;
  status: 'active' | 'inactive' | 'pending';
  totalCreditsIssued: number;
  createdAt: Date;
}

export interface MarketplaceListing extends HydrogenCredit {
  pricePerKg: string;
}

export interface Portfolio {
  credits: HydrogenCredit[];
  transactions: Transaction[];
  totalValue: number;
  totalAmount: number;
}

export interface ComplianceStats {
  totalCredits: number;
  activeCredits: number;
  retiredCredits: number;
  totalVolume: number;
  activeProjects: number;
  recentTransactions: Transaction[];
}
