import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  did: text("did"),
  role: text("role").notNull().default("buyer"), // producer, buyer, regulator, investor
  verificationStatus: boolean("verification_status").default(false),
  name: text("name"),
  organization: text("organization"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const hydrogenCredits = pgTable("hydrogen_credits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: text("token_id").notNull().unique(),
  contractAddress: text("contract_address").notNull(),
  producer: text("producer").notNull(),
  producerWallet: text("producer_wallet").notNull(),
  currentOwner: text("current_owner").notNull(),
  projectLocation: jsonb("project_location").$type<{ lat: number; lng: number; name: string }>().notNull(),
  amount: integer("amount").notNull(), // kg H2
  certificationHash: text("certification_hash").notNull(),
  certificationLevel: text("certification_level").notNull(), // Premium, Standard
  technology: text("technology").notNull(), // PEM Electrolysis, etc.
  energySource: text("energy_source").notNull(), // Solar, Wind, etc.
  carbonIntensity: decimal("carbon_intensity", { precision: 5, scale: 2 }).notNull(),
  issuanceDate: timestamp("issuance_date").notNull(),
  status: text("status").notNull().default("active"), // active, traded, retired
  pricePerKg: decimal("price_per_kg", { precision: 10, scale: 6 }), // ETH per kg
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  from: text("from").notNull(),
  to: text("to").notNull(),
  tokenId: text("token_id").notNull(),
  transactionHash: text("transaction_hash").notNull(),
  transactionType: text("transaction_type").notNull(), // mint, trade, retire
  amount: integer("amount"), // for partial trades
  price: decimal("price", { precision: 10, scale: 6 }), // ETH
  timestamp: timestamp("timestamp").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  producer: text("producer").notNull(),
  location: jsonb("location").$type<{ lat: number; lng: number; name: string }>().notNull(),
  capacity: text("capacity").notNull(), // MW
  technology: text("technology").notNull(),
  energySource: text("energy_source").notNull(),
  certification: text("certification").notNull(),
  status: text("status").notNull().default("active"), // active, inactive, pending
  totalCreditsIssued: integer("total_credits_issued").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

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

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type HydrogenCredit = typeof hydrogenCredits.$inferSelect;
export type InsertHydrogenCredit = z.infer<typeof insertCreditSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
