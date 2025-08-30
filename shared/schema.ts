// Hydrogen Credit Types
export interface ProjectLocation {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  country: string;
  region: string;
}

export interface Certification {
  standard: string;
  level: string;
  issuer: string;
  validUntil: Date;
}

export interface HydrogenCredit {
  id: string;
  tokenId: string;
  producer: string;
  projectName: string;
  projectLocation: ProjectLocation;
  technology: "PEM Electrolysis" | "Alkaline Electrolysis" | "SOEC" | "Biomass Gasification";
  amount: number; // kg of H₂
  status: "active" | "traded" | "retired" | "verified";
  certificationLevel: string;
  pricePerKg?: string; // ETH per 100kg
  currentOwner: string;
  createdAt: Date;
  updatedAt: Date;
  mintingDate: Date;
  verificationDate?: Date;
  retirementDate?: Date;
  metadata: {
    carbonIntensity: number; // gCO2/kWh
    energySource: "Wind" | "Solar" | "Hydro" | "Geothermal" | "Nuclear";
    additionality: boolean;
    emissionsReduction: number; // tons CO2 equivalent
  };
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  tokenId: string;
  transactionHash: string;
  transactionType: "mint" | "trade" | "verify" | "retire";
  amount?: number;
  price?: string;
  timestamp: Date;
}

export interface User {
  id: string;
  walletAddress: string;
  did: string;
  role: "producer" | "trader" | "regulator" | "investor";
  verificationStatus: boolean;
  name: string;
  email: string;
  organization: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceStats {
  activeProjects: number;
  activeCredits: number;
  retiredCredits: number;
  totalVolume: number;
  recentTransactions: Transaction[];
}

export interface Project {
  id: string;
  name: string;
  location: ProjectLocation;
  technology: string;
  capacity: number;
  status: "active" | "pending" | "inactive";
  owner: string;
  certification: Certification;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
  organization?: string;
  role: User["role"];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// MongoDB Document Interfaces
export interface UserDocument extends User, Document {}
export interface CreditDocument extends HydrogenCredit, Document {}
export interface TransactionDocument extends Transaction, Document {}
export interface ProjectDocument extends Project, Document {}