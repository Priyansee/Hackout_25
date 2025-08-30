import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * USERS TABLE
 * Stores information about system users (buyers, producers, regulators, etc.)
 */
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), // Unique user ID
  walletAddress: text("wallet_address").notNull().unique(),       // Wallet address (unique)
  did: text("did"),                                               // Decentralized identifier
  role: text("role").notNull().default("buyer"),                  // User role (buyer, producer, regulator, investor)
  verificationStatus: boolean("verification_status").default(false), // Verification flag
  name: text("name"),                                             // Full name
  organization: text("organization"),                             // Associated organization
  location: text("location"),                                     // User’s location
  createdAt: timestamp("created_at").defaultNow(),                // Creation timestamp
});

/**
 * HYDROGEN CREDITS TABLE
 * Represents tokenized hydrogen credits with certification, ownership, and trading details
 */
export const hydrogenCredits = pgTable("hydrogen_credits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), // Unique credit ID
  tokenId: text("token_id").notNull().unique(),                   // Token ID (on-chain)
  contractAddress: text("contract_address").notNull(),            // Smart contract address
  producer: text("producer").notNull(),                           // Producer name
  producerWallet: text("producer_wallet").notNull(),              // Producer’s wallet address
  currentOwner: text("current_owner").notNull(),                  // Current owner wallet address
  projectLocation: jsonb("project_location")
    .$type<{ lat: number; lng: number; name: string }>()
    .notNull(),                                                   // Project location (lat, lng, name)
  amount: integer("amount").notNull(),                            // Hydrogen amount in kg
  certificationHash: text("certification_hash").notNull(),        // Certification document hash
  certificationLevel: text("certification_level").notNull(),      // Certification type (Premium, Standard)
  technology: text("technology").notNull(),                       // Production tech (e.g., PEM Electrolysis)
  energySource: text("energy_source").notNull(),                  // Energy source (Solar, Wind, etc.)
  carbonIntensity: decimal("carbon_intensity", { precision: 5, scale: 2 }).notNull(), // Carbon intensity (gCO₂/kg)
  issuanceDate: timestamp("issuance_date").notNull(),             // Issuance date
  status: text("status").notNull().default("active"),             // Status (active, traded, retired)
  pricePerKg: decimal("price_per_kg", { precision: 10, scale: 6 }), // Price per kg (ETH)
  metadata: jsonb("metadata").$type<Record<string, any>>(),       // Extra metadata (flexible)
  createdAt: timestamp("created_at").defaultNow(),                // Creation timestamp
});

/**
 * TRANSACTIONS TABLE
 * Logs credit-related blockchain transactions (mint, trade, retire)
 */
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), // Unique transaction ID
  from: text("from").notNull(),                                   // Sender wallet
  to: text("to").notNull(),                                       // Receiver wallet
  tokenId: text("token_id").notNull(),                            // Token ID involved
  transactionHash: text("transaction_hash").notNull(),            // Blockchain TX hash
  transactionType: text("transaction_type").notNull(),            // Type: mint, trade, retire
  amount: integer("amount"),                                      // Amount (for partial trades)
  price: decimal("price", { precision: 10, scale: 6 }),           // Price in ETH
  timestamp: timestamp("timestamp").defaultNow(),                 // Timestamp
});

/**
 * PROJECTS TABLE
 * Defines hydrogen production projects linked to issued credits
 */
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), // Unique project ID
  name: text("name").notNull(),                                   // Project name
  producer: text("producer").notNull(),                           // Producer name
  location: jsonb("location")
    .$type<{ lat: number; lng: number; name: string }>()
    .notNull(),                                                   // Project location (lat, lng, name)
  capacity: text("capacity").notNull(),                           // Capacity (MW)
  technology: text("technology").notNull(),                       // Technology used
  energySource: text("energy_source").notNull(),                  // Energy source
  certification: text("certification").notNull(),                 // Certification
  status: text("status").notNull().default("active"),             // Project status (active, inactive, pending)
  totalCreditsIssued: integer("total_credits_issued").default(0), // Total credits issued
  createdAt: timestamp("created_at").defaultNow(),                // Creation timestamp
});

/**
 * Zod Schemas for Input Validation
 * Restrict fields for insert operations (protects against unwanted input)
 */
export const insertUserSchema = createInsertSchema(users).pick({
  walletAddress: true,
  did: true,
  role: true,
  name: true,
  organization: true,
  location: true,
});

export const insertCreditSchema = createInsertSchema(hydrogenCredits).pick({
  tokenId: true,
  contractAddress: true,
  producer: true,
  producerWallet: true,
  currentOwner: true,
  projectLocation: true,
  amount: true,
  certificationHash: true,
  certificationLevel: true,
  technology: true,
  energySource: true,
  carbonIntensity: true,
  issuanceDate: true,
  pricePerKg: true,
  metadata: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  from: true,
  to: true,
  tokenId: true,
  transactionHash: true,
  transactionType: true,
  amount: true,
  price: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  producer: true,
  location: true,
  capacity: true,
  technology: true,
  energySource: true,
  certification: true,
});

/**
 * TypeScript Types for Query Results and Inserts
 */
export type User = typeof users.$inferSelect;                          // User row type
export type InsertUser = z.infer<typeof insertUserSchema>;              // Insert User type
export type HydrogenCredit = typeof hydrogenCredits.$inferSelect;      // Hydrogen Credit row type
export type InsertHydrogenCredit = z.infer<typeof insertCreditSchema>;  // Insert Credit type
export type Transaction = typeof transactions.$inferSelect;            // Transaction row type
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;// Insert Transaction type
export type Project = typeof projects.$inferSelect;                    // Project row type
export type InsertProject = z.infer<typeof insertProjectSchema>;        // Insert Project type