export const HYDROGEN_COLORS = {
  BLUE: '#00BFFF',
  GREEN: '#32CD32',
  DARK: '#0D1117',
} as const;

export const CREDIT_STATUS = {
  ACTIVE: 'active',
  TRADED: 'traded',
  RETIRED: 'retired',
} as const;

export const USER_ROLES = {
  PRODUCER: 'producer',
  BUYER: 'buyer',
  REGULATOR: 'regulator',
  INVESTOR: 'investor',
} as const;

export const TRANSACTION_TYPES = {
  MINT: 'mint',
  TRADE: 'trade',
  RETIRE: 'retire',
} as const;

export const CERTIFICATION_LEVELS = {
  PREMIUM: 'Premium Green',
  STANDARD: 'Standard Green',
} as const;

export const MOCK_WALLET_ADDRESSES = {
  PRODUCER_1: '0x742d35Cc6554C19c3a5Cc2A1d4e9e7b8f1a2e8f9',
  PRODUCER_2: '0x8f1a2e9c742d35Cc6554C19c3a5Cc2A1d4e9e7b8',
  REGULATOR: '0x456def789abc123456789def0123456789abcdef',
  BUYER: '0x123456789abcdef0123456789abcdef012345678',
} as const;

export const SAMPLE_PROJECTS = [
  {
    name: 'Mojave Solar H2 Plant',
    location: 'Mojave Desert, CA',
    coordinates: { lat: 35.0528, lng: -115.4681 },
  },
  {
    name: 'North Sea Wind H2 Facility',
    location: 'Stockholm, Sweden',
    coordinates: { lat: 59.3293, lng: 18.0686 },
  },
  {
    name: 'Alpine Hydro H2 Station',
    location: 'Bavaria, Germany',
    coordinates: { lat: 47.5596, lng: 10.7498 },
  },
] as const;
