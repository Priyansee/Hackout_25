import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCreditSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/connect-wallet", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address is required" });
      }

      // Check if user already exists with this wallet address
      let user = await storage.getUserByWallet(walletAddress);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          walletAddress,
          role: "buyer",
          name: "",
          organization: "",
          location: "",
        });
      }

      // Respond back with user info
      // Also tell if user is new (based on verification status)
      res.json({ user, isNewUser: !user.verificationStatus });
    } catch (error) {
      res.status(500).json({ error: "Failed to connect wallet" });
    }
  });
  
  // This endpoint is used to verify the user's decentralized identity (DID)
  app.post("/api/auth/verify-did", async (req, res) => {
    try {
      const { userId, did, name, organization, location, role } = req.body;
      
      const user = await storage.updateUser(userId, {
        did,
        name,
        organization,
        location,
        role,
        verificationStatus: true,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Failed to verify DID" });
    }
  });

  // Credits routes
  app.get("/api/credits", async (req, res) => {
    try {
      const { status, producer, owner } = req.query;
      let credits = await storage.getCredits();

      if (status) {
        credits = credits.filter(credit => credit.status === status);
      }
      if (producer) {
        credits = credits.filter(credit => credit.producer === producer);
      }
      if (owner) {
        credits = credits.filter(credit => credit.currentOwner === owner);
      }

      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch credits" });
    }
  });

  app.get("/api/credits/:tokenId", async (req, res) => {
    try {
      const credit = await storage.getCreditByTokenId(req.params.tokenId);
      
      if (!credit) {
        return res.status(404).json({ error: "Credit not found" });
      }

      const transactions = await storage.getTransactionsByTokenId(req.params.tokenId);
      
      res.json({ credit, transactions });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch credit details" });
    }
  });

  app.post("/api/credits/mint", async (req, res) => {
    try {
      const validatedData = insertCreditSchema.parse(req.body);
      const credit = await storage.createCredit(validatedData);

      // Create mint transaction
      await storage.createTransaction({
        from: "0x0000000000000000000000000000000000000000",
        to: validatedData.currentOwner,
        tokenId: validatedData.tokenId,
        transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
        transactionType: "mint",
        price: "0.00",
      });

      res.json(credit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid credit data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to mint credit" });
    }
  });

  app.put("/api/credits/:tokenId/retire", async (req, res) => {
    try {
      const credit = await storage.getCreditByTokenId(req.params.tokenId);
      
      if (!credit) {
        return res.status(404).json({ error: "Credit not found" });
      }

      if (credit.status !== "active") {
        return res.status(400).json({ error: "Credit cannot be retired" });
      }

      const updatedCredit = await storage.updateCredit(credit.id, {
        status: "retired",
        metadata: {
          ...credit.metadata,
          retiredAt: new Date().toISOString(),
          retiredBy: req.body.retiredBy,
        },
      });

      // Create retirement transaction
      await storage.createTransaction({
        from: credit.currentOwner,
        to: "0x0000000000000000000000000000000000000000",
        tokenId: req.params.tokenId,
        transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
        transactionType: "retire",
        amount: credit.amount,
      });

      res.json(updatedCredit);
    } catch (error) {
      res.status(500).json({ error: "Failed to retire credit" });
    }
  });

  // Marketplace routes
  app.get("/api/marketplace/listings", async (req, res) => {
    try {
      const credits = await storage.getCredits();
      const listings = credits.filter(credit => 
        credit.status === "active" && 
        credit.pricePerKg && 
        parseFloat(credit.pricePerKg) > 0
      );

      res.json(listings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch marketplace listings" });
    }
  });

  app.post("/api/marketplace/list", async (req, res) => {
    try {
      const { tokenId, pricePerKg } = req.body;
      
      const credit = await storage.getCreditByTokenId(tokenId);
      if (!credit) {
        return res.status(404).json({ error: "Credit not found" });
      }

      const updatedCredit = await storage.updateCredit(credit.id, {
        pricePerKg: pricePerKg.toString(),
      });

      res.json(updatedCredit);
    } catch (error) {
      res.status(500).json({ error: "Failed to list credit" });
    }
  });

  app.post("/api/marketplace/trade", async (req, res) => {
    try {
      const { tokenId, buyer, seller, price, amount } = req.body;
      
      const credit = await storage.getCreditByTokenId(tokenId);
      if (!credit) {
        return res.status(404).json({ error: "Credit not found" });
      }

      // Update credit owner
      const updatedCredit = await storage.updateCredit(credit.id, {
        currentOwner: buyer,
        status: "traded",
      });

      // Create trade transaction
      await storage.createTransaction({
        from: seller,
        to: buyer,
        tokenId,
        transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
        transactionType: "trade",
        amount: amount || credit.amount,
        price: price.toString(),
      });

      res.json({ credit: updatedCredit, success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to execute trade" });
    }
  });

  // User portfolio
  app.get("/api/users/:walletAddress/portfolio", async (req, res) => {
    try {
      const credits = await storage.getCreditsByOwner(req.params.walletAddress);
      const transactions = await storage.getTransactionsByUser(req.params.walletAddress);
      
      res.json({ credits, transactions });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Regulator routes
  app.get("/api/regulator/compliance", async (req, res) => {
    try {
      const credits = await storage.getCredits();
      const transactions = await storage.getTransactions();
      const projects = await storage.getProjects();

      const stats = {
        totalCredits: credits.length,
        activeCredits: credits.filter(c => c.status === "active").length,
        retiredCredits: credits.filter(c => c.status === "retired").length,
        totalVolume: credits.reduce((sum, c) => sum + c.amount, 0),
        activeProjects: projects.filter(p => p.status === "active").length,
        recentTransactions: transactions
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 20),
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch compliance data" });
    }
  });

  app.get("/api/regulator/credit-flows", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      
      // Group transactions by month
      const flows = transactions.reduce((acc, tx) => {
        const month = new Date(tx.timestamp).toISOString().slice(0, 7);
        if (!acc[month]) acc[month] = { mints: 0, trades: 0, retirements: 0 };
        acc[month][tx.transactionType === "mint" ? "mints" : tx.transactionType === "trade" ? "trades" : "retirements"]++;
        return acc;
      }, {} as Record<string, { mints: number; trades: number; retirements: number }>);

      res.json(flows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch credit flows" });
    }
  });

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const credits = await storage.getCredits();
      const projects = await storage.getProjects();
      const transactions = await storage.getTransactions();

      const stats = {
        totalCreditsIssued: credits.length,
        activeProjects: projects.filter(p => p.status === "active").length,
        verificationRate: 89.2,
        tradingVolume: transactions
          .filter(tx => tx.transactionType === "trade" && tx.price)
          .reduce((sum, tx) => sum + parseFloat(tx.price || "0"), 0),
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
