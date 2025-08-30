import type { Express } from "express";
import { createServer, type Server } from "http";
// import { storage } from "./storage";
import { insertUserSchema, insertCreditSchema, insertTransactionSchema, registerSchema, loginSchema } from "@shared/schema";
// import { z } from "zod";
// import bcrypt from "bcryptjs";
// import session from "express-session";
import connectPg from "connect-pg-simple";

// // Session configuration
// if (!process.env.SESSION_SECRET) {
//   process.env.SESSION_SECRET = "development-secret-key-change-in-production";
// }

// const PgStore = connectPg(session);
// const sessionStore = new PgStore({
//   conString: process.env.DATABASE_URL,
//   createTableIfMissing: false,
//   tableName: "sessions",
//   ttl: 7 * 24 * 60 * 60, // 7 days
// });

// export async function registerRoutes(app: Express): Promise<Server> {
//   // Set up session middleware
//   app.use(session({
//     store: sessionStore,
//     secret: process.env.SESSION_SECRET!,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false, // Set to true in production with HTTPS
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     },
//   }));

//   // Authentication middleware
//   const requireAuth = (req: any, res: any, next: any) => {
//     if (!req.session.userId) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
//     next();
//   };

//   // Authentication routes
//   app.post("/api/auth/register", async (req, res) => {
//     try {
//       const validatedData = registerSchema.parse(req.body);
      
//       // Check if user already exists
//       const existingUser = await storage.getUserByEmail(validatedData.email);
//       if (existingUser) {
//         return res.status(400).json({ error: "User already exists with this email" });
//       }

//       // Hash password
//       const hashedPassword = await bcrypt.hash(validatedData.password, 10);

//       // Create user
//       const user = await storage.createUser({
//         email: validatedData.email,
//         password: hashedPassword,
//         name: validatedData.name,
//         organization: validatedData.organization || "",
//         role: validatedData.role,
//         walletAddress: null,
//         did: null,
//         location: "",
//       });

//       // Create session
//       (req as any).session.userId = user.id;

//       // Don't send password back
//       const { password, ...userWithoutPassword } = user;
//       res.json({ user: userWithoutPassword });
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return res.status(400).json({ error: "Validation failed", details: error.errors });
//       }
//       res.status(500).json({ error: "Registration failed" });
//     }
//   });

//   app.post("/api/auth/login", async (req, res) => {
//     try {
//       const validatedData = loginSchema.parse(req.body);
      
//       // Find user by email
//       const user = await storage.getUserByEmail(validatedData.email);
//       if (!user) {
//         return res.status(401).json({ error: "Invalid email or password" });
//       }

//       // Verify password
//       const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
//       if (!isValidPassword) {
//         return res.status(401).json({ error: "Invalid email or password" });
//       }

//       // Create session
//       (req as any).session.userId = user.id;

//       // Don't send password back
//       const { password, ...userWithoutPassword } = user;
//       res.json({ user: userWithoutPassword });
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return res.status(400).json({ error: "Validation failed", details: error.errors });
//       }
//       res.status(500).json({ error: "Login failed" });
//     }
//   });

//   app.post("/api/auth/logout", (req, res) => {
//     (req as any).session.destroy((err: any) => {
//       if (err) {
//         return res.status(500).json({ error: "Logout failed" });
//       }
//       res.json({ message: "Logged out successfully" });
//     });
//   });

//   app.get("/api/auth/user", requireAuth, async (req, res) => {
//     try {
//       const user = await storage.getUser((req as any).session.userId);
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       // Don't send password back
//       const { password, ...userWithoutPassword } = user;
//       res.json(userWithoutPassword);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch user" });
//     }
//   });

//   // Credits routes
//   app.get("/api/credits", async (req, res) => {
//     try {
//       const { status, producer, owner } = req.query;
//       let credits = await storage.getCredits();

//       if (status) {
//         credits = credits.filter(credit => credit.status === status);
//       }
//       if (producer) {
//         credits = credits.filter(credit => credit.producer === producer);
//       }
//       if (owner) {
//         credits = credits.filter(credit => credit.currentOwner === owner);
//       }

//       res.json(credits);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch credits" });
//     }
//   });

//   app.get("/api/credits/:tokenId", async (req, res) => {
//     try {
//       const credit = await storage.getCreditByTokenId(req.params.tokenId);
      
//       if (!credit) {
//         return res.status(404).json({ error: "Credit not found" });
//       }

//       const transactions = await storage.getTransactionsByTokenId(req.params.tokenId);
      
//       res.json({ credit, transactions });
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch credit details" });
//     }
//   });

//   app.post("/api/credits/mint", async (req, res) => {
//     try {
//       const validatedData = insertCreditSchema.parse(req.body);
//       const credit = await storage.createCredit(validatedData);

//       // Create mint transaction
//       await storage.createTransaction({
//         from: "0x0000000000000000000000000000000000000000",
//         to: validatedData.currentOwner,
//         tokenId: validatedData.tokenId,
//         transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
//         transactionType: "mint",
//         price: "0.00",
//       });

//       res.json(credit);
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return res.status(400).json({ error: "Invalid credit data", details: error.errors });
//       }
//       res.status(500).json({ error: "Failed to mint credit" });
//     }
//   });

//   app.put("/api/credits/:tokenId/retire", async (req, res) => {
//     try {
//       const credit = await storage.getCreditByTokenId(req.params.tokenId);
      
//       if (!credit) {
//         return res.status(404).json({ error: "Credit not found" });
//       }

//       if (credit.status !== "active") {
//         return res.status(400).json({ error: "Credit cannot be retired" });
//       }

//       const updatedCredit = await storage.updateCredit(credit.id, {
//         status: "retired",
//         metadata: {
//           ...credit.metadata,
//           retiredAt: new Date().toISOString(),
//           retiredBy: req.body.retiredBy,
//         },
//       });

//       // Create retirement transaction
//       await storage.createTransaction({
//         from: credit.currentOwner,
//         to: "0x0000000000000000000000000000000000000000",
//         tokenId: req.params.tokenId,
//         transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
//         transactionType: "retire",
//         amount: credit.amount,
//       });

//       res.json(updatedCredit);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to retire credit" });
//     }
//   });

//   // Marketplace routes
//   app.get("/api/marketplace/listings", async (req, res) => {
//     try {
//       const credits = await storage.getCredits();
//       const listings = credits.filter(credit => 
//         credit.status === "active" && 
//         credit.pricePerKg && 
//         parseFloat(credit.pricePerKg) > 0
//       );

//       res.json(listings);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch marketplace listings" });
//     }
//   });

//   app.post("/api/marketplace/list", async (req, res) => {
//     try {
//       const { tokenId, pricePerKg } = req.body;
      
//       const credit = await storage.getCreditByTokenId(tokenId);
//       if (!credit) {
//         return res.status(404).json({ error: "Credit not found" });
//       }

//       const updatedCredit = await storage.updateCredit(credit.id, {
//         pricePerKg: pricePerKg.toString(),
//       });

//       res.json(updatedCredit);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to list credit" });
//     }
//   });

//   app.post("/api/marketplace/trade", async (req, res) => {
//     try {
//       const { tokenId, buyer, seller, price, amount } = req.body;
      
//       const credit = await storage.getCreditByTokenId(tokenId);
//       if (!credit) {
//         return res.status(404).json({ error: "Credit not found" });
//       }

//       // Update credit owner
//       const updatedCredit = await storage.updateCredit(credit.id, {
//         currentOwner: buyer,
//         status: "traded",
//       });

//       // Create trade transaction
//       await storage.createTransaction({
//         from: seller,
//         to: buyer,
//         tokenId,
//         transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
//         transactionType: "trade",
//         amount: amount || credit.amount,
//         price: price.toString(),
//       });

//       res.json({ credit: updatedCredit, success: true });
//     } catch (error) {
//       res.status(500).json({ error: "Failed to execute trade" });
//     }
//   });

//   // User portfolio
//   app.get("/api/users/:walletAddress/portfolio", async (req, res) => {
//     try {
//       const credits = await storage.getCreditsByOwner(req.params.walletAddress);
//       const transactions = await storage.getTransactionsByUser(req.params.walletAddress);
      
//       res.json({ credits, transactions });
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch portfolio" });
//     }
//   });

//   // Projects routes
//   app.get("/api/projects", async (req, res) => {
//     try {
//       const projects = await storage.getProjects();
//       res.json(projects);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch projects" });
//     }
//   });

//   // Regulator routes
//   app.get("/api/regulator/compliance", async (req, res) => {
//     try {
//       const credits = await storage.getCredits();
//       const transactions = await storage.getTransactions();
//       const projects = await storage.getProjects();

//       const stats = {
//         totalCredits: credits.length,
//         activeCredits: credits.filter(c => c.status === "active").length,
//         retiredCredits: credits.filter(c => c.status === "retired").length,
//         totalVolume: credits.reduce((sum, c) => sum + c.amount, 0),
//         activeProjects: projects.filter(p => p.status === "active").length,
//         recentTransactions: transactions
//           .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
//           .slice(0, 20),
//       };

//       res.json(stats);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch compliance data" });
//     }
//   });

//   app.get("/api/regulator/credit-flows", async (req, res) => {
//     try {
//       const transactions = await storage.getTransactions();
      
//       // Group transactions by month
//       const flows = transactions.reduce((acc, tx) => {
//         const month = new Date(tx.timestamp).toISOString().slice(0, 7);
//         if (!acc[month]) acc[month] = { mints: 0, trades: 0, retirements: 0 };
//         acc[month][tx.transactionType === "mint" ? "mints" : tx.transactionType === "trade" ? "trades" : "retirements"]++;
//         return acc;
//       }, {} as Record<string, { mints: number; trades: number; retirements: number }>);

//       res.json(flows);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch credit flows" });
//     }
//   });

//   // Stats endpoint
//   app.get("/api/stats", async (req, res) => {
//     try {
//       const credits = await storage.getCredits();
//       const projects = await storage.getProjects();
//       const transactions = await storage.getTransactions();

//       const stats = {
//         totalCreditsIssued: credits.length,
//         activeProjects: projects.filter(p => p.status === "active").length,
//         verificationRate: 89.2,
//         tradingVolume: transactions
//           .filter(tx => tx.transactionType === "trade" && tx.price)
//           .reduce((sum, tx) => sum + parseFloat(tx.price || "0"), 0),
//       };

//       res.json(stats);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch stats" });
//     }
//   });

//   const httpServer = createServer(app);
//   return httpServer;
// }

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import {
  userStorage,
  creditStorage,
  transactionStorage,
  listingStorage
} from './storage';
import { UserSchema, CreditSchema, TransactionSchema } from '../server/schema';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
router.post('/auth/register', async (req, res) => {
  try {
    const userData = UserSchema.omit({ _id: true }).parse(req.body);
    
    // Check if user already exists
    const existingUser = await userStorage.findByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await userStorage.create({
      ...userData,
      password: hashedPassword
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await userStorage.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Credit routes
router.get('/credits', authenticateToken, async (req, res) => {
  try {
    const credits = await creditStorage.findByOwner(req.user.userId);
    res.json(credits);
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/credits', authenticateToken, async (req, res) => {
  try {
    const creditData = CreditSchema.omit({ _id: true, ownerId: true }).parse(req.body);
    const credit = await creditStorage.create({
      ...creditData,
      ownerId: req.user.userId
    });
    res.status(201).json(credit);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      console.error('Create credit error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.put('/credits/:id', authenticateToken, async (req, res) => {
  try {
    const credit = await creditStorage.findById(req.params.id);
    
    if (!credit) {
      return res.status(404).json({ error: 'Credit not found' });
    }
    
    if (credit.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const updates = CreditSchema.partial().parse(req.body);
    const updatedCredit = await creditStorage.update(req.params.id, updates);
    
    res.json(updatedCredit);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      console.error('Update credit error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Marketplace routes
router.get('/marketplace', async (req, res) => {
  try {
    const filters = {
      creditType: req.query.creditType as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      vintage: req.query.vintage ? Number(req.query.vintage) : undefined,
      location: req.query.location as string,
    };
    
    const credits = await creditStorage.listCredits(filters);
    res.json(credits);
  } catch (error) {
    console.error('Marketplace error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/marketplace/list/:creditId', authenticateToken, async (req, res) => {
  try {
    const { pricePerCredit, quantity } = req.body;
    const creditId = req.params.creditId;
    
    // Verify credit exists and belongs to user
    const credit = await creditStorage.findById(creditId);
    if (!credit) {
      return res.status(404).json({ error: 'Credit not found' });
    }
    
    if (credit.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    if (quantity > credit.quantity) {
      return res.status(400).json({ error: 'Not enough credits available' });
    }
    
    // Update credit to mark as listed
    await creditStorage.update(creditId, { isListed: true });
    
    // Create listing
    const listing = await listingStorage.create({
      creditId,
      sellerId: req.user.userId,
      quantity,
      pricePerCredit,
    });
    
    res.status(201).json(listing);
  } catch (error) {
    console.error('List credit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Transaction routes
router.post('/transactions', authenticateToken, async (req, res) => {
  try {
    const { listingId, quantity } = req.body;
    
    // Get listing
    const listing = await listingStorage.findById(listingId);
    if (!listing || !listing.isActive) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    if (quantity > listing.quantity) {
      return res.status(400).json({ error: 'Not enough credits available' });
    }
    
    // Create transaction
    const transactionData = {
      creditId: listing.creditId._id.toString(),
      sellerId: listing.sellerId._id.toString(),
      buyerId: req.user.userId,
      quantity,
      pricePerCredit: listing.pricePerCredit,
      totalAmount: quantity * listing.pricePerCredit,
      status: 'pending' as const,
    };
    
    const transaction = await transactionStorage.create(transactionData);
    
    // Update listing quantity or deactivate if all sold
    if (quantity === listing.quantity) {
      await listingStorage.deactivateListing(listingId);
    } else {
      await listingStorage.update(listingId, { quantity: listing.quantity - quantity });
    }
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await transactionStorage.findByUser(req.user.userId);
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;