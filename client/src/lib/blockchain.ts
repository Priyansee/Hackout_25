// Mock blockchain interaction utilities
export class MockBlockchain {
  private static instance: MockBlockchain;
  
  static getInstance(): MockBlockchain {
    if (!MockBlockchain.instance) {
      MockBlockchain.instance = new MockBlockchain();
    }
    return MockBlockchain.instance;
  }

  async connectWallet(): Promise<string> {
    // Simulate wallet connection
    await this.delay(1000);
    
    // Return a mock wallet address
    const addresses = [
      '0x742d35Cc6554C19c3a5Cc2A1d4e9e7b8f1a2e8f9',
      '0x8f1a2e9c742d35Cc6554C19c3a5Cc2A1d4e9e7b8',
      '0x456def789abc123456789def0123456789abcdef',
      '0x123456789abcdef0123456789abcdef012345678',
    ];
    
    return addresses[Math.floor(Math.random() * addresses.length)];
  }

  async getBalance(address: string): Promise<string> {
    await this.delay(500);
    return (Math.random() * 10).toFixed(4);
  }

  async mintCredit(creditData: any): Promise<string> {
    await this.delay(2000);
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  }

  async tradeCredit(tokenId: string, buyer: string, price: string): Promise<string> {
    await this.delay(1500);
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  }

  async retireCredit(tokenId: string): Promise<string> {
    await this.delay(1000);
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  }

  async verifyTransaction(txHash: string): Promise<boolean> {
    await this.delay(500);
    return true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const blockchain = MockBlockchain.getInstance();

// Smart contract interfaces
export interface HydrogenCreditContract {
  mint(to: string, tokenId: string, metadata: any): Promise<string>;
  transfer(from: string, to: string, tokenId: string): Promise<string>;
  retire(tokenId: string): Promise<string>;
  getMetadata(tokenId: string): Promise<any>;
}

export interface MarketplaceContract {
  listCredit(tokenId: string, price: string): Promise<string>;
  buyCredit(tokenId: string, buyer: string): Promise<string>;
  cancelListing(tokenId: string): Promise<string>;
}

export interface IdentityRegistryContract {
  registerDID(did: string, walletAddress: string): Promise<string>;
  verifyUser(walletAddress: string): Promise<boolean>;
  updateRole(walletAddress: string, role: string): Promise<string>;
}

// Mock contract instances
export const mockContracts = {
  hydrogenCredit: {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    abi: [], // Would contain actual ABI in real implementation
  },
  marketplace: {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    abi: [],
  },
  identityRegistry: {
    address: '0x567890abcdef1234567890abcdef1234567890ab',
    abi: [],
  },
};
